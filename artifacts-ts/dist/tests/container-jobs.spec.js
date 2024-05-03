import { expect } from "chai";
import { JobQueue } from "../src/container/jobs.js";
import { JobId, SystemId } from "../src/id-reference-factory/index.js";
describe("JobQueue", () => {
    let jobQueue;
    let jobId;
    beforeEach(() => {
        jobQueue = new JobQueue();
        jobId = () => new JobId({
            componentId: new SystemId({ name: "system1" }),
        });
    });
    it("should enqueue a job", () => {
        const job = {
            id: jobId(),
            command: {
                name: 'test',
                description: 'test1',
                run: async () => {
                    const output = {
                        output: "output",
                        metrics: {
                            runtime: 0,
                            bytesReceived: 0,
                            bytesSent: 0,
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
        const job = {
            id: jobId(),
            command: {
                name: 'test',
                description: 'test1',
                run: async () => {
                    const output = {
                        output: "hello",
                        metrics: {
                            runtime: 0,
                            bytesReceived: 0,
                            bytesSent: 0,
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
        const job = {
            id: jobId(),
            command: {
                name: 'test',
                description: 'test1',
                run: async () => {
                    const output = {
                        output: "hello",
                        metrics: {
                            runtime: 0,
                            bytesReceived: 0,
                            bytesSent: 0,
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
        const job = {
            id: jobId(),
            command: {
                name: 'test',
                description: 'test1',
                run: async () => {
                    const output = {
                        output: "hello",
                        metrics: {
                            runtime: 0,
                            bytesReceived: 0,
                            bytesSent: 0,
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
        const job = {
            id: jobId(),
            command: {
                name: 'test',
                description: 'test1',
                run: async () => {
                    const output = {
                        output: "hello",
                        metrics: {
                            runtime: 0,
                            bytesReceived: 0,
                            bytesSent: 0,
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
        const job1 = {
            id: jobId(),
            command: {
                name: 'test',
                description: 'test1',
                run: async () => {
                    const output = {
                        output: "hello",
                        metrics: {
                            runtime: 0,
                            bytesReceived: 0,
                            bytesSent: 0,
                        },
                    };
                    return await Promise.resolve(output);
                },
                args: [],
            },
            params: [],
        };
        const job2 = {
            id: jobId(),
            command: {
                name: 'test',
                description: 'test12',
                run: async () => {
                    const output = {
                        output: "hello",
                        metrics: {
                            runtime: 0,
                            bytesReceived: 0,
                            bytesSent: 0,
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
        const job1 = {
            id: jobId(),
            command: {
                name: 'test',
                description: 'test1',
                run: async () => {
                    const output = {
                        output: "hello",
                        metrics: {
                            runtime: 0,
                            bytesReceived: 0,
                            bytesSent: 0,
                        },
                    };
                    // console.log(`output: ${output.output}`)
                    return await Promise.resolve(output);
                },
                args: [],
            },
            params: [],
        };
        const job2 = {
            id: jobId(),
            command: {
                name: 'test',
                description: 'test12',
                run: async () => {
                    const output = {
                        output: "hello2",
                        metrics: {
                            runtime: 0,
                            bytesReceived: 0,
                            bytesSent: 0,
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
});
