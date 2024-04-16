import fs from 'fs/promises';
import { ProcessType } from "./processTypes.js";
import path from 'path';

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
    action: (args?: Array<IProcessCommandArgInput>) => any | Promise<any>;
    args?: Array<IProcessCommandArg>;
    description?: string;
}

interface IProcessExecuteCommand {
    command: IProcessCommand<ProcessType>['name'];
    params: Array<IProcessCommandArgInput>;
    result?: IProcessCommandOutput;
}

interface IProcessCommands extends Map<IProcessCommand['name'], IProcessCommand> {}

class ProcessCommands extends Map<IProcessCommand['name'], IProcessCommand> implements IProcessCommands {
    constructor(...commands: Array<IProcessCommand>) {
        super(commands.map((command) => [command.name, command]));
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
    const harmfulKeywords = ['exec', 'child_process', 'spawn', 'eval', 'Function', 'constructor', 'this', 'require', 'import'];
    for (const keyword of harmfulKeywords) {
        if (action.includes(keyword)) {
            throw new Error(`Potentially harmful keyword "${keyword}" found in action.`);
        }
    }
    return eval(action);
}

const importProcessCommands = async (filepath: string): Promise<IProcessCommands> => {
    const commands = new ProcessCommands();
    const __dirname = path.resolve();
    const __path = path.join(__dirname, filepath);

    try {
        const file = await fs.readFile(__path, 'utf-8');
        const json = JSON.parse(file);

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
