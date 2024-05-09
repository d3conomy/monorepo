import { IdReferenceTypes } from "../id-reference-factory/IdReferenceConstants.js";
import { StackFactory, StackTypes } from "./stack.js";
class LunarPod {
    id;
    options;
    idReferenceFactory;
    stacks = new Array();
    constructor({ id, options, idReferenceFactory, stacks }) {
        this.id = id;
        this.options = options;
        this.idReferenceFactory = idReferenceFactory;
        stacks?.forEach(stack => {
            this.addStack(stack);
        });
    }
    async init() {
        await this.createStack({
            type: StackTypes.Database,
            options: this.options
        });
    }
    verifyStack(stack) {
        // Currently allow only a single stack per pod
        if (this.stacks.length > 0) {
            throw new Error('Pod already has a stack');
        }
        return true;
    }
    addStack(stack) {
        if (this.verifyStack(stack)) {
            this.stacks.push(stack);
            return stack;
        }
    }
    async createStack({ type, options }) {
        let stack;
        switch (type) {
            case StackTypes.Database:
                stack = await StackFactory.createStack(StackTypes.Database, this.id, this.idReferenceFactory, options);
                break;
            case StackTypes.GossipSub:
                stack = await StackFactory.createStack(StackTypes.GossipSub, this.id, this.idReferenceFactory, options);
                break;
            case StackTypes.IpfsFileSystem:
                stack = await StackFactory.createStack(StackTypes.IpfsFileSystem, this.id, this.idReferenceFactory, options);
                break;
            default:
                throw new Error('Invalid stack type');
        }
        this.addStack(stack);
        return stack;
    }
    getStacks() {
        return this.stacks;
    }
    getContainers() {
        let containers = new Array();
        this.getStacks().forEach(stack => {
            containers = containers.concat(stack.getContainers());
        });
        return containers;
    }
    createJob({ command, containerId, params }) {
        const jobId = this.idReferenceFactory.createIdReference({ type: IdReferenceTypes.JOB, dependsOn: containerId });
        const containerCommand = this.getContainers().find(container => container?.id === containerId)?.commands.get(command);
        if (containerCommand === undefined) {
            throw new Error('Command not found');
        }
        const job = {
            id: jobId,
            command: containerCommand,
            params: params
        };
        this.queueJob(job);
        return job;
    }
    queueJob(job) {
        const containerId = job.id.componentId;
        const containers = this.getContainers();
        containers.forEach(container => {
            if (container?.id === containerId) {
                container.jobs.enqueue(job);
            }
        });
    }
    async runJobs() {
        const containers = this.getContainers();
        containers.forEach(container => {
            if (container?.jobs.isEmpty() === false) {
                container?.jobs.run();
            }
        });
    }
    async stop() {
        for (const container of this.getContainers()) {
            const containerType = container?.type;
            if (containerType === ('libp2p' || 'ipfs')) {
                container?.jobs.enqueue({
                    id: this.idReferenceFactory.createIdReference({ type: IdReferenceTypes.JOB, dependsOn: container.id }),
                    command: container.commands.get('stop')
                });
            }
            if (containerType === 'database') {
                container?.jobs.enqueue({
                    id: this.idReferenceFactory.createIdReference({ type: IdReferenceTypes.JOB, dependsOn: container.id }),
                    command: container.commands.get('close')
                });
            }
        }
        await this.runJobs();
    }
}
export { LunarPod };
