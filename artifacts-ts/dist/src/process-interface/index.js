// import { PodProcessId } from "../id-reference-factory/index.js"
// import { IProcessCommands } from "./processCommand.js"
// import { IProcessContainer } from "./processContainer.js"
// import { IProcessOptionsList } from "./processOptions.js"
// import { ProcessStage } from "./processStages.js"
// /**
//  * Interface for process containers
//  * @category Process
//  */
// interface IProcess {
//     id: PodProcessId
//     process?: IProcessContainer | any
//     options?: IProcessOptionsList | any
//     commands?: IProcessCommands
//     checkProcess(): boolean
//     status(): ProcessStage
//     init(): Promise<void>
//     start(): Promise<void>
//     stop(): Promise<void>
//     restart(): Promise<void>
// }
// export {
//     IProcess
// }
export * from './process.js';
export * from './processCommand.js';
export * from './processContainer.js';
export * from './processImport.js';
export * from './processJob.js';
export * from './processJobQueue.js';
export * from './processOptions.js';
export * from './processResponses.js';
export * from './processStages.js';
export * from './processTypes.js';
