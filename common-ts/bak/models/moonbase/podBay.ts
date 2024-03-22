import { Pod } from './pod';
import { PodBayId } from './podBayId';



class PodBay {
    id: PodBayId;
    pods: Array<Pod>;

    constructor({
        id,
        pods
    }: {
        id: PodBayId,
        pods: Array<Pod>
    }) {
        this.id = id;
        this.pods = pods ? pods : new Array<Pod>();
    }
}

export {
    PodBay
}