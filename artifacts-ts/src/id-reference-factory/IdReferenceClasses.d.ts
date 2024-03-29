import { IIdReference, ISystemId, IMoonbaseId, IPodBayId, IPodId, IPodProcessId, IJobId } from './IdReferenceInterfaces.js';
import { IdReferenceFormats } from './IdReferenceConstants.js';
import { MetaData } from './IdReferenceMetadata.js';
/**
 * Id reference class
 */
declare class IdReference implements IIdReference {
    readonly name: string;
    metadata: MetaData;
    constructor({ name, metadata, format }?: {
        name?: string;
        metadata?: MetaData | Map<string, any>;
        format?: IdReferenceFormats | string;
    });
    toString(): string;
}
declare class SystemId extends IdReference implements ISystemId {
    constructor({ name, metadata, format }?: {
        name?: string;
        metadata?: MetaData;
        format?: IdReferenceFormats | string;
    });
}
declare class MoonbaseId extends IdReference implements IMoonbaseId {
    systemId: SystemId;
    constructor({ systemId, name, metadata, format }: {
        systemId: SystemId;
        name?: string;
        metadata?: MetaData;
        format?: IdReferenceFormats | string;
    });
}
declare class PodBayId extends IdReference implements IPodBayId {
    moonbaseId: MoonbaseId;
    constructor({ moonbaseId, name, metadata, format }: {
        moonbaseId: MoonbaseId;
        name?: string;
        metadata?: MetaData;
        format?: IdReferenceFormats | string;
    });
}
declare class PodId extends IdReference implements IPodId {
    podBayId: PodBayId;
    constructor({ podBayId, name, metadata, format }: {
        podBayId: PodBayId;
        name?: string;
        metadata?: MetaData;
        format?: IdReferenceFormats | string;
    });
}
declare class PodProcessId extends IdReference implements IPodProcessId {
    podId: PodId;
    constructor({ podId, name, metadata, format }: {
        podId: PodId;
        name?: string;
        metadata?: MetaData;
        format?: IdReferenceFormats | string;
    });
}
declare class JobId extends IdReference implements IJobId {
    componenetId: PodProcessId | PodId | PodBayId | MoonbaseId | SystemId;
    constructor({ componenetId, name, metadata, format }: {
        componenetId: PodProcessId | PodId | PodBayId | MoonbaseId | SystemId;
        name?: string;
        metadata?: MetaData;
        format?: IdReferenceFormats | string;
    });
}
export { IdReference, SystemId, MoonbaseId, PodBayId, PodId, PodProcessId, JobId };
//# sourceMappingURL=IdReferenceClasses.d.ts.map