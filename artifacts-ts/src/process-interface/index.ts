import { IdReference } from "../id-reference-factory/index.js"
import { ProcessStage } from "./ProcessStages.js"

enum ProcessType {
    LIBP2P = 'libp2p',
    IPFS = 'ipfs',
    ORBITDB = 'orbitdb',
    OPEN_DB = 'open-db',
}

const isProcessType = (value: any): ProcessType => {
    if (Object.values(ProcessType).includes(value)) {
        return value as ProcessType;
    }
    throw new Error('Invalid process type');
}



/**
 * Interface for process containers
 * @category Process
 */
interface IProcess {
    id: IdReference
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
    ProcessType,
    isProcessType,
    IProcess
}

export * from './ProcessResponses.js';
export * from './ProcessStages.js';