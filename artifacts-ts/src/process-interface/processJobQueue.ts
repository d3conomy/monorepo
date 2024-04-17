import { IProcessJob } from './processJob.js';

class JobQueue {
    private queue: IProcessJob[] = [];

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
}

export {
    JobQueue
}