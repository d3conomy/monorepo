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
    run(): Promise<void>;
    runParallel(): Promise<void>;
    stop(): void;
}
export { JobQueue };
//# sourceMappingURL=processJobQueue.d.ts.map