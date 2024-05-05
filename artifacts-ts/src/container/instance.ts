
import { ContainerId } from "../id-reference-factory/index.js";
import { ContainerError } from "./error.js";
import { InstanceOption } from "./options";

type InstanceType = keyof typeof InstanceTypes;

enum InstanceTypes {
    Libp2p = 'Libp2p',
    IPFS = 'IPFS',
    OrbitDb = 'OrbitDb',
    Database = 'Database',
    File_System = 'File_System',
    Pub_Sub = 'Pub_Sub',
    Custom = 'Custom'
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