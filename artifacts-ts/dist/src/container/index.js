import { Commands } from "./commands.js";
import { JobQueue } from "./jobs.js";
class Container {
    _type;
    instance;
    initializer;
    options;
    commands;
    jobs = new JobQueue();
    constructor({ type, options, initializer, instance, commands, jobs }) {
        this._type = type;
        this.options = options;
        this.initializer = initializer;
        this.instance = instance;
        if (commands instanceof Commands) {
            this.commands = commands;
            this.commands.setInstance(this.instance);
        }
        else {
            this.commands = new Commands({ commands, instance: this.instance });
        }
        if (jobs) {
            for (const job of jobs) {
                this.jobs.enqueue(job);
            }
        }
        if (this.instance !== null && this.instance !== undefined) {
            this.jobs.setInstance(this.instance);
            this.commands.setInstance(this.instance);
        }
    }
    async init() {
        if (this.initializer !== null && this.initializer !== undefined) {
            const instance = await this.initializer(this.options);
            if (instance !== null && instance !== undefined && (this.instance === null || this.instance === undefined)) {
                this.instance = instance;
                this.jobs.setInstance(this.instance);
                this.commands.setInstance(this.instance);
            }
        }
    }
    get type() {
        return this._type;
    }
    getInstance() {
        return this.instance;
    }
    setInstance(instance) {
        this.instance = instance;
    }
}
export { Container };
