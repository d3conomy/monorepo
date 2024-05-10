import { JobId } from "../id-reference-factory/index.js";
import { Command, CommandArg, CommandResult } from "./commands.js";
import { JobStatus } from "./status.js";
interface Job {
    id: JobId;
    status?: JobStatus;
    command: Command;
    params?: CommandArg<any>[];
    result?: CommandResult;
}
declare class JobQueue {
    queue: Array<Job>;
    running: JobId | undefined;
    completed: Array<Job>;
    stopFlag: boolean;
    private instance;
    constructor(instance?: any);
    hasInstance(): boolean;
    setInstance(instance: any, overwrite?: boolean): void;
    verifyJob(job: Job): boolean;
    enqueue(job: Job): void;
    dequeue(jobid?: JobId): Job | undefined;
    isEmpty(): boolean;
    size(): number;
    private verifyJobParams;
    execute: (job: Job) => Promise<Job>;
    run: (parallel?: boolean) => Promise<Job[]>;
    private runParallel;
    private runSequential;
    stop(): void;
}
export { Job, JobQueue };
//# sourceMappingURL=jobs.d.ts.map