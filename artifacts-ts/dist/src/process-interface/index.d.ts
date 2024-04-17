import { PodProcessId } from "../id-reference-factory/index.js";
import { IProcessCommands } from "./processCommand.js";
import { IProcessContainer } from "./processContainer.js";
import { IProcessOptions } from "./processOptions.js";
import { ProcessStage } from "./processStages.js";
/**
 * Interface for process containers
 * @category Process
 */
interface IProcess {
    id: PodProcessId;
    process?: IProcessContainer | any;
    options?: IProcessOptions | any;
    commands?: IProcessCommands;
    checkProcess(): boolean;
    status(): ProcessStage;
    init(): Promise<void>;
    start(): Promise<void>;
    stop(): Promise<void>;
    restart(): Promise<void>;
}
export { IProcess };
export * from './processCommand.js';
export * from './processContainer.js';
export * from './processImport.js';
export * from './processJob.js';
export * from './processOptions.js';
export * from './processResponses.js';
export * from './processStages.js';
export * from './processTypes.js';
//# sourceMappingURL=index.d.ts.map