import { PodProcessId } from "../id-reference-factory/index.js"
import { IProcessCommands } from "./processCommand.js"
import { IProcessContainer } from "./processContainer.js"
import { JobQueue } from "./processJobQueue.js"
import { IProcessOptions } from "./processOptions.js"
import { ProcessStage } from "./processStages.js"

interface IProcess {
    id: PodProcessId
    process?: IProcessContainer
    commands?: IProcessCommands
    jobQueue: JobQueue

    check(): boolean
    status(): ProcessStage
    init(): Promise<void>
    start(parallel?: boolean): Promise<void>
    stop(): Promise<void>
    restart(): Promise<void>
}

class Process implements IProcess {
    id: PodProcessId;
    process?: IProcessContainer;
    commands: IProcessCommands;
    jobQueue: JobQueue;

    constructor(
        id: PodProcessId,
        process: IProcessContainer,
        commands: IProcessCommands
    ) {
        this.id = id;
        this.process = process;
        this.commands = commands;
        this.jobQueue = new JobQueue();
    }

    check(): boolean {
        return this.process !== undefined;
    }

    status(): ProcessStage {
        return this.jobQueue.isEmpty() ? ProcessStage.PENDING : ProcessStage.RUNNING;
    }

    async init(): Promise<void> {
        this.jobQueue.init(this.commands);
        if (this.process?.init) {
            await this.process.init(this.process.options);
        }
    }

    async start(parallel?: boolean): Promise<void> {
        if (parallel) {
            await this.jobQueue.runParallel();
        }
        else {
            await this.jobQueue.run();
        }
    }

    async stop(): Promise<void> {
        this.jobQueue.stop();
    }

    async restart(): Promise<void> {
        await this.stop();
        await this.start(false);
    }
}

const createProcess = (
    id: PodProcessId,
    process: IProcessContainer,
    commands: IProcessCommands
): IProcess => {
    return new Process(id, process, commands);
}


export {
    createProcess,
    IProcess,
    Process
}