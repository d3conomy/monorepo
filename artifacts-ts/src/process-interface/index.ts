import { PodProcessId } from "../id-reference-factory/index.js"
import { ProcessStage } from "./ProcessStages.js"

/**
 * Interface for process containers
 * @category Process
 */
interface IProcess {
    id: PodProcessId
    process?: any
    options?: any

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

export * from './ProcessResponses.js';
export * from './ProcessStages.js';
export * from './ProcessTypes.js';