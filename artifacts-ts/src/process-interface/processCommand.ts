import fs from 'fs/promises';
import { ProcessType } from "./processTypes.js";
import path from 'path';
import { IProcess } from './index.js';
import { IProcessContainer } from './processContainer.js';

interface IProcessCommandArg {
    name: string;
    description: string;
    required: boolean

    toString(): string;
}

interface IProcessCommandArgInput {
    name: IProcessCommandArg['name'];
    value: any;
}

interface IProcessCommandOutput {
    output: any;
    runtime: number;
}

interface IProcessCommand<T = ProcessType> {
    type: T;
    name: string;
    action: (args?: Array<IProcessCommandArgInput>, process?: IProcessContainer['process']) => any | Promise<any>;
    args?: Array<IProcessCommandArg>;
    description?: string;
}

interface IProcessExecuteCommand {
    command: IProcessCommand<ProcessType>['name'];
    params: Array<IProcessCommandArgInput>;
    result?: IProcessCommandOutput;
}

interface IProcessCommands extends Map<IProcessCommand['name'], IProcessCommand>, IProcessContainer<IProcessCommand['name']> {
    type: IProcessCommand['name'];
    process?: IProcessContainer | undefined;

    isUnique(name: IProcessCommand['name']): boolean;
}


class ProcessCommands extends Map<IProcessCommand['name'], IProcessCommand> implements IProcessCommands{
    public readonly type: ProcessType = ProcessType.CUSTOM;
    public readonly process?: IProcessContainer | undefined;

    constructor({
        commands,
        proc
    }:{
        commands?: Array<IProcessCommand>,
        proc?: any
    } = {}) {
        super();

        // if (proc && typeof proc === 'function') {
            this.process = {
                type: this.type,
                process: proc
            }
        // }

        // if (proc && typeof proc === 'object') {
        //     this.process = proc;
        // }

        if (commands) {
            for (const command of commands) {
                this.set(command.name, command);
            }
        }
    }

    isUnique(name: IProcessCommand['name']) {
        return !this.has(name);
    }
}

const createProcessCommandArgs = ({
    name,
    description,
    required
}: {
    name: string,
    description: string,
    required: boolean
}): IProcessCommandArg => {
    return {
        name,
        description,
        required,

        toString() {
            return this.name;
        }
    }
}

const createProcessCommand = ({
    name,
    action,
    args,
    type,
    description
}: {
    name: string,
    process?: IProcessContainer,
    action: IProcessCommand['action'],
    args?: Array<IProcessCommandArg>,
    type?: ProcessType
    description?: string
}): IProcessCommand => {
    if (!type) {
        type = ProcessType.CUSTOM;
    }

    return {
        name,
        action,
        args,
        type,
        description
    }
}

/**
 * Make sure the action is sanitized before executing
 * @param action 
 * @returns 
 */
const sanitizeEval = (action: string) => {
    const harmfulKeywords = ['exec', 'child_process', 'spawn', 'eval', 'Function', 'constructor', 'require', 'import'];
    for (const keyword of harmfulKeywords) {
        if (action.includes(keyword)) {
            throw new Error(`Potentially harmful keyword "${keyword}" found in action.`);
        }
    }
    return eval(action);
}

const importProcessCommands = async (filepath: string): Promise<IProcessCommands> => {
    let commands: ProcessCommands;
    const __dirname = path.resolve();
    const __path = path.join(__dirname, filepath);

    try {
        const file = await fs.readFile(__path, 'utf-8');
        const json = JSON.parse(file);
        commands = new ProcessCommands({
            proc: sanitizeEval(json.process)
        });

        console.log(`Importing process commands from ${filepath}, Process Found: ${commands.process}`);

        for (const command of json.commands) {
            command.action = sanitizeEval(command.action);
            commands.set(command.name, command);
        }
    }
    catch (error: any) {
        throw new Error(`Error reading file from disk: ${error}`);
    }

    return commands
}

export {
    createProcessCommandArgs,
    createProcessCommand,
    importProcessCommands,
    IProcessCommand,
    IProcessCommands,
    IProcessCommandArg,
    IProcessCommandArgInput,
    IProcessCommandOutput,
    IProcessExecuteCommand,
    ProcessCommands
}
