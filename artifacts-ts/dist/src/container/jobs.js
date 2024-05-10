import { JobStatus } from "./status.js";
class JobQueue {
    queue = [];
    running;
    completed = [];
    stopFlag = true;
    instance;
    constructor(instance) {
        this.setInstance(instance);
    }
    hasInstance() {
        return this.instance !== undefined;
    }
    setInstance(instance, overwrite = false) {
        if (this.instance !== undefined && overwrite === false) {
            throw new Error('Instance already set');
        }
        this.instance = instance;
    }
    verifyJob(job) {
        if (job.command === undefined) {
            return false;
        }
        if (this.verifyJobParams(job) === false) {
            return false;
        }
        for (const queuedJob of this.queue) {
            if (queuedJob.id === job.id) {
                return false;
            }
        }
        for (const completedJob of this.completed) {
            if (completedJob.id === job.id) {
                return false;
            }
        }
        return true;
    }
    enqueue(job) {
        // if (!this.verifyJob(job)) {
        //     throw new Error('Invalid job');
        // }
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
    verifyJobParams = (job) => {
        if (!job.command.args) {
            return true;
        }
        for (const arg of job.command.args) {
            if (arg.required && !job.params?.find((jobParam) => jobParam.name === arg.name)) {
                return false;
            }
        }
        return true;
    };
    execute = async (job) => {
        let jobResult = { output: null, metrics: { runtime: 0, bytesReceived: 0, bytesSent: 0 } };
        let bytesReceived = 0;
        let bytesSent = 0;
        if (job.params) {
            for (const param of job.params) {
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
            jobResult.output = await job.command.run({ args: job.params, instance: this.instance });
            // jobResult.output = output;
            job.status = JobStatus.Succeeded;
        }
        catch (error) {
            job.status = JobStatus.Failed;
            jobResult.output = error;
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
