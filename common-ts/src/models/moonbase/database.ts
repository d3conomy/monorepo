import { IIdReference, IdReference, IdReferenceFormat } from '../idReference';
import { PodProcess } from './process';
import { Peer } from './peer';
import { Defaults } from '../../defaults';

/**
 * The Types of OrbitDb databases.
 * @category Database
 */
enum OrbitDbTypes {
    Events = 'events',
    Documents = 'documents',
    KeyValue = 'keyvalue',
    KeyValueIndexed = 'keyvalueindexed'
}

/**
 * Check if the type is a valid OrbitDb type
 * @category Database
 * @description If no type is provided, the default is used
 */
const isOrbitDbType = (type?: string): OrbitDbTypes => {
    if (!type) {
        return Defaults.moonbaseDbType;
    }
    
    if (Object.values(OrbitDbTypes).includes(type as OrbitDbTypes)) {
        return type as OrbitDbTypes;
    }
    throw new Error('Invalid OrbitDb type');
}

/**
 * Class for a database reference
 * @category Database
 */
class DatabaseReference
    extends IdReference
    implements IIdReference
{
    public dbType?: OrbitDbTypes;
    public address?: string;
    public peers?: Array<Peer>;

    constructor({
        name,
        format,
        metadata,
        dbType,
        address,
        peers
    }: {
        name?: string,
        format?: IdReferenceFormat,
        metadata?: Map<string, any>,
        dbType?: OrbitDbTypes,
        address?: string,
        peers?: Array<Peer>
    } = {}) {
        super({name, metadata, format});
        this.dbType = isOrbitDbType(dbType);
        this.address = address;
        this.peers = peers;
    }

}

/**
 * Class for a database
 * @category Database
 */
class Database
    extends DatabaseReference
    implements IIdReference
{
    description?: string;
    schema?: Map<string, string>;
    options?: Map<string, string>;
    dateCreated: string;
    dateUpdated?: string;
    dateDeleted?: string;
    deleted: boolean;
    process?: PodProcess;

    constructor({
        name,
        format,
        metadata,
        dbType,
        address,
        peers,
        description,
        schema,
        options,
        dateCreated,
        dateUpdated,
        dateDeleted,
        deleted,
        process
    }: {
        name?: string,
        format?: IdReferenceFormat,
        metadata?: Map<string, any>,
        dbType?: OrbitDbTypes,
        address?: string,
        peers?: Array<Peer>,
        description?: string,
        schema?: Map<string, string>,
        options?: Map<string, string>,
        dateCreated?: string,
        dateUpdated?: string,
        dateDeleted?: string,
        deleted?: boolean,
        process?: PodProcess
    } = {}) {
        super({name, format, metadata, dbType, address, peers});
        this.description = description;
        this.schema = schema;
        this.options = options;
        this.dateCreated = dateCreated ? dateCreated : new Date().toISOString();
        this.dateUpdated = dateUpdated;
        this.dateDeleted = dateDeleted;
        this.deleted = deleted ? deleted : false;
        this.process = process;
    }
}

export {
    OrbitDbTypes,
    DatabaseReference,
    Database
}