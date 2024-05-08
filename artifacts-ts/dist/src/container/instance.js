import { ContainerError } from "./error.js";
var InstanceTypes;
(function (InstanceTypes) {
    InstanceTypes["libp2p"] = "libp2p";
    InstanceTypes["ipfs"] = "ipfs";
    InstanceTypes["orbitdb"] = "orbitdb";
    InstanceTypes["database"] = "database";
    InstanceTypes["filesystem"] = "filesystem";
    InstanceTypes["pubsub"] = "pubsub";
    InstanceTypes["custom"] = "custom";
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
