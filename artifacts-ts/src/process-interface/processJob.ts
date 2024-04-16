import { JobId, PodProcessId } from "../id-reference-factory";
import { IProcessCommand, IProcessCommandOutput, IProcessExecuteCommand } from "./processCommand";
import { ProcessStage } from "./processStages";
import { ProcessType } from "./processTypes";




interface IProcessJob extends IProcessExecuteCommand {
    jobId: JobId;
    status: ProcessStage;
}