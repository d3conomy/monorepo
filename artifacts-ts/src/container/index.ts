import { Command, Commands } from "./commands.js";
import { Job, JobQueue } from "./jobs.js";
import { InstanceType, InstanceTypes } from "./instance.js";
import { InstanceOption } from "./options.js";

class Container<T extends InstanceTypes = InstanceTypes> {
  private _type: T;
  private instance: () => Promise<any>;
  private initializer?: (options?: any) => Promise<any>;
  public readonly options?: Array<InstanceOption<any>>;
  public commands: Commands;
  public jobs: JobQueue = new JobQueue();

  constructor({
    type,
    options,
    initializer,
    instance,
    commands,
    jobs
  }: {
    type: T,
    options?: Array<InstanceOption<any>>,
    initializer?: (options: any) => Promise<any>,
    instance?: any,
    commands: Array<Command> | Commands,
    jobs?: Array<Job>
  }) {
    this._type = type;
    this.options = options;
    this.initializer = initializer 
    this.instance = instance;

    if (commands instanceof Commands) {
      this.commands = commands;
      this.commands.setInstance(this.instance);
    } else {
      this.commands = new Commands({commands, instance: this.instance});
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

  public async init(): Promise<void> {
    if (this.initializer !== null && this.initializer !== undefined) {
      const instance = await this.initializer(this.options);

    if (instance !== null && instance !== undefined && (this.instance === null || this.instance === undefined)) {
      this.instance = instance;
      this.jobs.setInstance(this.instance);
      this.commands.setInstance(this.instance);
      }
    }
  }

  get type(): T {
    return this._type;
  }

  getInstance(): any {
    return this.instance;
  }

  setInstance(instance: any): void {
    this.instance = instance;
  }

}

export {
    Container
}