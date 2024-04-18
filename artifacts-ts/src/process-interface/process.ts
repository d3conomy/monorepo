import { PodProcessId } from "../id-reference-factory"
import { IProcessCommands } from "./processCommand"
import { IProcessContainer } from "./processContainer"
import { JobQueue } from "./processJobQueue"
import { ProcessStage } from "./processStages"

interface IProcess {
    id: PodProcessId
    process?: IProcessContainer
    commands?: IProcessCommands
    jobQueue: JobQueue

    check(): boolean
    status(): ProcessStage
    init(): Promise<void>
    start(): Promise<void>
    stop(): Promise<void>
    restart(): Promise<void>
}

const createProcess = (
    id: PodProcessId,
    process: IProcessContainer,
    commands: IProcessCommands
): IProcess => {
    const jobQueue = new JobQueue();
    return {
        id,
        process,
        commands,
        jobQueue,

        check(): boolean {
            return this.process !== undefined;
        },

        status(): ProcessStage {
            return this.jobQueue.isEmpty() ? ProcessStage.PENDING : ProcessStage.RUNNING;
        },

        async init(): Promise<void> {
            this.jobQueue.init(commands);
        },

        async start(): Promise<void> {
            await this.jobQueue.run();
        },

        async stop(): Promise<void> {
            this.jobQueue.stop();
        },

        async restart(): Promise<void> {
            await this.stop();
            await this.start();
        }
    }
}


// export {
//     IProcess
// }