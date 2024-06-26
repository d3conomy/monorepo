import { InstanceTypes } from "../container/instance.js";
import { Job } from "../container/jobs.js";
import { InstanceOptions } from "../container/options.js";
import { ContainerId, JobId, PodId } from "../id-reference-factory/IdReferenceClasses.js";
import { IdReferenceTypes } from "../id-reference-factory/IdReferenceConstants.js";
import { IdReferenceFactory } from "../id-reference-factory/IdReferenceFactory.js";
import { StackContainers } from "./levels.js";
import { LunarPodOptions } from "./options.js";
import { DatabaseStack, GossipSubStack, IpfsFileSystemStack, Stack, StackFactory, StackTypes, Stacks } from "./stack.js";



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
        let type = this.options.get('stack') as StackTypes;

        type = type !== undefined ? type : StackTypes.Database;
        // if (type !== undefined) {
        await this.createStack({
            type: type,
            options: this.options
        });
        // }
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
                stack = await StackFactory.createStack<GossipSubStack>(StackTypes.GossipSub, this.id, this.idReferenceFactory, options);
                break;
            case StackTypes.IpfsFileSystem:
                stack = await StackFactory.createStack<IpfsFileSystemStack>(StackTypes.IpfsFileSystem, this.id, this.idReferenceFactory, options);
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

    public getContainers(): Array<StackContainers | undefined> {
        let containers: Array<StackContainers | undefined> = new Array<StackContainers | undefined>();
        this.getStacks().forEach(stack => {
            containers = containers.concat(stack.getContainers());
        });
        return containers;
    }

    public getContainer(id: ContainerId | string): StackContainers | undefined {
        let container: StackContainers | undefined = undefined;
        this.getContainers().forEach(stackContainer => {
            if (typeof id === 'string') {
                if (stackContainer?.id.name === id) {
                    container = stackContainer;
                }
            }
            if (id instanceof ContainerId) {
                if (stackContainer?.id === id) {
                    container = stackContainer;
                }
            }
        });
        return container;
    }

    public getContainerByType(type: InstanceTypes): StackContainers | undefined {
        let container: StackContainers | undefined = undefined;
        this.getContainers().forEach(stackContainer => {
            if (stackContainer?.type === type) {
                container = stackContainer;
            }
        });
        return container;
    }


    public createJob({
        command,
        containerId,
        params
    }:{
        command: string,
        containerId: ContainerId,
        params: Array<{name: string, value: string}>
    }): { job: Job, containerId: ContainerId} {
        const jobId = this.idReferenceFactory.createIdReference({type: IdReferenceTypes.JOB, dependsOn: containerId});
        
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
        return {
            job,
            containerId
        };
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

    public async runJobs(): Promise<Job[]> {
        const containers = this.getContainers();
        let jobs: Array<Job> = new Array<Job>();
        for (const container of containers) {
            const completedJobs = await container?.jobs.run();
            if (completedJobs === undefined) {
                continue;
            }
            for (const job of completedJobs) {
                jobs.push(job);
            }
        }
        return jobs;
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