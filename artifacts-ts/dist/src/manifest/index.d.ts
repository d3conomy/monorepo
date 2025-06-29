import { InstanceType } from "../container/instance.js";
import { ContainerTemplate, JobTemplate, MoonbaseTemplate, PodBayTemplate, PodTemplate, SystemTemplate, TemplateVersion } from "./templatesV1.js";
interface Manifest<T = TemplateVersion> {
    version: T;
    name: string;
    description?: string;
    metadata?: any;
    spec: {
        system?: SystemTemplate;
        moonbases?: MoonbaseTemplate[];
        podBays?: PodBayTemplate[];
        pods?: PodTemplate[];
        containers?: ContainerTemplate<InstanceType>[];
        jobs?: JobTemplate[];
    };
}
export { Manifest };
export * from './templatesV1.js';
export * from './import.js';
//# sourceMappingURL=index.d.ts.map