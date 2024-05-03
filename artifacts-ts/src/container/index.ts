import { Command, Commands } from "./commands.js";
import { Job, JobQueue } from "./jobs.js";
import { InstanceType, InstanceTypes } from "./instance.js";
import { InstanceOption, InstanceOptions } from "./options.js";
import { ContainerId } from "../id-reference-factory/IdReferenceClasses.js";
import { IdReferenceType } from "../id-reference-factory/IdReferenceConstants.js";

class Container<T extends InstanceTypes> {
  public id: ContainerId;
  private _type: T;
  private instance: () => Promise<any>;
  private initializer?: (options?: any, id?: any) => Promise<any>;
  public readonly options?: InstanceOptions;
  public commands: Commands;
  public jobs: JobQueue = new JobQueue();

  constructor({
    id,
    type,
    options,
    initializer,
    instance,
    commands,
    jobs
  }: {
    id: ContainerId,
    type: T,
    options?: InstanceOptions,
    initializer?: (options: any, id?: any) => Promise<any>,
    instance?: any,
    commands: Array<Command> | Commands,
    jobs?: Array<Job>
  }) {
    this.id = id;
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
      const instance = await this.initializer(this.options, this.id);

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