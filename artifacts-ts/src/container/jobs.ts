import { JobId } from "../id-reference-factory/index.js";
import { Command, CommandArg, CommandResult } from "./commands.js";
import { JobStatus } from "./status.js";

interface Job {
    id: JobId;
    status?: JobStatus;
    command: Command;
    params: CommandArg<any>[];
    result?: CommandResult;
}

class JobQueue {
    public queue: Array<Job> = [];
    public running: JobId | undefined;
    public completed: Array<Job> = [];
    public stopFlag: boolean = true;
    private instance: any;

    constructor(instance?: any) {
        this.instance = instance;
    }

    hasInstance(): boolean {
        return this.instance !== undefined;
    }

    setInstance(instance: any): void {
        this.instance = instance;
    }

    enqueue(job: Job): void {
        this.queue.push(job);
    }

    dequeue(jobid?: JobId): Job | undefined {

        if (jobid) {
            const index = this.queue.findIndex((job) => job.id === jobid);
            if (index >= 0) {
                return this.queue.splice(index, 1)[0];
            }
            return undefined;
        }

        return this.queue.shift();
    }

    isEmpty(): boolean {
        return this.queue.length === 0;
    }

    size(): number {
        return this.queue.length;
    }

    public execute = async (job: Job): Promise<Job> => {
        let output: any;

        const startTime = new Date();
        try {
            job.status = JobStatus.Running;
            output = await job.command.run({args: job.params, instance: this.instance});
            // console.log(`Job ${job.id} finished, with output: ${output.output}`);
            job.status = JobStatus.Succeeded;
        } catch (error: any) {
            job.status = JobStatus.Failed;
            output = error;
        }
        const endTime = new Date();
        const runtime = endTime.getTime() - startTime.getTime();

        if (this.queue.includes(job)) {
            this.dequeue(job.id);
        }

        job.result = {
            output,
            metrics: {
                runtime,
                bytesUploaded: 0,
                bytesDownloaded: 0,
            },
        };

        this.completed.push(job);

        // console.log(`completed: ${this.completed.length}`)
        // console.log(`Job ${job.id} finished in ${runtime}ms, with output: ${output.output}`);

        return job;
    }

    run = async (parallel: boolean = false): Promise<Job[]> => {
        let jobsCompleted = new Array<Job>();
        if (parallel === true) {
            // console.log(`Running in parallel`)
            jobsCompleted = await this.runParallel();
        } else {
            // console.log(`Running in sequence`)
            jobsCompleted = await this.runSequential();
            
        }

        return jobsCompleted;
    }

    private runParallel = async (): Promise<Job[]> => {
        let jobsCompleted = new Array<Job>();
        const jobPromises = () => this.queue.map( async (job) => {
            // console.log(`Job ${job.id} started`);
            // this.dequeue(job.id);
            return this.execute(job);
        });

        for (const jobPromise of jobPromises()) {
            const job = await Promise.resolve(jobPromise);
            jobsCompleted.push(job);
        }
        // console.log(`Queue:  ${this.queue[0].command.name}`)

        // jobsCompleted = await Promise.all(jobPromises);

        return jobsCompleted;
    }

    private runSequential = async (): Promise<Job[]> => {
        let jobsCompleted = new Array<Job>();
        this.stopFlag = false;
        while (this.stopFlag === false) {
            const job = this.dequeue();
            if (job) {
                this.running = job.id;
                const resultJob = await this.execute(job);
                jobsCompleted.push(resultJob);
                this.running = undefined;
            }
            if (this.isEmpty() === true) {
                this.stopFlag = true;
            }
        }

        return jobsCompleted;
    }

    stop(): void {
        this.stopFlag = true;
        this.running = undefined;
    }
}

export {
    Job,
    JobQueue
};