import { ProcessCommands } from "./processCommand.js";
import { createProcessContainer } from "./processContainer.js";
import { JobQueue } from "./processJobQueue.js";
import { ProcessStage } from "./processStages.js";
import { ProcessType } from "./processTypes.js";
class Process {
    id;
    container;
    commands;
    jobQueue;
    constructor(id, container, commands) {
        this.id = id;
        this.container = container ? container : createProcessContainer({
            type: ProcessType.CUSTOM,
            instance: undefined,
            options: undefined,
            init: undefined
        });
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
        try {
            if (typeof this.container.init === 'function') {
                if (this.container.loadInstance) {
                    this.container.loadInstance(await this.container.init(this.container.options));
                }
            }
        }
        catch (e) {
            console.error(`Error initializing container: ${e}`);
        }
        this.commands.loadContainer(this.container);
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
