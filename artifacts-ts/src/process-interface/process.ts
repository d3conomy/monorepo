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

    checkProcess(): boolean
    status(): ProcessStage
    init(): Promise<void>
    start(): Promise<void>
    stop(): Promise<void>
    restart(): Promise<void>
}


// export {
//     IProcess
// }