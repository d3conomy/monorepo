import { ContainerId, JobId, MoonbaseId, PodBayId, PodId, SystemId } from "../src/id-reference-factory/index.js";

const createId = (type: string) => {
    let systemId:SystemId = new SystemId();
    let moonbaseId: MoonbaseId;
    let podbayId: PodBayId;
    let podId: PodId;
    let containerId: ContainerId;
    let jobId: JobId;

    switch (type) {
        case "system":
            return systemId as SystemId;
        case "moonbase":
            moonbaseId = new MoonbaseId({ systemId: systemId });
            return moonbaseId as MoonbaseId;
        case "podbay":
            moonbaseId = new MoonbaseId({ systemId: systemId });
            podbayId = new PodBayId({ moonbaseId: moonbaseId });
            return podbayId as PodBayId;
        case "pod":
            moonbaseId = new MoonbaseId({ systemId: systemId });
            podbayId = new PodBayId({ moonbaseId: moonbaseId });
            podId = new PodId({ podBayId: podbayId });
            return podId as PodId;
        case "container":
            moonbaseId = new MoonbaseId({ systemId: systemId });
            podbayId = new PodBayId({ moonbaseId: moonbaseId });
            podId = new PodId({ podBayId: podbayId });
            containerId = new ContainerId({ podId: podId });
            return containerId as ContainerId;
        case "job":
            moonbaseId = new MoonbaseId({ systemId: systemId });
            podbayId = new PodBayId({ moonbaseId: moonbaseId });
            podId = new PodId({ podBayId: podbayId });
            containerId = new ContainerId({ podId: podId });
            jobId = new JobId({ componentId: containerId });
            return jobId as JobId;
        default:
            return systemId as SystemId;
    }
}

export {
    createId
}