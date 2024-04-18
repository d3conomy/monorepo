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
    /**
     * Execute a job (does not have to be in the queue)
     * @param job
     * @returns The job with the result
     */
    async execute(job) {
        const result = await runCommand(job.jobId, job, this.processCommands);
        this.completed.push(result);
        return result;
    }
    /**
     * Run the jobs in the queue
     * @returns  A promise that resolves when all jobs are finished
     */
    async run() {
        while (!this.stopFlag && !this.isEmpty()) {
            const job = this.dequeue();
            if (job) {
                this.running = job.jobId;
                const result = await this.execute(job);
                // console.log(`Job ${job.jobId} finished in ${result.result?.runtime}ms`)
                // this.completed.push(result);
                this.running = undefined;
            }
        }
    }
    /**
     * Run the jobs in the queue in parallel
     * @returns A promise that resolves when all jobs are finished
     */
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
