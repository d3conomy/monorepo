
import { RunCommandArg, RunCommandError, RunCommandRecord, RunCommandResult } from "./commands.js";
import { ContainerInstance } from "./container.js";
import { IdentityRecord } from "./identity.js";
import { BaseRecord, OptionRecord, Options, RecordManager } from "./index.js";

type JobStatus = 'new'| 'pending' | 'running' | 'completed' | 'failed';

type JobChain = Record<'previous', IdentityRecord | undefined> & Record<'next', IdentityRecord | undefined>;

class JobRecord 
    extends BaseRecord
    implements 
        Record<'id', IdentityRecord>,
        Record<'command', RunCommandRecord>,
        Record<'status', JobStatus>,
        Record<'chain', JobChain | undefined>
{
    public readonly id: IdentityRecord;
    public readonly command: RunCommandRecord;
    public status: JobStatus = 'new';
    public chain: JobChain | {previous: undefined, next: undefined} = {previous: undefined, next: undefined};

    constructor({
        id,
        command,
        next,
        previous,
    }: {
        id: IdentityRecord,
        command: RunCommandRecord,
        next?: IdentityRecord,
        previous?: IdentityRecord
    }) {
        super({name: 'JobRecord', description: `Job Record for ${command.name}`});
        this.id = id;
        this.command = command;
        if (next) {
            this.chain.next = next
        }
        if (previous) {
            this.chain.previous = previous;
        }
    }

    public toString(): string {
        return `${this.name}`;
    }

    public toJSON(): any {
        return {
            id: this.id,
            command: this.command,
            status: this.status
        }
    }
}


class JobQueue 
    extends RecordManager<JobRecord>
    implements
        Record<'queue', Array<JobRecord>>,
        Record<'completed', Array<JobRecord>>,
        Record<'instance', ContainerInstance>,
        Record<'stopFlag', boolean>
{
    public readonly instance: ContainerInstance;
    public queue: Array<JobRecord> = new Array<JobRecord>();
    public completed: Array<JobRecord> = new Array<JobRecord>();
    public stopFlag: boolean = false;

    constructor({
        instance,
        jobs
    }: {
        instance: ContainerInstance,
        jobs?: Array<JobRecord>
    }) {
        super();
        this.instance = instance;
        if (jobs) {
            for (const record of jobs) {
                this.enqueue(record);
            }
        }
    }

    public getJobById(id: IdentityRecord): JobRecord | undefined {
        for (const record of [ ...this.getRecords()]) {
            if (record.id === id) {
                return record;
            }
        }
        
    }

    private checkForPreviousJob(record: JobRecord): boolean {
        if (record.chain.previous) {
            const previous = this.getJobById(record.chain.previous);
            if (previous) {
                return true;
            }
        }
        if (record.chain.previous === undefined) {
            return true;
        }
        return false;
    }

    public enqueue(record: JobRecord) {
        if (!this.checkForPreviousJob(record)) {
            throw new Error('Previous job does not exist');
        }

        if (this.checkForRecord(record)) {
            throw new Error('Record already exists');
        }
        this.addRecord(record);
        this.queue.push(record);
    }

    public dequeue(): JobRecord | undefined {
        const record = this.queue.shift();
        return record;
    }

    public complete(record: JobRecord) {
        // this.queue.splice(this.queue.indexOf(record), 1);
        this.completed.push(record);
    }

    public execute = async (job: JobRecord): Promise<JobRecord> => {
        let bytesReceived: number = 0;
        let bytesSent: number = 0;

        if (job.status === 'new') {
            job.status = 'pending';
        }

        let args: RecordManager<RunCommandArg<any>> = new RecordManager<RunCommandArg<any>>();
        for (const requiredArg of job?.command?.run?.args ?? []) {
            let arg = job.command?.args?.getRecord(requiredArg.name);
            if (requiredArg.required === true && arg === undefined) {
                throw new Error(`Missing required argument: ${requiredArg.name}`);
            }
            console.log(`Arg: ${arg}`)
            if (arg !== undefined) {
                bytesReceived += arg?.value.length;
                args.addRecord(arg);
            }
        }   

        let commandResult: RunCommandResult = new RunCommandResult({
            status: 'failure',
            output: null,
            metrics: {
                runTime: 0,
                bytesReceived: bytesReceived,
                bytesSent: bytesSent
            }
        })

        const startTime = new Date();

        try {
            job.status = 'running';
            commandResult.output = await job.command.run.process({args, instance: this.instance});
            commandResult.status = 'success';
            job.status = 'completed';
        }
        catch (error: any) {
            commandResult.status = 'failure';
            commandResult.error = new RunCommandError({
                name: error.name,
                message: error.message
            });
            job.status = 'failed';
            
        }

        const endTime = new Date()
        commandResult.metrics.runTime = endTime.getTime() - startTime.getTime();

        if (commandResult.output !== undefined) {
            commandResult.metrics.bytesSent = JSON.stringify(commandResult.output).length;
        }

        job.command.result = commandResult;
        this.complete(job);

        if (this.queue.some((possiblejob) => possiblejob.id === job.id )) {
            this.queue.splice(this.queue.indexOf(job), 1);
        }

        return job;
    }

    public run = async (parallel: boolean = false): Promise<JobRecord[]> => {
        let jobsCompleted: JobRecord[] = [];
        if (parallel === true) {
            jobsCompleted = await this.runParallel();
        } else {
            jobsCompleted = await this.runSequential();
        }

        return jobsCompleted;
    }


    private runParallel = async (): Promise<Array<JobRecord>> => {

        const jobPromises = () => this.queue.map( async (job) => {
            return this.execute(job);
        });

        let jobsCompleted = new Array<JobRecord>();

        for (const promise of jobPromises()) {
            const result = await Promise.resolve(promise);
            jobsCompleted.push(result);
        }

        return jobsCompleted;
    }

    private runSequential = async (): Promise<Array<JobRecord>> => {
        let results = new Array<JobRecord>();
        this.stopFlag = false;

        while (this.stopFlag === false) {
            const job = this.dequeue();
            if (job) {
                const result = await this.execute(job);
                results.push(result);
            }
            if (this.queue.length === 0) {
                this.stopFlag = true;
            }
        }
        return results;
    }

    public get completedCount(): number {
        return this.completed.length;
    }

    public get queueCount(): number {
        return this.queue.length;
    }

    public get completedRecords(): Array<JobRecord> {
        return this.completed;
    }

    public get queueRecords(): Array<JobRecord> {
        return this.queue;
    }

    public get failedJobs(): Array<JobRecord> {
        return this.completed.filter((job) => job.status === 'failed');
    }
}

export {
    JobChain,
    JobStatus,
    JobRecord,
    JobQueue
}