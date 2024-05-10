import { ContainerId, IdReferenceFactory, PodBayId } from "../id-reference-factory/index.js";
import { PodBay } from "../pod-bay/index.js";
import { JobDirector } from "./jobDirector.js";
import { MoonbaseOptions } from "./options.js";
class Moonbase {
    id;
    podBays = new Array();
    idReferenceFactory;
    options;
    jobDirector;
    constructor({ id, systemId, options, podBays, idReferenceFactory } = {}) {
        this.idReferenceFactory = idReferenceFactory !== undefined ? idReferenceFactory : new IdReferenceFactory();
        this.options = options !== undefined ? options : new MoonbaseOptions();
        this.id = id !== undefined ? id : this.idReferenceFactory.createIdReference({ type: 'moonbase', dependsOn: systemId });
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
    verifyPodBay(podBay) {
        if (this.podBays.find((existingPodBay) => existingPodBay.id === podBay.id) !== undefined) {
            return false;
        }
        return true;
    }
    addPodBay(podBay) {
        if (!this.verifyPodBay(podBay)) {
            throw new Error('PodBay already exists');
        }
        this.podBays.push(podBay);
        return podBay;
    }
    createPodBay() {
        const podBayId = this.idReferenceFactory.createIdReference({ type: 'pod-bay', dependsOn: this.id });
        return this.addPodBay(new PodBay({ id: podBayId, idReferenceFactory: this.idReferenceFactory }));
    }
    getPodBay(id) {
        let podBay = undefined;
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
    async createPod({ id, options, initialize = true }) {
        let podBay = undefined;
        if (id !== undefined) {
            podBay = this.getPodBay(id);
        }
        else {
            podBay = this.podBays[0];
        }
        const podId = this.idReferenceFactory.createIdReference({ type: 'pod', dependsOn: podBay.id });
        return await podBay.createPod({ id: podId, options, initialize });
    }
    getContainer(id) {
        let container = undefined;
        if (typeof id === 'string') {
            container = this.podBays.map((podBay) => podBay.getContainer(id)).find((container) => container !== undefined);
        }
        if (id instanceof ContainerId) {
            container = this.podBays.map((podBay) => podBay.getContainer(id)).find((container) => container !== undefined);
        }
        if (container === undefined) {
            throw new Error('Container not found');
        }
        return container;
    }
    getContainerByType(type) {
        let container = undefined;
        const podBays = this.podBays;
        for (let podBay of podBays) {
            console.log(`podBay: ${podBay}`);
            container = podBay.getContainer(type);
            if (container !== undefined) {
                break;
            }
        }
        return container;
    }
    addJob(job) {
        this.jobDirector.enqueue(job);
        return job;
    }
    createJob({ command, containerId, containerType, container, params }) {
        const job = this.jobDirector.createContainerJob(command, containerId, containerType, params);
        return this.addJob(job);
    }
}
export { Moonbase };
