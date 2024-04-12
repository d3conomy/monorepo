import { IdReferenceTypes, } from './IdReferenceConstants.js';
import { createRandomId } from './IdReferenceFunctions.js';
import { MetaData } from './IdReferenceMetadata.js';
/**
 * Id reference class
 */
class IdReference {
    name;
    type;
    metadata;
    constructor({ name, metadata, format } = {}) {
        this.type = IdReferenceTypes.SYSTEM;
        this.name = name ? name : createRandomId(format);
        this.metadata = metadata instanceof Map ? new MetaData({
            mapped: metadata,
            createdBy: IdReferenceTypes.SYSTEM
        }) : metadata ? metadata : new MetaData();
    }
    toString() {
        return this.name;
    }
}
class SystemId extends IdReference {
    constructor({ name, metadata, format } = {}) {
        super({ name, metadata, format });
    }
}
class MoonbaseId extends IdReference {
    systemId;
    constructor({ systemId, name, metadata, format }) {
        super({ name, metadata, format });
        this.systemId = systemId;
    }
}
class PodBayId extends IdReference {
    moonbaseId;
    constructor({ moonbaseId, name, metadata, format }) {
        super({ name, metadata, format });
        this.moonbaseId = moonbaseId;
    }
}
class PodId extends IdReference {
    podBayId;
    constructor({ podBayId, name, metadata, format }) {
        super({ name, metadata, format });
        this.podBayId = podBayId;
    }
}
class PodProcessId extends IdReference {
    podId;
    constructor({ podId, name, metadata, format }) {
        super({ name, metadata, format });
        this.podId = podId;
    }
}
class JobId extends IdReference {
    componenetId;
    constructor({ componenetId, name, metadata, format }) {
        super({ name, metadata, format });
        this.componenetId = componenetId;
    }
}
export { IdReference, SystemId, MoonbaseId, PodBayId, PodId, PodProcessId, JobId };
