import { ContainerId, JobId, MoonbaseId, PodBayId, PodId, SystemId } from "../src/id-reference-factory/index.js";
const createId = (type) => {
    let systemId = new SystemId();
    let moonbaseId;
    let podbayId;
    let podId;
    let containerId;
    let jobId;
    switch (type) {
        case "system":
            return systemId;
        case "moonbase":
            moonbaseId = new MoonbaseId({ systemId: systemId });
            return moonbaseId;
        case "podbay":
            moonbaseId = new MoonbaseId({ systemId: systemId });
            podbayId = new PodBayId({ moonbaseId: moonbaseId });
            return podbayId;
        case "pod":
            moonbaseId = new MoonbaseId({ systemId: systemId });
            podbayId = new PodBayId({ moonbaseId: moonbaseId });
            podId = new PodId({ podBayId: podbayId });
            return podId;
        case "container":
            moonbaseId = new MoonbaseId({ systemId: systemId });
            podbayId = new PodBayId({ moonbaseId: moonbaseId });
            podId = new PodId({ podBayId: podbayId });
            containerId = new ContainerId({ podId: podId });
            return containerId;
        case "job":
            moonbaseId = new MoonbaseId({ systemId: systemId });
            podbayId = new PodBayId({ moonbaseId: moonbaseId });
            podId = new PodId({ podBayId: podbayId });
            containerId = new ContainerId({ podId: podId });
            jobId = new JobId({ componentId: containerId });
            return jobId;
        default:
            return systemId;
    }
};
export { createId };
