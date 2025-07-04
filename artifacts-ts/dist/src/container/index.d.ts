import { Command, Commands } from "./commands.js";
import { Job, JobQueue } from "./jobs.js";
import { InstanceType } from "./instance.js";
import { InstanceOptions } from "./options.js";
import { ContainerId } from "../id-reference-factory/IdReferenceClasses.js";
declare class Container<T = InstanceType> {
    readonly id: ContainerId;
    private readonly _type;
    private instance;
    private initializer?;
    readonly options?: InstanceOptions;
    commands: Commands;
    jobs: JobQueue;
    constructor({ id, type, options, initializer, instance, commands, jobs }: {
        id: ContainerId;
        type: T;
        options?: InstanceOptions;
        initializer?: (options: any, id?: any) => Promise<any>;
        instance?: any;
        commands: Array<Command> | Commands;
        jobs?: Array<Job>;
    });
    init(): Promise<void>;
    get type(): T;
    getInstance(): any;
    setInstance(instance: any): void;
}
export { Container };
export * from './commands.js';
export * from './jobs.js';
export * from './instance.js';
export * from './options.js';
export * from './status.js';
//# sourceMappingURL=index.d.ts.map