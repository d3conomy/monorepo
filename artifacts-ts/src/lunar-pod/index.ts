import { Job } from "../container/jobs.js";
import { InstanceOptions } from "../container/options.js";
import { ContainerId, JobId, PodId } from "../id-reference-factory/IdReferenceClasses.js";
import { IdReferenceTypes } from "../id-reference-factory/IdReferenceConstants.js";
import { IdReferenceFactory } from "../id-reference-factory/IdReferenceFactory.js";
import { StackContainers } from "./levels.js";
import { LunarPodOptions } from "./options.js";
import { DatabaseStack, Stack, StackFactory, StackTypes, Stacks } from "./stack.js";



class LunarPod {
    public id: PodId;
    private options: LunarPodOptions;
    private idReferenceFactory: IdReferenceFactory;
    private stacks: Array<Stacks> = new Array<Stacks>();

    constructor({
        id,
        options,
        idReferenceFactory,
        stacks
    }:{
        id: PodId,
        options: LunarPodOptions | InstanceOptions,
        idReferenceFactory: IdReferenceFactory,
        stacks?: Array<Stack>
    }) {
        this.id = id;
        this.options = options;
        this.idReferenceFactory = idReferenceFactory;

        stacks?.forEach(stack => {
            this.addStack(stack);
        });
    }

    public async init(): Promise<void> {
        await this.createStack({
            type: StackTypes.Database,
            options: this.options
        });
    }

    private verifyStack(stack: Stacks): boolean {
        // Currently allow only a single stack per pod
        if (this.stacks.length > 0) {
            throw new Error('Pod already has a stack');
        }
        return true;
    }

    public addStack(stack: Stacks): Stacks | undefined {
        if (this.verifyStack(stack)) {
            this.stacks.push(stack);
            return stack;
        }
    }

    private async createStack({
        type,
        options
    }:{
        type: StackTypes,
        options?: LunarPodOptions
    }): Promise<Stacks> {
        let stack: Stacks;
        switch (type) {
            case StackTypes.Database:
                stack = await StackFactory.createStack<DatabaseStack>(StackTypes.Database, this.id, this.idReferenceFactory, options);
                break;
            case StackTypes.GossipSub:
                stack = await StackFactory.createStack<Stacks>(StackTypes.GossipSub, this.id, this.idReferenceFactory, options);
                break;
            case StackTypes.IpfsFileSystem:
                stack = await StackFactory.createStack<Stacks>(StackTypes.IpfsFileSystem, this.id, this.idReferenceFactory, options);
                break;
            default:
                throw new Error('Invalid stack type');
        }
        this.addStack(stack);
        return stack;
    }

    private getStacks(): Array<Stacks> {
        return this.stacks;
    }

    private getContainers(): Array<StackContainers | undefined> {
        let containers: Array<StackContainers | undefined> = new Array<StackContainers | undefined>();
        this.getStacks().forEach(stack => {
            containers = containers.concat(stack.getContainers());
        });
        return containers;
    }

    public createJob({
        command,
        containerId,
        params
    }:{
        command: string,
        containerId: ContainerId,
        params: Array<{name: string, value: string}>
    }): Job {
        const jobId = this.idReferenceFactory.createIdReference({type: IdReferenceTypes.JOB, dependsOn: containerId}) as JobId;
        const containerCommand = this.getContainers().find(container => container?.id === containerId)?.commands.get(command);
        
        if (containerCommand === undefined) {
            throw new Error('Command not found');
        }

        const job: Job = {
            id: jobId,
            command: containerCommand,
            params: params
        } as Job;

        this.queueJob(job);
        return job;
    }

    private queueJob(job: Job): void {
        const containerId = job.id.componentId
        const containers = this.getContainers();
        containers.forEach(container => { 
            if (container?.id === containerId) {
                container.jobs.enqueue(job);
            }
        });
    }

    public async runJobs(): Promise<void> {
        const containers = this.getContainers();
        containers.forEach(container => {
            if (container?.jobs.isEmpty() === false) {
                container?.jobs.run();
            }
        });
    }

    public async stop(): Promise<void> {
        for (const container of this.getContainers()) {
            const containerType = container?.type
            if (containerType === ('libp2p' || 'ipfs')) {
                container?.jobs.enqueue({
                    id: this.idReferenceFactory.createIdReference({type: IdReferenceTypes.JOB, dependsOn: container.id}) as JobId,
                    command: container.commands.get('stop')
                });
            }

            if (containerType === 'database') {
                container?.jobs.enqueue({
                    id: this.idReferenceFactory.createIdReference({type: IdReferenceTypes.JOB, dependsOn: container.id}) as JobId,
                    command: container.commands.get('close')
                });
            }
        }
        await this.runJobs();
        
    }
}

export {
    LunarPod
}