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
    container?: IProcessContainer
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
    container?: IProcessContainer;
    commands: ProcessCommands;
    jobQueue: JobQueue;

    constructor(
        id: PodProcessId,
        container: IProcessContainer,
        commands: Array<IProcessCommand>
    ) {
        this.id = id;
        this.container = container;
        this.commands = new ProcessCommands({commands, container: this.container});
        this.jobQueue = new JobQueue();

    }

    check(): boolean {
        return this.container !== undefined;
    }

    status(): ProcessStage {
        return this.jobQueue.isEmpty() ? ProcessStage.PENDING : ProcessStage.RUNNING;
    }

    async init(): Promise<void> {
        this.jobQueue.init(this.commands);

        // console.log(`this.container: ${JSON.stringify(this.container)}`)

        try{
            if (this.container?.init !== undefined) {

                const containerExec: any = await this.container?.init(this.container?.options);

                // console.log(`containerExec: ${containerExec}`)

                if (containerExec && this.container.instance === undefined) {
                    if (this.container?.loadInstance) {
                        this.container?.loadInstance(containerExec);
                    }   
                }
            }
        } catch (e) {
            console.error(`Error initializing container: ${e}`)
        }

        if (this.container?.instance === undefined) {
            throw new Error(`Container instance is undefined`)
        }
        this.commands.loadContainer(this.container)

        // console.log(`this.container: ${JSON.stringify(this.container)}`)
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
    container: IProcessContainer,
    commands: Array<IProcessCommand> | ProcessCommands
): IProcess => {
    if (commands instanceof Array) {
        return new Process(id, container, commands);
    }
    return new Process(id, container, [...commands.values()])
}


export {
    createProcess,
    IProcess,
    Process
}