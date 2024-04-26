import { PodProcessId } from "../id-reference-factory/index.js";
import { IProcessCommand, IProcessCommands, ProcessCommands } from "./processCommand.js";
import { IProcessContainer } from "./processContainer.js";
import { JobQueue } from "./processJobQueue.js";
import { ProcessStage } from "./processStages.js";
interface IProcess {
    id: PodProcessId;
    container?: IProcessContainer;
    commands: IProcessCommands;
    jobQueue: JobQueue;
    check(): boolean;
    status(): ProcessStage;
    init(): Promise<void>;
    start(parallel?: boolean): Promise<void>;
    stop(): Promise<void>;
    restart(): Promise<void>;
}
declare class Process implements IProcess {
    id: PodProcessId;
    container?: IProcessContainer;
    commands: ProcessCommands;
    jobQueue: JobQueue;
    constructor(id: PodProcessId, container: IProcessContainer, commands: Array<IProcessCommand>);
    check(): boolean;
    status(): ProcessStage;
    init(): Promise<void>;
    start(parallel?: boolean): Promise<void>;
    stop(): Promise<void>;
    restart(): Promise<void>;
}
declare const createProcess: (id: PodProcessId, container: IProcessContainer, commands: Array<IProcessCommand> | ProcessCommands) => IProcess;
export { createProcess, IProcess, Process };
//# sourceMappingURL=process.d.ts.map