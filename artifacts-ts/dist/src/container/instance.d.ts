import { ContainerId } from "../id-reference-factory/index.js";
import { ContainerError } from "./error.js";
import { InstanceOption } from "./options";
type InstanceType = keyof typeof InstanceTypes;
declare enum InstanceTypes {
    Libp2p = "libp2p",
    IPFS = "ipfs",
    OrbitDb = "orbitdb",
    Database = "database",
    File_System = "filesystem",
    Pub_Sub = "pubsub",
    Custom = "custom"
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