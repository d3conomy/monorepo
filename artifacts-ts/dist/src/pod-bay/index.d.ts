import { LunarPod } from "../lunar-pod/index.js";
import { ContainerId, IdReferenceFactory, PodBayId, PodId } from "../id-reference-factory/index.js";
import { LunarPodOptions } from "../lunar-pod/options";
import { InstanceOptions } from "../container/options";
import { StackContainers } from "../lunar-pod/levels.js";
import { Command } from "../container/commands.js";
import { InstanceTypes } from "../container/instance.js";
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
    getContainer(containerId?: ContainerId | string, type?: InstanceTypes): StackContainers;
    getCommand(command: string, containerId?: ContainerId | string): Array<{
        container: ContainerId;
        command: Command;
    }>;
}
export { PodBay };
//# sourceMappingURL=index.d.ts.map