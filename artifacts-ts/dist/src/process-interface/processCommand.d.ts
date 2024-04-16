import { ProcessType } from "./processTypes.js";
interface IProcessCommandArg {
    name: string;
    description: string;
    required: boolean;
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
interface IProcessCommands extends Map<IProcessCommand['name'], IProcessCommand> {
}
declare class ProcessCommands extends Map<IProcessCommand['name'], IProcessCommand> implements IProcessCommands {
    constructor(...commands: Array<IProcessCommand>);
    isUnique(name: IProcessCommand['name']): boolean;
}
declare const createProcessCommandArgs: ({ name, description, required }: {
    name: string;
    description: string;
    required: boolean;
}) => IProcessCommandArg;
declare const createProcessCommand: ({ name, action, args, type, description }: {
    name: string;
    action: IProcessCommand['action'];
    args?: IProcessCommandArg[] | undefined;
    type?: ProcessType | undefined;
    description?: string | undefined;
}) => IProcessCommand;
declare const importProcessCommands: (filepath: string) => Promise<IProcessCommands>;
export { createProcessCommandArgs, createProcessCommand, importProcessCommands, IProcessCommand, IProcessCommands, IProcessCommandArg, IProcessCommandArgInput, IProcessCommandOutput, IProcessExecuteCommand, ProcessCommands };
//# sourceMappingURL=processCommand.d.ts.map