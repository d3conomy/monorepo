import { JobStatus } from "./status.js";
class JobQueue {
    queue = [];
    running;
    completed = [];
    stopFlag = true;
    instance;
    constructor(instance) {
        this.instance = instance;
    }
    hasInstance() {
        return this.instance !== undefined;
    }
    setInstance(instance) {
        this.instance = instance;
    }
    enqueue(job) {
        this.queue.push(job);
    }
    dequeue(jobid) {
        if (jobid) {
            const index = this.queue.findIndex((job) => job.id === jobid);
            if (index >= 0) {
                return this.queue.splice(index, 1)[0];
            }
            return undefined;
        }
        return this.queue.shift();
    }
    isEmpty() {
        return this.queue.length === 0;
    }
    size() {
        return this.queue.length;
    }
    execute = async (job) => {
        let output;
        const startTime = new Date();
        try {
            job.status = JobStatus.Running;
            output = await job.command.run({ args: job.params, instance: this.instance });
            job.status = JobStatus.Succeeded;
        }
        catch (error) {
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
        return job;
    };
    run = async (parallel = false) => {
        let jobsCompleted = new Array();
        if (parallel === true) {
            jobsCompleted = await this.runParallel();
        }
        else {
            jobsCompleted = await this.runSequential();
        }
        return jobsCompleted;
    };
    runParallel = async () => {
        let jobsCompleted = new Array();
        const jobPromises = () => this.queue.map(async (job) => {
            return this.execute(job);
        });
        for (const jobPromise of jobPromises()) {
            const job = await Promise.resolve(jobPromise);
            jobsCompleted.push(job);
        }
        return jobsCompleted;
    };
    runSequential = async () => {
        let jobsCompleted = new Array();
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
    };
    stop() {
        this.stopFlag = true;
        this.running = undefined;
    }
}
export { JobQueue };
