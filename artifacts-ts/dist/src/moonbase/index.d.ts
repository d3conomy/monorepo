import { Container } from "../container";
import { Command, CommandArg } from "../container/commands";
import { InstanceTypes } from "../container/instance";
import { ContainerId, IdReferenceFactory, MoonbaseId, PodBayId, SystemId } from "../id-reference-factory/index.js";
import { LunarPod } from "../lunar-pod";
import { StackContainers } from "../lunar-pod/levels";
import { PodBay } from "../pod-bay/index.js";
import { ContainerJob, JobDirector } from "./jobDirector.js";
import { MoonbaseOptions } from "./options.js";
declare class Moonbase {
    id: MoonbaseId;
    podBays: Array<PodBay>;
    private idReferenceFactory;
    private options;
    jobDirector: JobDirector;
    constructor({ id, systemId, options, podBays, idReferenceFactory }?: {
        id?: MoonbaseId;
        systemId?: SystemId;
        options?: MoonbaseOptions;
        podBays?: Array<PodBay> | undefined;
        idReferenceFactory?: IdReferenceFactory;
    });
    private verifyPodBay;
    addPodBay(podBay: PodBay): PodBay;
    createPodBay(): PodBay;
    getPodBay(id: PodBayId | string): PodBay;
    createPod({ id, options, initialize }: {
        id?: PodBayId;
        options: any;
        initialize?: boolean;
    }): Promise<LunarPod>;
    getContainer(id: ContainerId | string): any;
    getContainerByType(type: InstanceTypes): StackContainers | undefined;
    private addJob;
    createJob({ command, containerId, containerType, container, params }: {
        command: string | Command;
        containerId?: ContainerId | string;
        containerType?: string | InstanceTypes;
        container?: Container<any>;
        params?: Array<CommandArg<any>>;
    }): ContainerJob;
}
export { Moonbase };
//# sourceMappingURL=index.d.ts.map