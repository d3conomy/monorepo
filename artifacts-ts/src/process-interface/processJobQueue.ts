import { JobId, PodProcessId } from '../id-reference-factory/IdReferenceClasses.js';
import { IProcessCommands } from './processCommand.js';
import { IProcessContainer } from './processContainer.js';
import { IProcessJob, runCommand } from './processJob.js';


class JobQueue {
    private queue: IProcessJob[] = [];
    public running: JobId | undefined;
    public completed: IProcessJob[] = [];
    private stopFlag: boolean = true;
    private processCommands: IProcessCommands = {} as IProcessCommands;

    enqueue(job: IProcessJob): void {
        this.queue.push(job);
    }

    dequeue(): IProcessJob | undefined {
        return this.queue.shift();
    }

    isEmpty(): boolean {
        return this.queue.length === 0;
    }

    size(): number {
        return this.queue.length;
    }

    init(processCommands: IProcessCommands): void {
        this.stopFlag = false;
        this.processCommands = processCommands;
    }

    async run(): Promise<void> {
        while (!this.stopFlag && !this.isEmpty()) {
            const job = this.dequeue();
            if (job) {
                this.running = job.jobId;
                const result = await runCommand(job.jobId, job, this.processCommands);
                // console.log(`Job ${job.jobId} finished in ${result.result?.runtime}ms`)
                this.completed.push(result);
                this.running = undefined;
            }
        }
    }

    async runParallel(): Promise<void> {
        const jobPromises = this.queue.map((job) => {
            return runCommand(job.jobId, job, this.processCommands);
        });

        this.completed = await Promise.all(jobPromises);
    }

    stop(): void {
        this.stopFlag = true;
        this.running = undefined;
    }

}

export {
    JobQueue
}