
import { ProcessType } from "./processTypes.js";
import { IProcessContainer, createProcessContainer } from './processContainer.js';

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
    action: (args?: Array<IProcessCommandArgInput>, instance?: IProcessContainer<ProcessType>['instance']) => Promise<any> | any ;
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
    container?: IProcessContainer | undefined;

    isUnique(name: IProcessCommand['name']): boolean;
    loadContainer(container: IProcessContainer<IProcessCommand['type']>): void
}


class ProcessCommands extends Map<IProcessCommand['name'], IProcessCommand> implements IProcessCommands, IProcessContainer<IProcessCommand['type']>{
    public readonly type: ProcessType = ProcessType.CUSTOM;
    public container: IProcessContainer | undefined;

    constructor({
        commands,
        container
    }:{
        commands?: Array<IProcessCommand>,
        container?: IProcessContainer<IProcessCommand['type']>
    } = {}) {
        super();

        this.container = container;

        if (commands) {
            for (const command of commands) {
                this.set(command.name, command);
            }
        }
    }

    isUnique(name: IProcessCommand['name']) {
        return !this.has(name);
    }

    loadContainer(container: IProcessContainer<ProcessType>): void {
        this.container = container
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
