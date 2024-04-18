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
        this.commands = commands;
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
            await this.process.init(this.process.options);
        }
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
    return new Process(id, process, commands);
};
export { createProcess, Process };
