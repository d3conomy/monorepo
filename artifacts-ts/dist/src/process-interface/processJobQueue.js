import { runCommand } from './processJob.js';
class JobQueue {
    queue = [];
    running;
    completed = [];
    stopFlag = true;
    processCommands = {};
    enqueue(job) {
        this.queue.push(job);
    }
    dequeue() {
        return this.queue.shift();
    }
    isEmpty() {
        return this.queue.length === 0;
    }
    size() {
        return this.queue.length;
    }
    init(processCommands) {
        this.stopFlag = false;
        this.processCommands = processCommands;
    }
    async run() {
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
    async runParallel() {
        const jobPromises = this.queue.map((job) => {
            return runCommand(job.jobId, job, this.processCommands);
        });
        this.completed = await Promise.all(jobPromises);
    }
    stop() {
        this.stopFlag = true;
        this.running = undefined;
    }
}
export { JobQueue };
