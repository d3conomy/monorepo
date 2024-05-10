import { Command, CommandArg, CommandResult } from '../container/commands.js';
import { Container } from '../container/index.js';
import { InstanceTypes } from '../container/instance.js';
import { Job } from '../container/jobs.js';
import { JobStatus } from '../container/status.js';
import { ContainerId, JobId } from '../id-reference-factory/IdReferenceClasses.js';
import { IdReferenceFactory } from '../id-reference-factory/IdReferenceFactory.js';
import { PodBay } from '../pod-bay/index.js';
declare class ContainerJob implements Job {
    id: JobId;
    status?: JobStatus | undefined;
    command: Command;
    params?: CommandArg<any>[] | undefined;
    container: Container;
    result?: CommandResult | undefined;
    constructor(id: JobId, command: Command, container: Container, params?: CommandArg<any>[]);
}
declare class JobDirector {
    private idReferenceFactory;
    queue: Array<ContainerJob>;
    private podBays;
    constructor(idReferenceFactory: IdReferenceFactory, podBays: Array<PodBay>);
    private verifyJob;
    enqueue(job: ContainerJob): ContainerJob;
    dequeue(id: JobId): void;
    getQueue(): Array<ContainerJob>;
    getJob(id: JobId): ContainerJob | undefined;
    private getActiveContainers;
    private getContainer;
    private findContainerCommand;
    createContainerJob(command: Command | string, containerId?: ContainerId | string | undefined, containerType?: InstanceTypes | string | undefined, params?: CommandArg<any>[]): ContainerJob;
    execute(job: ContainerJob): Promise<ContainerJob>;
    run(): Promise<Array<ContainerJob>>;
}
export { JobDirector, ContainerJob };
//# sourceMappingURL=jobDirector.d.ts.map