import { LunarPod } from "../lunar-pod/index.js";
class PodBay {
    id;
    idReferenceFactory;
    pods = new Array();
    constructor({ id, pods, idReferenceFactory }) {
        this.id = id;
        this.idReferenceFactory = idReferenceFactory;
        pods?.forEach(pod => {
            this.addPod(pod);
        });
    }
    verifyPod(pod) {
        // Currently allow only 10 pods per pod bay
        if (this.pods.length >= 10) {
            throw new Error('Pod bay already has 10 pods, create a new pod bay to add more pods');
        }
        return true;
    }
    addPod(pod) {
        if (this.verifyPod(pod)) {
            this.pods.push(pod);
            return pod;
        }
    }
    async createPod({ id, options, initialize = true }) {
        const pod = new LunarPod({
            id: id,
            options: options,
            idReferenceFactory: this.idReferenceFactory
        });
        this.addPod(pod);
        if (initialize) {
            await pod.init();
        }
        return pod;
    }
    async initializePod(podId) {
        const pod = this.pods.find(pod => pod.id === podId);
        if (pod) {
            await pod.init();
        }
        else {
            throw new Error('Pod not found');
        }
    }
    async stopPod(podId) {
        const pod = this.pods.find(pod => pod.id === podId);
        if (pod) {
            await pod.stop();
        }
        else {
            throw new Error('Pod not found');
        }
    }
    async destroyPod(podId) {
        const pod = this.pods.find(pod => pod.id === podId);
        if (pod) {
            await pod.stop();
            this.pods = this.pods.filter(pod => pod.id !== podId);
        }
        else {
            throw new Error('Pod not found');
        }
    }
}
export { PodBay };
