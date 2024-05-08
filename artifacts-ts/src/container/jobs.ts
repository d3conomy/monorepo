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

    private verifyJobParams = (job: Job): boolean => {  
        if (!job.command.args) {
            return true;
        }
        for (const arg of job.command.args) {
            if (arg.required && !job.params?.find((jobParam) => jobParam.name === arg.name)) {
                return false;
            }
        }
        return true;
    }

    public execute = async (job: Job): Promise<Job> => {
        let jobResult: CommandResult = {output: null, metrics: {runtime: 0, bytesReceived: 0, bytesSent: 0}};
        let bytesReceived: number = 0;
        let bytesSent: number = 0;

        if (job.params) {
            for(const param of job.params) {
                if (param.value instanceof String) {
                    bytesReceived += param.value.toString().length;
                }
                else {
                    bytesReceived += JSON.stringify(param.value).length;
                }
            }
        }

        const startTime = new Date();
    
        try {
            job.status = JobStatus.Running;

            if (this.verifyJobParams(job) === false) {
                throw new Error(`Job ${job.id} failed: Missing required parameters`);
            }

            jobResult.output = await job.command.run({args: job.params, instance: this.instance});
            // jobResult.output = output;

            job.status = JobStatus.Succeeded;
        } catch (error: any) {
            job.status = JobStatus.Failed;
            jobResult.output= error;
        }
        const endTime = new Date();
        const runtime = endTime.getTime() - startTime.getTime();

        if (jobResult.output !== undefined) {
            bytesSent = JSON.stringify(jobResult.output).length;
        }

        jobResult.metrics = {
            runtime,
            bytesReceived,
            bytesSent,
        },
        
        job.result = jobResult;

        this.completed.push(job);
        // console.log(`Job ${job.id} completed with status ${job.status} - ${JSON.stringify(job.result)}`);

        if (this.queue.includes(job)) {
            this.dequeue(job.id);
        }

        return job;
    }

    run = async (parallel: boolean = false): Promise<Job[]> => {
        let jobsCompleted = new Array<Job>();
        if (parallel === true) {
            jobsCompleted = await this.runParallel();
        } else {
            jobsCompleted = await this.runSequential();
            
        }

        return jobsCompleted;
    }

    private runParallel = async (): Promise<Job[]> => {
        let jobsCompleted = new Array<Job>();
        const jobPromises = () => this.queue.map( async (job) => {
            return this.execute(job);
        });

        for (const jobPromise of jobPromises()) {
            const job = await Promise.resolve(jobPromise);
            jobsCompleted.push(job);
        }

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