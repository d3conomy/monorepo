import { JobId } from "../id-reference-factory/index.js";
import { IProcessCommand, IProcessCommands, IProcessExecuteCommand } from "./processCommand.js";
import { ProcessStage } from "./processStages.js";
interface IProcessJob extends IProcessExecuteCommand {
    jobId: JobId;
    status: ProcessStage;
}
declare const jobRunner: (job: IProcessJob, processCommand: IProcessCommand) => Promise<IProcessJob>;
declare const commandSelector: (job: IProcessJob, processCommands: IProcessCommands) => IProcessCommand;
declare const runCommand: (jobId: JobId, command: IProcessExecuteCommand, processCommands: IProcessCommands) => Promise<IProcessJob>;
export { IProcessJob, jobRunner, commandSelector, runCommand };
//# sourceMappingURL=processJob.d.ts.map