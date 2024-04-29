import { Libp2p } from "libp2p"
import { PodProcessId } from "../id-reference-factory/index.js"
import { libp2pCommands } from "../process-libp2p/commands.js"
import { IProcessCommand, IProcessCommands, ProcessCommands } from "./processCommand.js"
import { IProcessContainer, createProcessContainer } from "./processContainer.js"
import { JobQueue } from "./processJobQueue.js"
import { IProcessOptionsList } from "./processOptions.js"
import { ProcessStage } from "./processStages.js"
import { ProcessType, isProcessType } from "./processTypes.js"

interface IProcess<T = ProcessType>{
    id: PodProcessId
    container: IProcessContainer<T>
    commands: IProcessCommands
    jobQueue: JobQueue

    check(): boolean
    status(): ProcessStage
    init(): Promise<void>
    start(parallel?: boolean): Promise<void>
    stop(): Promise<void>
    restart(): Promise<void>
}

class Process<T> implements IProcess<T> {
    id: PodProcessId;
    container: IProcessContainer<T>;
    commands: ProcessCommands;
    jobQueue: JobQueue;

    constructor(
        id: PodProcessId,
        container: IProcessContainer<T>,
        commands: Array<IProcessCommand>
    ) {
        this.id = id;
        this.container = container ? container : createProcessContainer<T>({
            // type: ProcessType.CUSTOM,
            instance: undefined,
            options: undefined,
            init: undefined
        });
        this.commands = new ProcessCommands({commands, container: this.container});
        this.jobQueue = new JobQueue();

    }

    check(): boolean {
        return this.container !== undefined ;
    }

    status(): ProcessStage {
        return this.jobQueue.isEmpty() ? ProcessStage.PENDING : ProcessStage.RUNNING;
    }

    async init(): Promise<void> {
        this.jobQueue.init(this.commands);

        try {
            if (typeof this.container.init === 'function') {
                // if (this.container.loadInstance) {
                    this.container.loadInstance(await this.container.init(this.container.options));
                // }
            }
        } catch (e) {
            console.error(`Error initializing container: ${e}`)
        }
    
        this.commands.loadContainer(this.container)
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