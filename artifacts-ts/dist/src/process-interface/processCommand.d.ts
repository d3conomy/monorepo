import { ProcessType } from "./processTypes.js";
import { IProcessContainer } from './processContainer.js';
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
declare class ProcessCommands extends Map<IProcessCommand['name'], IProcessCommand> implements IProcessCommands, IProcessContainer<IProcessCommand['name']> {
    readonly type: ProcessType;
    readonly process?: IProcessContainer | undefined;
    constructor({ commands, proc }?: {
        commands?: Array<IProcessCommand>;
        proc?: any;
    });
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
export { createProcessCommandArgs, createProcessCommand, IProcessCommand, IProcessCommands, IProcessCommandArg, IProcessCommandArgInput, IProcessCommandOutput, IProcessExecuteCommand, ProcessCommands };
//# sourceMappingURL=processCommand.d.ts.map