import { Command, Commands } from "./commands.js";
import { Job, JobQueue } from "./jobs.js";
import { InstanceTypes } from "./instance.js";
import { InstanceOption } from "./options.js";
import { ContainerId } from "../id-reference-factory/IdReferenceClasses.js";
declare class Container<T extends InstanceTypes> {
    id: ContainerId;
    private _type;
    private instance;
    private initializer?;
    readonly options?: Array<InstanceOption<any>>;
    commands: Commands;
    jobs: JobQueue;
    constructor({ id, type, options, initializer, instance, commands, jobs }: {
        id: ContainerId;
        type: T;
        options?: Array<InstanceOption<any>>;
        initializer?: (options: any) => Promise<any>;
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
//# sourceMappingURL=index.d.ts.map