import { Command, CommandArg, CommandResult } from '../container/commands.js';
import { Container } from '../container/index.js';
import { InstanceTypes } from '../container/instance.js';
import { Job, JobQueue } from '../container/jobs.js';
import { JobStatus } from '../container/status.js';
import { ContainerId, JobId } from '../id-reference-factory/IdReferenceClasses.js';
import { IdReferenceFactory, IdTypes } from '../id-reference-factory/IdReferenceFactory.js';
import { PodBay } from '../pod-bay/index.js';

class ContainerJob implements Job {
    id: JobId;
    status?: JobStatus | undefined;
    command: Command;
    params?: CommandArg<any>[] | undefined;
    container: Container;
    result?: CommandResult | undefined;

    constructor(id: JobId, command: Command, container: Container, params?: CommandArg<any>[]) {
        this.id = id;
        this.command = command;
        this.container = container;
        this.params = params;
    }
}

class JobDirector {
    private idReferenceFactory: IdReferenceFactory;
    public queue: Array<ContainerJob> = new Array<ContainerJob>();
    private podBays: Array<PodBay>;

    constructor(idReferenceFactory: IdReferenceFactory, podBays: Array<PodBay>) {
        this.idReferenceFactory = idReferenceFactory;
        this.podBays = podBays;
    }

    private verifyJob(job: ContainerJob): boolean {
        if (job.command === undefined) {
            return false;
        }
        if (job.container === undefined) {
            return false;
        }
        for (const queuedJob of this.queue) {
            if (queuedJob.id === job.id) {
                return false;
            }
        }
        return true;
    }

    public enqueue(job: ContainerJob): ContainerJob {
        if (!this.verifyJob(job)) {
            throw new Error('Invalid job');
        }

        this.queue.push(job);
        return job;
    }

    public dequeue(id: JobId): void {
        this.queue = this.queue.filter((job) => job.id !== id);
    }

    public getQueue(): Array<ContainerJob> {
        return this.queue;
    }

    public getJob(id: JobId): ContainerJob | undefined {
        return this.queue.find((job) => job.id === id);
    }

    private getActiveContainers(): Array<ContainerId> {
        let activeContainers: Array<ContainerId> = new Array<ContainerId>();
        const ids = this.idReferenceFactory.getIdReferencesByType('container');
        ids.forEach((id) => {
            if (id.type === 'container') {
                activeContainers.push(id as ContainerId);
            }
        })
        return activeContainers;
    }

    private getContainer(id: ContainerId): Container | undefined {
        let container: Container | undefined = undefined;
        for (const podBay of this.podBays) {
            container = podBay.getContainer(id);
            if (container !== undefined) {
                return container;
            }
        }
        return container;
    }

    private findContainerCommand(podBays: Array<PodBay>, command: string): Array<{container: ContainerId, command: Command}> {
        let containerCommand: Array<{container: ContainerId, command: Command}> = new Array<{container: ContainerId, command: Command}>();
        podBays.forEach((podBay) => {
            const foundCommand = podBay.getCommand(command);
            if (foundCommand !== undefined) {
                containerCommand.push(...foundCommand);
            }
        })
        return containerCommand;
    }


    createContainerJob(
        command: Command | string,
        containerId?: ContainerId | string | undefined,
        containerType?: InstanceTypes | string | undefined,
        params?: CommandArg<any>[]
    ): ContainerJob {
        const activeContainers = this.getActiveContainers();
        let container: ContainerId | undefined

        if (!containerId && !containerType) {
            throw new Error('JobDirector: containerId or containerType is required');
        }

        if (containerId) {
            activeContainers.forEach((activeContainerId: ContainerId) => {
                if (containerId instanceof ContainerId) {
                    if (containerId === activeContainerId) {
                        container = containerId;
                    }
                }
                else if (typeof containerId === 'string') {
                    if (containerId === activeContainerId.name) {
                        container = activeContainerId;
                    }
                }
            });
        }

        if ((container instanceof ContainerId) && containerType !== undefined) {
            if (container.type !== containerType) {
                throw new Error('JobDirector: containerId and containerType do not match');
            }
        }

        let possibleContainers = Array<ContainerId>();
        if ((typeof container === undefined) && containerType !== undefined) {
            activeContainers.forEach((activeContainerId: ContainerId) => {
                if (activeContainerId.type === containerType) {
                    possibleContainers.push(activeContainerId);
                }
            })

            if (possibleContainers.length === 0) {
                throw new Error('JobDirector: no containers found');
            }
            else {
                container = possibleContainers[0];
            }
        }
        
        let containerCommand: Command | undefined = undefined;
        if (typeof command === 'string') {
            console.log(`command is a string: ${command}`)
            for (const podBay of this.podBays.values()) {
                 const commands = podBay.getCommand(command as string, container);
                 console.log(`commands: ${commands}`)
                for (const commandi of commands) {
                    if (commandi.command.name === command) {
                        containerCommand = commandi.command;
                        container = commandi.container;
                    }
                }
            }
        }
        else {
            containerCommand = command as Command
        }

        console.log(`containerCommand: ${containerCommand}`)

        if (containerCommand === undefined) {
            throw new Error('JobDirector: command not found');
        }
        if (container === undefined) {
            throw new Error('JobDirector: container not found');
        }
        const activeContainer = this.getContainer(container);

        if (activeContainer === undefined) {
            throw new Error('JobDirector: Hmm... container not found, but it should be there.');
        }

        const jobId: JobId = this.idReferenceFactory.createIdReference({type: 'job', dependsOn: activeContainer.id}) as JobId;

        // create the job
        const job: ContainerJob = new ContainerJob(jobId, containerCommand, activeContainer, params);

        this.queue.push(job);
        return job;
    }

    public async execute(job: ContainerJob): Promise<ContainerJob> {
        if (job.status === JobStatus.Succeeded ) {
            throw new Error('JobDirector: job already completed');
        }
        if (job.status === JobStatus.Running) {
            throw new Error('JobDirector: job already running');
        }
        if (job.status === JobStatus.Failed) {
            throw new Error('JobDirector: job failed');
        }

        if (this.queue.includes(job)) {
            this.dequeue(job.id);
        }

        //execute on the container
        let returnJob: Job = await job.container.jobs.execute(job);

        job.result = returnJob.result;

        return job;
    }

    public async run(): Promise<Array<ContainerJob>> {
        let completedJobs: Array<ContainerJob> = new Array<ContainerJob>();
        for (const job of this.queue) {
            let completedJob: ContainerJob = await this.execute(job);
            completedJobs.push(completedJob);
        }
        return completedJobs;
    }
}

export {
    JobDirector,
    ContainerJob
}