import { ProcessCommands } from "./processCommand.js";
import { JobQueue } from "./processJobQueue.js";
import { ProcessStage } from "./processStages.js";
class Process {
    id;
    process;
    commands;
    jobQueue;
    constructor(id, process, commands) {
        this.id = id;
        this.process = process;
        this.commands = new ProcessCommands({ commands, proc: this.process.process });
        this.jobQueue = new JobQueue();
    }
    check() {
        return this.process !== undefined;
    }
    status() {
        return this.jobQueue.isEmpty() ? ProcessStage.PENDING : ProcessStage.RUNNING;
    }
    async init() {
        this.jobQueue.init(this.commands);
        if (this.process?.init) {
            let processExec = await this.process.init();
            if (!this.process?.process) {
                this.process.process = processExec;
            }
        }
        this.commands.loadProcess(this.process?.process);
    }
    async start(parallel) {
        if (parallel) {
            await this.jobQueue.runParallel();
        }
        else {
            await this.jobQueue.run();
        }
    }
    async stop() {
        this.jobQueue.stop();
    }
    async restart() {
        await this.stop();
        await this.start(false);
    }
}
const createProcess = (id, process, commands) => {
    if (commands instanceof Array) {
        return new Process(id, process, commands);
    }
    return new Process(id, process, [...commands.values()]);
};
export { createProcess, Process };
