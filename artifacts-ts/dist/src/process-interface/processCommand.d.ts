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
    action: (args?: Array<IProcessCommandArgInput>, process?: IProcessContainer<ProcessType>['process']) => Promise<any> | any;
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
    loadProcess(proc: IProcessContainer<IProcessCommand['type']>): void;
}
declare class ProcessCommands extends Map<IProcessCommand['name'], IProcessCommand> implements IProcessCommands, IProcessContainer<IProcessCommand['type']> {
    readonly type: ProcessType;
    process?: IProcessContainer | undefined;
    constructor({ commands, proc }?: {
        commands?: Array<IProcessCommand>;
        proc?: any;
    });
    isUnique(name: IProcessCommand['name']): boolean;
    loadProcess(proc: IProcessContainer<ProcessType>): void;
}
declare const createProcessCommandArgs: ({ name, description, required, defaultValue }: {
    name: string;
    description: string;
    required: boolean;
    defaultValue?: any;
}) => IProcessCommandArg;
declare const createProcessCommand: ({ name, action, args, type, description }: {
    name: string;
    action: () => Promise<any>;
    args?: IProcessCommandArg[] | undefined;
    type?: ProcessType | undefined;
    description?: string | undefined;
}) => IProcessCommand;
export { createProcessCommandArgs, createProcessCommand, IProcessCommand, IProcessCommands, IProcessCommandArg, IProcessCommandArgInput, IProcessCommandOutput, IProcessExecuteCommand, ProcessCommands };
//# sourceMappingURL=processCommand.d.ts.map