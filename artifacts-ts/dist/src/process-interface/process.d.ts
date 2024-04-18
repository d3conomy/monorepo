import { PodProcessId } from "../id-reference-factory/index.js";
import { IProcessCommands } from "./processCommand.js";
import { IProcessContainer } from "./processContainer.js";
import { JobQueue } from "./processJobQueue.js";
import { ProcessStage } from "./processStages.js";
interface IProcess {
    id: PodProcessId;
    process?: IProcessContainer;
    commands?: IProcessCommands;
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
    process?: IProcessContainer;
    commands: IProcessCommands;
    jobQueue: JobQueue;
    constructor(id: PodProcessId, process: IProcessContainer, commands: IProcessCommands);
    check(): boolean;
    status(): ProcessStage;
    init(): Promise<void>;
    start(parallel?: boolean): Promise<void>;
    stop(): Promise<void>;
    restart(): Promise<void>;
}
declare const createProcess: (id: PodProcessId, process: IProcessContainer, commands: IProcessCommands) => IProcess;
export { createProcess, IProcess, Process };
//# sourceMappingURL=process.d.ts.map