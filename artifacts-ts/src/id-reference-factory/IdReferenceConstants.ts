import { ContainerId, JobId, MoonbaseId, PodBayId, PodId, PodProcessId, SystemId } from "./IdReferenceClasses"

enum IdReferenceFormats {
    UUID = "uuid",
    NAME = "name",
    STRING = "string",
    CUSTOM = "custom"
}

enum IdReferenceTypes {
    SYSTEM = "system",
    MOONBASE = "moonbase",
    POD_BAY = "pod-bay",
    POD = "pod",
    PROCESS = "process",
    CONTAINER = "container",
    JOB = "job",
}

type IdReferenceType = SystemId | MoonbaseId | PodBayId | PodId | ContainerId | JobId


export {
    IdReferenceFormats,
    IdReferenceType,
    IdReferenceTypes
}