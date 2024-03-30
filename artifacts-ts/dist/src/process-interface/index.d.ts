import { IdReference } from "../id-reference-factory/index.js";
import { ProcessStage } from "./ProcessStages.js";
declare enum ProcessType {
    LIBP2P = "libp2p",
    IPFS = "ipfs",
    ORBITDB = "orbitdb",
    OPEN_DB = "open-db"
}
declare const isProcessType: (value: any) => ProcessType;
/**
 * Interface for process containers
 * @category Process
 */
interface IProcess {
    id: IdReference;
    process?: any;
    options?: any;
    checkProcess(): boolean;
    status(): ProcessStage;
    init(): Promise<void>;
    start(): Promise<void>;
    stop(): Promise<void>;
    restart(): Promise<void>;
}
export { ProcessType, isProcessType, IProcess };
export * from './ProcessResponses.js';
export * from './ProcessStages.js';
//# sourceMappingURL=index.d.ts.map