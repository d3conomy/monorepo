import { ContainerError } from "./error.js";
var InstanceTypes;
(function (InstanceTypes) {
    InstanceTypes["Libp2p"] = "libp2p";
    InstanceTypes["IPFS"] = "ipfs";
    InstanceTypes["OrbitDb"] = "orbitdb";
    InstanceTypes["Database"] = "database";
    InstanceTypes["File_System"] = "filesystem";
    InstanceTypes["Pub_Sub"] = "pubsub";
    InstanceTypes["Custom"] = "custom";
})(InstanceTypes || (InstanceTypes = {}));
class InstanceError extends ContainerError {
    instanceType;
    constructor(message, instanceType, containerId) {
        super(message);
        this.instanceType = instanceType;
        this.containerId = containerId;
        this.name = 'InstanceError';
    }
}
class InstanceOptionsError extends InstanceError {
    optionName;
    constructor(optionName, message, instanceType, containerId) {
        super(message, instanceType, containerId);
        this.optionName = optionName;
        this.name = 'InstanceOptionsError';
    }
}
export { InstanceError, InstanceOptionsError, InstanceTypes };
