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
    public orbitDb: OrbitDbProcess;
    public databaseName: string;
    public databaseType: OrbitDbTypes;
    public options?: Map<string, string>;

    /**
     * Constructs a new instance of the _OpenDbOptions class.
     */
    constructor({
        orbitDb,
        databaseName,
        databaseType,
        options
    }: {
        orbitDb: OrbitDbProcess,
        databaseName: string,
        databaseType?: OrbitDbTypes | string,
        options?: Map<string, string>
    }) {
        this.orbitDb = orbitDb;
        this.databaseName = databaseName;
        this.databaseType = databaseType ? isOrbitDbType(databaseType) : OrbitDbTypes.EVENTS;
        this.options = options ? options : new Map<string, string>();
    }
}


export {
    OrbitDbTypes,
    isOrbitDbType,
    OpenDbOptions
}

