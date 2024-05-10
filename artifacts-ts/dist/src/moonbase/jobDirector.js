import { JobStatus } from '../container/status.js';
import { ContainerId } from '../id-reference-factory/IdReferenceClasses.js';
class ContainerJob {
    id;
    status;
    command;
    params;
    container;
    result;
    constructor(id, command, container, params) {
        this.id = id;
        this.command = command;
        this.container = container;
        this.params = params;
    }
}
class JobDirector {
    idReferenceFactory;
    queue = new Array();
    podBays;
    constructor(idReferenceFactory, podBays) {
        this.idReferenceFactory = idReferenceFactory;
        this.podBays = podBays;
    }
    verifyJob(job) {
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
    enqueue(job) {
        if (!this.verifyJob(job)) {
            throw new Error('Invalid job');
        }
        this.queue.push(job);
        return job;
    }
    dequeue(id) {
        this.queue = this.queue.filter((job) => job.id !== id);
    }
    getQueue() {
        return this.queue;
    }
    getJob(id) {
        return this.queue.find((job) => job.id === id);
    }
    getActiveContainers() {
        let activeContainers = new Array();
        const ids = this.idReferenceFactory.getIdReferencesByType('container');
        ids.forEach((id) => {
            if (id.type === 'container') {
                activeContainers.push(id);
            }
        });
        return activeContainers;
    }
    getContainer(id) {
        let container = undefined;
        for (const podBay of this.podBays) {
            container = podBay.getContainer(id);
            if (container !== undefined) {
                return container;
            }
        }
        return container;
    }
    findContainerCommand(podBays, command) {
        let containerCommand = new Array();
        podBays.forEach((podBay) => {
            const foundCommand = podBay.getCommand(command);
            if (foundCommand !== undefined) {
                containerCommand.push(...foundCommand);
            }
        });
        return containerCommand;
    }
    createContainerJob(command, containerId, containerType, params) {
        const activeContainers = this.getActiveContainers();
        let container;
        if (!containerId && !containerType) {
            throw new Error('JobDirector: containerId or containerType is required');
        }
        if (containerId) {
            activeContainers.forEach((activeContainerId) => {
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
        let possibleContainers = Array();
        if ((typeof container === undefined) && containerType !== undefined) {
            activeContainers.forEach((activeContainerId) => {
                if (activeContainerId.type === containerType) {
                    possibleContainers.push(activeContainerId);
                }
            });
            if (possibleContainers.length === 0) {
                throw new Error('JobDirector: no containers found');
            }
            else {
                container = possibleContainers[0];
            }
        }
        let containerCommand = undefined;
        if (typeof command === 'string') {
            console.log(`command is a string: ${command}`);
            for (const podBay of this.podBays.values()) {
                const commands = podBay.getCommand(command, container);
                console.log(`commands: ${commands}`);
                for (const commandi of commands) {
                    if (commandi.command.name === command) {
                        containerCommand = commandi.command;
                        container = commandi.container;
                    }
                }
            }
        }
        else {
            containerCommand = command;
        }
        console.log(`containerCommand: ${containerCommand}`);
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
        const jobId = this.idReferenceFactory.createIdReference({ type: 'job', dependsOn: activeContainer.id });
        // create the job
        const job = new ContainerJob(jobId, containerCommand, activeContainer, params);
        this.queue.push(job);
        return job;
    }
    async execute(job) {
        if (job.status === JobStatus.Succeeded) {
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
        let returnJob = await job.container.jobs.execute(job);
        job.result = returnJob.result;
        return job;
    }
    async run() {
        let completedJobs = new Array();
        for (const job of this.queue) {
            let completedJob = await this.execute(job);
            completedJobs.push(completedJob);
        }
        return completedJobs;
    }
}
export { JobDirector, ContainerJob };
