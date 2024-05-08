
import { ContainerId } from "../id-reference-factory/index.js";
import { ContainerError } from "./error.js";
import { InstanceOption } from "./options";

type InstanceType = keyof typeof InstanceTypes;

enum InstanceTypes {
    libp2p = 'libp2p',
    ipfs = 'ipfs',
    orbitdb = 'orbitdb',
    database = 'database',
    filesystem = 'filesystem',
    pubsub = 'pubsub',
    custom = 'custom'
}

class InstanceError extends ContainerError {
    instanceType?: InstanceType; 

    constructor(message: string, instanceType?: InstanceType, containerId?: ContainerId) {
        super(message);
        this.instanceType = instanceType;
        this.containerId = containerId;
        this.name = 'InstanceError';
    }
}

class InstanceOptionsError extends InstanceError {
    optionName: InstanceOption<any>['name'];

    constructor(optionName: InstanceOption<any>['name'], message: string, instanceType?: InstanceType, containerId?: ContainerId) {
        super(message, instanceType, containerId);
        this.optionName = optionName;
        this.name = 'InstanceOptionsError';
    }
}

export {
    InstanceError,
    InstanceOptionsError,
    InstanceType,
    InstanceTypes
}