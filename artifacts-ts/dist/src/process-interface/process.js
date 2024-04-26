import { ProcessCommands } from "./processCommand.js";
import { JobQueue } from "./processJobQueue.js";
import { ProcessStage } from "./processStages.js";
class Process {
    id;
    container;
    commands;
    jobQueue;
    constructor(id, container, commands) {
        this.id = id;
        this.container = container;
        this.commands = new ProcessCommands({ commands, container: this.container });
        this.jobQueue = new JobQueue();
    }
    check() {
        return this.container !== undefined;
    }
    status() {
        return this.jobQueue.isEmpty() ? ProcessStage.PENDING : ProcessStage.RUNNING;
    }
    async init() {
        this.jobQueue.init(this.commands);
        // console.log(`this.container: ${JSON.stringify(this.container)}`)
        try {
            if (this.container?.init !== undefined) {
                const containerExec = await this.container?.init(this.container?.options);
                // console.log(`containerExec: ${containerExec}`)
                if (containerExec && this.container.instance === undefined) {
                    if (this.container?.loadInstance) {
                        this.container?.loadInstance(containerExec);
                    }
                }
            }
        }
        catch (e) {
            console.error(`Error initializing container: ${e}`);
        }
        if (this.container?.instance === undefined) {
            throw new Error(`Container instance is undefined`);
        }
        this.commands.loadContainer(this.container);
        // console.log(`this.container: ${JSON.stringify(this.container)}`)
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
const createProcess = (id, container, commands) => {
    if (commands instanceof Array) {
        return new Process(id, container, commands);
    }
    return new Process(id, container, [...commands.values()]);
};
export { createProcess, Process };
