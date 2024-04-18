import { JobId } from '../id-reference-factory/IdReferenceClasses.js';
import { IProcessCommands } from './processCommand.js';
import { IProcessJob } from './processJob.js';
declare class JobQueue {
    private queue;
    running: JobId | undefined;
    completed: IProcessJob[];
    private stopFlag;
    private processCommands;
    enqueue(job: IProcessJob): void;
    dequeue(): IProcessJob | undefined;
    isEmpty(): boolean;
    size(): number;
    init(processCommands: IProcessCommands): void;
    /**
     * Execute a job (does not have to be in the queue)
     * @param job
     * @returns The job with the result
     */
    execute(job: IProcessJob): Promise<IProcessJob>;
    /**
     * Run the jobs in the queue
     * @returns  A promise that resolves when all jobs are finished
     */
    run(): Promise<void>;
    /**
     * Run the jobs in the queue in parallel
     * @returns A promise that resolves when all jobs are finished
     */
    runParallel(): Promise<void>;
    stop(): void;
}
export { JobQueue };
//# sourceMappingURL=processJobQueue.d.ts.map