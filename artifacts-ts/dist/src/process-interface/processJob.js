import { ProcessStage } from "./processStages.js";
const jobRunner = async (job, processCommand) => {
    let output = undefined;
    const startTime = new Date();
    try {
        job.status = ProcessStage.RUNNING;
        output = await processCommand.action(job.params);
        job.status = ProcessStage.FINISHED;
    }
    catch (error) {
        job.status = ProcessStage.ERROR;
        output = error.message;
    }
    const endTime = new Date();
    const runtime = endTime.getTime() - startTime.getTime();
    console.log(`Job ${job.jobId} finished in ${runtime}ms`);
    job.result = {
        output,
        runtime
    };
    return job;
};
const commandSelector = (job, processCommands) => {
    if (!processCommands.has(job.command)) {
        throw new Error(`Command ${job.command} not found`);
    }
    job.status = ProcessStage.INITIALIZING;
    const command = processCommands.get(job.command);
    if (!command) {
        throw new Error(`Incorrect number of arguments for command ${job.command}`);
    }
    job.status = ProcessStage.INITIALIZED;
    return command;
};
const runCommand = async (jobId, command, processCommands) => {
    const job = {
        jobId,
        command: command.command,
        params: command.params,
        status: ProcessStage.NEW
    };
    const processCommand = commandSelector(job, processCommands);
    return await jobRunner(job, processCommand);
};
export { jobRunner, commandSelector, runCommand };
