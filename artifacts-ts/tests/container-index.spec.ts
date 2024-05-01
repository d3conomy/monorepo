import { expect } from "chai";
import { Container } from "../src/container/index.js";
import { Commands } from "../src/container/commands.js";
import { Job, JobQueue } from "../src/container/jobs.js";
import { InstanceTypes } from "../src/container/instance.js";
import { ContainerId, JobId, SystemId } from "../src/id-reference-factory/index.js";
import { InstanceOption } from "./container/options.js";
import { createId } from "./helpers.js";

describe("Container", () => {
    describe("constructor", () => {
        it("should create a new Container instance", () => {
            const commands = new Commands({ commands: [{
                name: "test",
                description: "Test command",
                args: [],
                run: async () => {return{ output: null, metrics: { runtime: 0, bytesUploaded: 0, bytesDownloaded: 0 } }}
            }]});
            const container = new Container<InstanceTypes.Custom>({
                id: createId('container') as ContainerId,
                type: InstanceTypes.Custom,
                commands: commands
            });

            expect(container).to.be.an.instanceOf(Container);
            expect(container.type).to.equal(InstanceTypes.Custom);
            expect(container.commands).to.equal(commands);
            expect(container.jobs).to.be.an.instanceOf(JobQueue);
        });

        it("should enqueue jobs if provided", () => {
            const commands = new Commands({ commands: [{
                name: "test",
                description: "Test command",
                args: [],
                run: async () => { return { output: null, metrics: { runtime: 0, bytesUploaded: 0, bytesDownloaded: 0 } }}
            }]});
            const jobId = () => new JobId({
                componentId: new SystemId({ name: "component1" }),
            })
            const job1: Job = { id: jobId(), command: commands.get('test'), params: [] };
            const job2: Job = { id: jobId(), command: commands.get('test'), params: [] };
            const jobs = [job1, job2];
            const container = new Container<InstanceTypes.Custom>({
                id: createId('container') as ContainerId,
                type: InstanceTypes.Custom,
                commands: commands,
                jobs: jobs
            });

            expect(container.jobs.size()).to.equal(jobs.length);
            expect(container.jobs.dequeue()).to.equal(jobs[0]);
            expect(container.jobs.dequeue()).to.equal(jobs[1]);
        });
    });

    describe("getInstance", () => {
        it("should return the instance", () => {
            const instance = { test: true };
            const container = new Container<InstanceTypes.Custom>({
                id: createId('container') as ContainerId,
                type: InstanceTypes.Custom,
                commands: new Commands({ commands: [] }),
                instance: instance
            });

            expect(container.getInstance()).to.equal(instance);
        });
    })

    describe("setInstance", () => {
        it("should setInstance the instance", () => {
            const instance = { test: true };
            const container = new Container<InstanceTypes.Custom>({
                id: createId('container') as ContainerId,
                type: InstanceTypes.Custom,
                commands: new Commands({ commands: [] }),
            });

            container.setInstance(instance);

            expect(container.getInstance()).to.equal(instance);
        });
    });

    describe("init", () => {
        it("should initialize the instance", async () => {
            const instance = { test: true };
            const initializer = async () => instance;
            const container = new Container<InstanceTypes.Custom>({
                id: createId('container') as ContainerId,
                type: InstanceTypes.Custom,
                commands: new Commands({ commands: [] }),
                initializer: initializer
            });

            await container.init();

            expect(container.getInstance()).to.equal(instance);
        });
    });

    describe("commands", () => {
        it("should setInstance the instance on the commands", () => {
            const commands = new Commands({ commands: [] });
            const instance = { test: true };
            const container = new Container<InstanceTypes.Custom>({
                id: createId('container') as ContainerId,
                type: InstanceTypes.Custom,
                commands: commands,
                instance: instance
            });

            expect(container.getInstance()).to.equal(instance);
        });
    });

    describe("jobs", () => {
        it("should setInstance the instance on the jobs", () => {
            const commands = new Commands({ commands: [] });
            const instance = { test: true };
            const container = new Container<InstanceTypes.Custom>({
                id: createId('container') as ContainerId,                
                type: InstanceTypes.Custom,
                commands: commands,
                instance: instance
            });

            expect(container.getInstance()).to.equal(instance);
        });
    });

    describe("type", () => {
        it("should return the type", () => {
            const container = new Container<InstanceTypes.Custom>({
                id: createId('container') as ContainerId,
                type: InstanceTypes.Custom,
                commands: new Commands({ commands: [] }),
            });

            expect(container.type).to.equal(InstanceTypes.Custom);
        });
    });

    describe("options", () => {
        it("should return the options", () => {
            const option1: InstanceOption<string> = { name: "test", value: "test" }
            const option2: InstanceOption<string> = { name: "test2", value: "test2" }
            const container = new Container<InstanceTypes.Custom>({
                id: createId('container') as ContainerId,
                type: InstanceTypes.Custom,
                commands: new Commands({ commands: [] }),
                options: [option1, option2]
            });

            expect(container.options).to.deep.equal([option1, option2]);
        });
    });

    describe("setInstance", () => {
        it("should set the instance", () => {
            const instance = { test: true };
            const container = new Container<InstanceTypes.Custom>({
                id: createId('container') as ContainerId,
                type: InstanceTypes.Custom,
                commands: new Commands({ commands: [] }),
            });

            container.setInstance(instance);

            expect(container.getInstance()).to.equal(instance);
        });
    });
});
