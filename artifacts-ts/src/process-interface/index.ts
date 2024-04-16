import { PodProcessId } from "../id-reference-factory/index.js"
import { IProcessCommands } from "./processCommand.js"
import { ProcessStage } from "./processStages.js"

/**
 * Interface for process containers
 * @category Process
 */
interface IProcess {
    id: PodProcessId
    process?: any
    options?: any
    commands?: IProcessCommands

    checkProcess(): boolean
    status(): ProcessStage
    init(): Promise<void>
    start(): Promise<void>
    stop(): Promise<void>
    restart(): Promise<void>
}

export {
    IProcess
}

export * from './processResponses.js';
export * from './processStages.js';
export * from './processTypes.js';