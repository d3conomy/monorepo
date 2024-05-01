import { expect } from "chai";
import { Job, JobQueue } from "../src/container/jobs.js";
import { JobId, SystemId } from "../src/id-reference-factory/index.js";
import { Command, CommandResult } from "../src/container/commands.js";

describe("JobQueue", () => {
    let jobQueue: JobQueue;
    let jobId: any;

    beforeEach(() => {
        jobQueue = new JobQueue();
        jobId = (): JobId => new JobId({
            componentId: new SystemId({ name: "system1" }),
        });
    });

    it("should enqueue a job", () => {
        const job: Job = {
            id: jobId(),
            command: { 
                name: 'test',
                description: 'test1',
                run: async () => {
                    const output: CommandResult = {
                        output: "output",
                        metrics: {
                            runtime: 0,
                            bytesUploaded: 0,
                            bytesDownloaded: 0,
                        },
                    };
                    return Promise.resolve(output);
                },
                args: [],
            },
            params: [],
        };

        jobQueue.enqueue(job);

        expect(jobQueue.size()).to.equal(1);
    });

    it("should dequeue a job", () => {
        const job: Job = {
            id: jobId(),
            command: { 
                name: 'test',
                description: 'test1',
                run: async () => {
                    const output: CommandResult = {
                        output: "hello",
                        metrics: {
                            runtime: 0,
                            bytesUploaded: 0,
                            bytesDownloaded: 0,
                        },
                    };
                    return Promise.resolve(output);
                },
                args: [],
            },
            params: [],
        };

        jobQueue.enqueue(job);

        const dequeuedJob = jobQueue.dequeue();

        expect(dequeuedJob).to.equal(job);
    });

    it("should return true if queue is empty", () => {
        expect(jobQueue.isEmpty()).to.equal(true);
    });

    it("should return false if queue is not empty", () => {
        const job: Job = {
            id: jobId(),
            command: { 
                name: 'test',
                description: 'test1',
                run: async () => {
                    const output: CommandResult = {
                        output: "hello",
                        metrics: {
                            runtime: 0,
                            bytesUploaded: 0,
                            bytesDownloaded: 0,
                        },
                    };
                    return await Promise.resolve(output);
                },
                args: [],
            },
            params: [],
        };

        jobQueue.enqueue(job);

        expect(jobQueue.isEmpty()).to.equal(false);
    });

    it("should return the size of the queue", () => {
        const job: Job = {
            id: jobId(),
            command: { 
                name: 'test',
                description: 'test1',
                run: async () => {
                    const output: CommandResult = {
                        output: "hello",
                        metrics: {
                            runtime: 0,
                            bytesUploaded: 0,
                            bytesDownloaded: 0,
                        },
                    };
                    return await Promise.resolve(output);
                },
                args: [],
            },
            params: [],
        };

        jobQueue.enqueue(job);

        expect(jobQueue.size()).to.equal(1);
    });

    it("should execute a job", async () => {
        const job: Job = {
            id: jobId(),
            command: { 
                name: 'test',
                description: 'test1',
                run: async () => {
                    const output: CommandResult = {
                        output: "hello",
                        metrics: {
                            runtime: 0,
                            bytesUploaded: 0,
                            bytesDownloaded: 0,
                        },
                    };
                    return await Promise.resolve(output);
                },
                args: [],
            },
            params: [],
        };

        const executedJob = await jobQueue.execute(job);

        expect(executedJob).to.equal(job);
    });

    it("should run all jobs in parallel", async () => {
        const job1: Job = {
            id: jobId(),
            command: { 
                name: 'test',
                description: 'test1',
                run: async () => {
                    const output: CommandResult = {
                        output: "hello",
                        metrics: {
                            runtime: 0,
                            bytesUploaded: 0,
                            bytesDownloaded: 0,
                        },
                    };
                    return await Promise.resolve(output);
                },
                args: [],
            },
            params: [],
        };

        const job2: Job = {
            id: jobId(),
            command: { 
                name: 'test',
                description: 'test12',
                run: async () => {
                    const output: CommandResult = {
                        output: "hello",
                        metrics: {
                            runtime: 0,
                            bytesUploaded: 0,
                            bytesDownloaded: 0,
                        },
                    };
                    return await Promise.resolve(output);
                },
                args: [],
            },
            params: [],
        };

        jobQueue.enqueue(job1);
        jobQueue.enqueue(job2);

        await jobQueue.run(true);

        expect(jobQueue.size()).to.equal(0);
    });

    it("should run all jobs in sequence", async () => {
        const job1: Job = {
            id: jobId(),
            command: { 
                name: 'test',
                description: 'test1',
                run: async () => {
                    const output: CommandResult = {
                        output: "hello",
                        metrics: {
                            runtime: 0,
                            bytesUploaded: 0,
                            bytesDownloaded: 0,
                        },
                    };
                    // console.log(`output: ${output.output}`)
                    return await Promise.resolve(output);
                },
                args: [],
            },
            params: [],
        };

        const job2: Job = {
            id: jobId(),
            command: { 
                name: 'test',
                description: 'test12',
                run: async () => {
                    const output: CommandResult = {
                        output: "hello2",
                        metrics: {
                            runtime: 0,
                            bytesUploaded: 0,
                            bytesDownloaded: 0,
                        },
                    };
                    // console.log(`output: ${output.output}`)
                    return await Promise.resolve(output);
                },
                args: [],
            },
            params: [],
        };

        jobQueue.enqueue(job1);
        jobQueue.enqueue(job2);

        await jobQueue.run();

        expect(jobQueue.size()).to.equal(0);
    });
})
