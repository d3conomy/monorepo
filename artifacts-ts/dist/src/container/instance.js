import { ContainerError } from "./error.js";
var InstanceTypes;
(function (InstanceTypes) {
    InstanceTypes["Libp2p"] = "Libp2p";
    InstanceTypes["IPFS"] = "IPFS";
    InstanceTypes["OrbitDb"] = "OrbitDb";
    InstanceTypes["Database"] = "Database";
    InstanceTypes["File_System"] = "File_System";
    InstanceTypes["Pub_Sub"] = "Pub_Sub";
    InstanceTypes["Custom"] = "Custom";
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
