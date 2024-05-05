
import { InstanceTypes, InstanceType } from "../container/instance.js";
import { ContainerTemplate, JobTemplate, MoonbaseTemplate, PodBayTemplate, PodTemplate, SystemTemplate, TemplateType, TemplateVersion } from "./templates";



interface Manifest<T = TemplateVersion> {
    version: T;
    name: string;
    description?: string;
    metadata?: any;
    spec: {
        system?: SystemTemplate;
        moonbases?: MoonbaseTemplate[];
        podBays?: PodBayTemplate[]
        pods?: PodTemplate[];
        containers?: ContainerTemplate<InstanceType>[];
        jobs?: JobTemplate[];
    }
}

export {
    Manifest
}