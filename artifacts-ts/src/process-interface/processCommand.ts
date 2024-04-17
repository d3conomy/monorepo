
import { ProcessType } from "./processTypes.js";
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
    action: (args?: Array<IProcessCommandArgInput>, process?: IProcessContainer<T>['process']) => any | Promise<any>;
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


class ProcessCommands extends Map<IProcessCommand['name'], IProcessCommand> implements IProcessCommands, IProcessContainer<IProcessCommand['name']>{
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

        this.process = {
            type: this.type,
            process: proc
        }

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

export {
    createProcessCommandArgs,
    createProcessCommand,
    IProcessCommand,
    IProcessCommands,
    IProcessCommandArg,
    IProcessCommandArgInput,
    IProcessCommandOutput,
    IProcessExecuteCommand,
    ProcessCommands
}
