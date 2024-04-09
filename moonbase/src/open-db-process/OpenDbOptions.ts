import { PodProcessId } from 'd3-artifacts';
import { OrbitDbProcess } from '../orbitdb-process';

/**
 * The Types of OrbitDb databases.
 * @category Database
 */
enum OrbitDbTypes {
    EVENTS = 'events',
    DOCUMENTS = 'documents',
    KEYVALUE = 'keyvalue',
    KEYVALUEINDEXED = 'keyvalueindexed'
}

const isOrbitDbType = (value: string): OrbitDbTypes => {
    if(Object.values(OrbitDbTypes).includes(value as OrbitDbTypes)) {
        return value as OrbitDbTypes;
    }
    throw new Error('Invalid OrbitDb type');
}

/**
 * The options for opening a database.
 * @category Database
 */
class OpenDbOptions {
    public id: PodProcessId;
    public orbitDb: OrbitDbProcess;
    public databaseName: string;
    public databaseType: OrbitDbTypes;
    public dbOptions?: Map<string, string>;
    public processOptions?: any;

    /**
     * Constructs a new instance of the _OpenDbOptions class.
     */
    constructor({
        id,
        orbitDb,
        databaseName,
        databaseType,
        dbOptions,
        options
    }: {
        id: PodProcessId,
        orbitDb: OrbitDbProcess,
        databaseName: string,
        databaseType?: OrbitDbTypes | string,
        dbOptions?: Map<string, string>
        options?: any | undefined
    }) {
        this.id = id;
        this.orbitDb = orbitDb;
        this.databaseName = databaseName;
        this.databaseType = databaseType ? isOrbitDbType(databaseType) : OrbitDbTypes.EVENTS;
        this.dbOptions = dbOptions ? dbOptions : new Map<string, string>();
        this.processOptions = options ? options : undefined;
    }
}


export {
    OrbitDbTypes,
    isOrbitDbType,
    OpenDbOptions
}

