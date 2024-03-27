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
    IdReferenceFormats,
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
class IdReference 
    implements IIdReference 
{
    public readonly name: string;
    public metadata: MetaData;

    constructor({
        name,
        metadata,
        format
    }: {
        name?: string,
        metadata?: MetaData,
        format?: IdReferenceFormats | string
    }) {
        this.name = name ? name : createRandomId(format);
        this.metadata = metadata ? metadata : new MetaData();
    }

    public toString(): string {
        return this.name;
    }
}

class SystemId
    extends IdReference 
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
    extends IdReference 
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
    extends IdReference 
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
    extends IdReference 
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
    extends IdReference 
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
    extends IdReference 
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

