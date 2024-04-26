import { Libp2p } from "libp2p"
import { PodProcessId } from "../id-reference-factory/index.js"
import { libp2pCommands } from "../process-libp2p/commands.js"
import { IProcessCommand, IProcessCommands, ProcessCommands } from "./processCommand.js"
import { IProcessContainer } from "./processContainer.js"
import { JobQueue } from "./processJobQueue.js"
import { IProcessOptionsList } from "./processOptions.js"
import { ProcessStage } from "./processStages.js"

interface IProcess {
    id: PodProcessId
    process?: IProcessContainer
    commands: IProcessCommands
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
    commands: ProcessCommands;
    jobQueue: JobQueue;

    constructor(
        id: PodProcessId,
        process: IProcessContainer,
        commands: Array<IProcessCommand>
    ) {
        this.id = id;
        this.process = process;
        this.commands = new ProcessCommands({commands, proc: this.process.process});
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

        console.log(`this.process: ${JSON.stringify(this.process)}`)

        try{
            if (this.process?.init !== undefined) {

                const processExec: Libp2p = await this.process?.init(this.process?.options);

                // console.log(`processExec: ${processExec}`)

                if (processExec && this.process.process === undefined) {
                    if (this.process?.loadProcess) {
                        this.process?.loadProcess(processExec);
                    }   
                }
            }
        } catch (e) {
            console.error(`Error initializing process: ${e}`)
        }

        this.commands.loadProcess(this.process?.process)

        // console.log(`this.process: ${JSON.stringify(this.process)}`)
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
    commands: Array<IProcessCommand> | ProcessCommands
): IProcess => {
    if (commands instanceof Array) {
        return new Process(id, process, commands);
    }
    return new Process(id, process, [...commands.values()])
}


export {
    createProcess,
    IProcess,
    Process
}