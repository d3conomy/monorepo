import { ProcessType } from "./processTypes.js";

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
    runtime: Date;
}

interface IProcessCommand<T = ProcessType> {
    type: T;
    name: string;
    action: (args: Array<IProcessCommandArgInput>) => any;
    args?: Array<IProcessCommandArg>;
    description?: string;
}

interface IProcessExecuteCommand {
    command: IProcessCommand<ProcessType>['name'];
    params: Array<IProcessCommandArgInput>;
    result: IProcessCommandOutput;
}

interface IProcessCommands extends Map<IProcessCommand['name'], IProcessCommand> {
    isUnique: (name: IProcessCommand['name']) => boolean;
}

class ProcessCommands extends Map<IProcessCommand['name'], IProcessCommand> implements IProcessCommands {
    constructor(...commands: Array<IProcessCommand>) {
        super(commands.map((command) => [command.name, command]));
    }

    isUnique(name: IProcessCommand['name']) {
        return !this.has(name);
    }
}

export {
    IProcessCommand,
    IProcessCommands,
    IProcessCommandArg,
    IProcessCommandArgInput,
    IProcessCommandOutput,
    IProcessExecuteCommand,
    ProcessCommands
}
