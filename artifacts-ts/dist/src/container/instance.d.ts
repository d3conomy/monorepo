import { ContainerId } from "../id-reference-factory/index.js";
import { ContainerError } from "./error.js";
import { InstanceOption } from "./options";
type InstanceType = keyof typeof InstanceTypes;
declare enum InstanceTypes {
    libp2p = "libp2p",
    ipfs = "ipfs",
    orbitdb = "orbitdb",
    database = "database",
    filesystem = "filesystem",
    pubsub = "pubsub",
    custom = "custom"
}
declare class InstanceError extends ContainerError {
    instanceType?: InstanceType;
    constructor(message: string, instanceType?: InstanceType, containerId?: ContainerId);
}
declare class InstanceOptionsError extends InstanceError {
    optionName: InstanceOption<any>['name'];
    constructor(optionName: InstanceOption<any>['name'], message: string, instanceType?: InstanceType, containerId?: ContainerId);
}
export { InstanceError, InstanceOptionsError, InstanceType, InstanceTypes };
//# sourceMappingURL=instance.d.ts.map