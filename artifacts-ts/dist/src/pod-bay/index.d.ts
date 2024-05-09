import { LunarPod } from "../lunar-pod/index.js";
import { IdReferenceFactory, PodBayId, PodId } from "../id-reference-factory/index.js";
import { LunarPodOptions } from "../lunar-pod/options";
import { InstanceOptions } from "../container/options";
declare class PodBay {
    id: PodBayId;
    private idReferenceFactory;
    pods: Array<LunarPod>;
    constructor({ id, pods, idReferenceFactory }: {
        id: PodBayId;
        pods?: Array<LunarPod>;
        idReferenceFactory: IdReferenceFactory;
    });
    private verifyPod;
    addPod(pod: LunarPod): LunarPod | undefined;
    createPod({ id, options, initialize }: {
        id: PodId;
        options: LunarPodOptions | InstanceOptions;
        initialize?: boolean;
    }): Promise<LunarPod>;
    initializePod(podId: PodId): Promise<void>;
    stopPod(podId: PodId): Promise<void>;
    destroyPod(podId: PodId): Promise<void>;
}
export { PodBay };
//# sourceMappingURL=index.d.ts.map