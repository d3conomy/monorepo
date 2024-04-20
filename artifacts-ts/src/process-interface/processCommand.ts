
import { ProcessType } from "./processTypes.js";
import { IProcessContainer } from './processContainer.js';

interface IProcessCommandArg {
    name: string;
    description: string;
    required: boolean;
    default?: any;

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

interface IProcessCommand {
    type: ProcessType;
    name: string;
    action: (args?: Array<IProcessCommandArgInput>, process?: IProcessContainer<ProcessType>['process']) => Promise<any> | any ;
    args: Array<IProcessCommandArg>;
    description?: string;
}

interface IProcessExecuteCommand {
    command: IProcessCommand['name'];
    params?: Array<IProcessCommandArgInput>;
    result?: IProcessCommandOutput;
}

interface IProcessCommands extends Map<IProcessCommand['name'], IProcessCommand>, IProcessContainer<ProcessType> {
    type: IProcessCommand['type'];
    process?: IProcessContainer | undefined;

    isUnique(name: IProcessCommand['name']): boolean;
    loadProcess(proc: IProcessContainer<IProcessCommand['type']>): void
}


class ProcessCommands extends Map<IProcessCommand['name'], IProcessCommand> implements IProcessCommands, IProcessContainer<IProcessCommand['type']>{
    public readonly type: ProcessType = ProcessType.CUSTOM;
    public process?: IProcessContainer | undefined;

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

    loadProcess(proc: IProcessContainer<ProcessType>): void {
        this.process = proc
    }
}

const createProcessCommandArgs = ({
    name,
    description,
    required,
    defaultValue
}: {
    name: string,
    description: string,
    required: boolean,
    defaultValue?: any
}): IProcessCommandArg => {
    return {
        name,
        description,
        required,
        default: defaultValue,

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
    action: () => Promise<any>,
    args?: Array<IProcessCommandArg>, 
    type?: ProcessType
    description?: string
}): IProcessCommand => {
    if (!type) {
        type = ProcessType.CUSTOM;
    }

    if (!args) {
        args = [];
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
