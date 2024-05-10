import { Container } from "../container";
import { Command, CommandArg } from "../container/commands";
import { InstanceTypes } from "../container/instance";
import { Job, JobQueue } from "../container/jobs";
import { ContainerId, IdReferenceFactory, MoonbaseId, PodBayId, PodId, SystemId } from "../id-reference-factory/index.js";
import { LunarPod } from "../lunar-pod";
import { StackContainers } from "../lunar-pod/levels";
import { PodBay } from "../pod-bay/index.js";
import { ContainerJob, JobDirector } from "./jobDirector.js";
import { MoonbaseOptions } from "./options.js";

class Moonbase {
    public id: MoonbaseId;
    public podBays: Array<PodBay> = new Array<PodBay>();
    private idReferenceFactory: IdReferenceFactory;
    private options: MoonbaseOptions;
    public jobDirector: JobDirector

    constructor({
        id,
        systemId,
        options,
        podBays,
        idReferenceFactory
    }:{
        id?: MoonbaseId,
        systemId?: SystemId,
        options?: MoonbaseOptions,
        podBays?: Array<PodBay> | undefined,
        idReferenceFactory?: IdReferenceFactory
    } = {}) {
        this.idReferenceFactory = idReferenceFactory !== undefined ? idReferenceFactory : new IdReferenceFactory();
        this.options = options !== undefined ? options : new MoonbaseOptions();
        this.id = id !== undefined ? id : this.idReferenceFactory.createIdReference({type: 'moonbase', dependsOn: systemId}) as MoonbaseId;
        this.jobDirector = new JobDirector(this.idReferenceFactory, this.podBays);

        if (podBays !== undefined && podBays.length > 0) {
            for (let podBay of podBays) {
                this.addPodBay(podBay);
            }
        }

        if (this.options.get('createPodBay') !== undefined && this.options.get('createPodBay') === true) {
            this.createPodBay();
        }
    }

    private verifyPodBay(podBay: PodBay): boolean {
        if (this.podBays.find((existingPodBay) => existingPodBay.id === podBay.id) !== undefined) {
            return false;
        }
        return true;
    }

    public addPodBay(podBay: PodBay): PodBay {
        if (!this.verifyPodBay(podBay)) {
            throw new Error('PodBay already exists');
        }
        this.podBays.push(podBay);
        return podBay;
    }

    public createPodBay(): PodBay {
        const podBayId = this.idReferenceFactory.createIdReference({type: 'pod-bay', dependsOn: this.id}) as PodBayId;
        return this.addPodBay(new PodBay({id: podBayId, idReferenceFactory: this.idReferenceFactory}));
    }

    public getPodBay(id: PodBayId | string): PodBay {
        let podBay: PodBay | undefined = undefined;
        if (typeof id === 'string') {
            podBay = this.podBays.find((podBay) => podBay.id.name === id);
        }
        if (id instanceof PodBayId) {
            podBay = this.podBays.find((podBay) => podBay.id === id);
        }
        if (podBay === undefined) {
            throw new Error('PodBay not found');
        }
        return podBay;
    }

    public async createPod({
        id,
        options,
        initialize = true
    }:{
        id?: PodBayId,
        options: any,
        initialize?: boolean
    }): Promise<LunarPod> {
        let podBay: PodBay | undefined = undefined;
        if (id !== undefined) {
            podBay = this.getPodBay(id);
        }
        else {
            podBay = this.podBays[0];
        }

        const podId = this.idReferenceFactory.createIdReference({type: 'pod', dependsOn: podBay.id}) as PodId;
        return await podBay.createPod({id: podId, options, initialize});
    }

    public getContainer(id: ContainerId | string): any {
        let container: any | undefined = undefined;
        if (typeof id === 'string') {
            container = this.podBays.map((podBay: PodBay) => podBay.getContainer(id)).find((container) => container !== undefined);
        }
        if (id instanceof ContainerId) {
            container = this.podBays.map((podBay: PodBay) => podBay.getContainer(id)).find((container) => container !== undefined);
        }
        if (container === undefined) {
            throw new Error('Container not found');
        }
        return container;
    }

    public getContainerByType(type: InstanceTypes): StackContainers | undefined {
        let container: StackContainers | undefined = undefined;
        const podBays = this.podBays;
        for (let podBay of podBays) {
            console.log(`podBay: ${podBay}`)
            container = podBay.getContainer(type);

            if (container !== undefined) {
                break;
            }
        }
        return container;
    }

    private addJob(job: ContainerJob): ContainerJob {
        this.jobDirector.enqueue(job);
        return job;
    }

    public createJob({
        command,
        containerId,
        containerType,
        container,
        params
    }: {
        command: string | Command,
        containerId?: ContainerId | string,
        containerType?: string | InstanceTypes
        container?: Container<any>,
        params?: Array<CommandArg<any>>
    }) {
        const job = this.jobDirector.createContainerJob(command, containerId, containerType, params);
        return this.addJob(job);
    }
}

export { Moonbase };