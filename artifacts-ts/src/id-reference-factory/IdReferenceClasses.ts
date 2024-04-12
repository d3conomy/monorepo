import {
    IIdReference,
    ISystemId,
    IMoonbaseId,
    IPodBayId,
    IPodId,
    IPodProcessId,
    IJobId,
} from './IdReferenceInterfaces.js';

import {
    IdReferenceFormats, IdReferenceTypes,
} from './IdReferenceConstants.js';

import {
    createRandomId
} from './IdReferenceFunctions.js';

import {
    MetaData
} from './IdReferenceMetadata.js';


/**
 * Id reference class
 */
class IdReference<T extends IdReferenceTypes = IdReferenceTypes>
    implements IIdReference
{
    public readonly name: string;
    public readonly type: T;
    public metadata: MetaData;

    constructor({
        name,
        metadata,
        format
    }: {
        name?: string,
        metadata?: MetaData | Map<string, any>
        format?: IdReferenceFormats | string
    } = {}) {
        this.type = IdReferenceTypes.SYSTEM as T;
        this.name = name ? name : createRandomId(format);
        this.metadata = metadata instanceof Map ? new MetaData({
            mapped: metadata,
            createdBy: IdReferenceTypes.SYSTEM
        }) : metadata ? metadata : new MetaData();
    }

    public toString(): string {
        return this.name;
    }
}

class SystemId
    extends IdReference<IdReferenceTypes.SYSTEM>
    implements ISystemId
{
    constructor({
        name,
        metadata,
        format
    }: {
        name?: string,
        metadata?: MetaData,
        format?: IdReferenceFormats | string
    } = {}) {
        super({name, metadata, format});
    }
}

class MoonbaseId
    extends IdReference<IdReferenceTypes.MOONBASE>
    implements IMoonbaseId
{
    public systemId: SystemId;

    constructor({
        systemId,
        name,
        metadata,
        format
    }: {
        systemId: SystemId,
        name?: string,
        metadata?: MetaData,
        format?: IdReferenceFormats | string
    }) {
        super({name, metadata, format});
        this.systemId = systemId;
    }
}

class PodBayId 
    extends IdReference<IdReferenceTypes.POD_BAY>
    implements IPodBayId
{
    public moonbaseId: MoonbaseId;

    constructor({
        moonbaseId,
        name,
        metadata,
        format
    }: {
        moonbaseId: MoonbaseId,
        name?: string,
        metadata?: MetaData,
        format?: IdReferenceFormats | string
    }) {
        super({name, metadata, format});
        this.moonbaseId = moonbaseId;
    }
}

class PodId 
    extends IdReference<IdReferenceTypes.POD>
    implements IPodId
{
    public podBayId: PodBayId;

    constructor({
        podBayId,
        name,
        metadata,
        format
    }: {
        podBayId: PodBayId,
        name?: string,
        metadata?: MetaData,
        format?: IdReferenceFormats | string
    }) {
        super({name, metadata, format});
        this.podBayId = podBayId;
    }
}

class PodProcessId 
    extends IdReference<IdReferenceTypes.PROCESS>
    implements IPodProcessId
{
    public podId: PodId;

    constructor({
        podId,
        name,
        metadata,
        format
    }: {
        podId: PodId,
        name?: string,
        metadata?: MetaData,
        format?: IdReferenceFormats | string
    }) {
        super({name, metadata, format});
        this.podId = podId;
    }
}

class JobId
    extends IdReference<IdReferenceTypes.JOB>
    implements IJobId
{
    public componenetId: PodProcessId | PodId | PodBayId | MoonbaseId | SystemId;

    constructor({
        componenetId,
        name,
        metadata,
        format
    }: {
        componenetId: PodProcessId | PodId | PodBayId | MoonbaseId | SystemId,
        name?: string,
        metadata?: MetaData,
        format?: IdReferenceFormats | string
    }) {
        super({name, metadata, format});
        this.componenetId = componenetId;
    }
}

export {
    IdReference,
    SystemId,
    MoonbaseId,
    PodBayId,
    PodId,
    PodProcessId,
    JobId
}

