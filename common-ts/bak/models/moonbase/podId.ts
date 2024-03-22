import { MoonbaseId } from "./id";
import { PodBayId } from "./podBayId";

/**
 * Class for an pod identity reference
 * @category LunarPod
 */
class PodId extends PodBayId {
    public podBayId: PodBayId;

    constructor({
        name,
        format,
        metadata,
        podBayId
    }: {
        podBayId: PodBayId,
        name?: string,
        format?: string,
        metadata?: Map<string, any>
    }) {
        super({name, format, metadata, moonbaseId: podBayId.moonbaseId});
        this.podBayId = podBayId;
    }
}

export {
    PodId
}