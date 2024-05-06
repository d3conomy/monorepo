import { InstanceOption } from '../container/options.js';
import { CommandArg } from '../container/commands.js';
import { InstanceType } from '../container/instance.js';
declare enum TemplateVersions {
    V1 = "v1"
}
type TemplateVersion = keyof typeof TemplateVersions;
declare enum TemplateTypes {
    CONTAINER = "container",
    COMMANDS = "commands",
    JOB = "job",
    LUNAR_POD = "lunar-pod",
    POD_BAY = "pod-bay",
    MOONBASE = "moonbase",
    SYSTEM = "system"
}
type TemplateType = keyof typeof TemplateTypes;
interface Template<T = TemplateType, U = TemplateVersion> {
    version?: U;
    type?: T;
    name?: string;
    description?: string;
    spec?: any;
}
interface CommandTemplate extends Template<TemplateTypes.COMMANDS, TemplateVersions.V1> {
    spec: {
        args?: CommandArg<any>[];
        run: string;
    };
}
interface JobTemplate extends Template<TemplateTypes.JOB, TemplateVersions.V1> {
    spec: {
        command: string;
        params?: CommandArg<any>[];
    };
}
interface ContainerTemplate<T = InstanceType> extends Template<TemplateTypes.CONTAINER, TemplateVersions.V1> {
    spec: {
        instanceType: T;
        options?: InstanceOption<any>[];
        commands?: CommandTemplate[];
        init?: string;
        instance?: string;
        jobs?: JobTemplate[];
    };
}
interface PodTemplate extends Template<TemplateTypes.LUNAR_POD, TemplateVersions.V1> {
    spec: {
        containers: ContainerTemplate<InstanceType>[];
    };
}
interface PodBayTemplate extends Template<TemplateTypes.POD_BAY, TemplateVersions.V1> {
    spec: {
        pods: PodTemplate[];
        options: InstanceOption<any>[];
    };
}
interface MoonbaseTemplate extends Template<TemplateTypes.MOONBASE, TemplateVersions.V1> {
    spec: {
        podBays: PodBayTemplate[];
        options: InstanceOption<any>[];
    };
}
interface SystemTemplate extends Template<TemplateTypes.SYSTEM, TemplateVersions.V1> {
    spec: {
        moonbases: MoonbaseTemplate[];
        options: InstanceOption<any>[];
    };
}
export { CommandTemplate, ContainerTemplate, JobTemplate, PodTemplate, PodBayTemplate, MoonbaseTemplate, SystemTemplate, Template, TemplateType, TemplateTypes, TemplateVersion, TemplateVersions };
//# sourceMappingURL=templatesV1.d.ts.map