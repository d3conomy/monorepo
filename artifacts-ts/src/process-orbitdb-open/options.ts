
import { PodProcessId } from '../id-reference-factory/IdReferenceClasses.js';
import { IProcessOption, createProcessOption } from '../process-interface/processOptions.js';
import { OrbitDbProcess } from '../process-orbitdb/process.js';

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

const orbitDbOptions = (): Array<IProcessOption> => [
    createProcessOption({
        name: "orbitdb",
        description: "The OrbitDb process",
        required: true
    }),
    createProcessOption({
        name: "databaseName",
        description: "The name of the database",
        required: true
    }),
    createProcessOption({
        name: "databaseType",
        description: "The type of the database",
        required: false,
        defaultValue: OrbitDbTypes.EVENTS
    }),
    createProcessOption({
        name: "options",
        description: "The options for the database",
        required: false
    })
]

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

    /**
     * Constructs a new instance of the _OpenDbOptions class.
     */
    constructor({
        id,
        orbitDb,
        databaseName,
        databaseType,
        options,
    }: {
        id: PodProcessId,
        orbitDb: OrbitDbProcess,
        databaseName: string,
        databaseType?: OrbitDbTypes | string,
        options?: Map<string, string>
    }) {
        this.id = id;
        this.orbitDb = orbitDb;
        this.databaseName = databaseName;
        this.databaseType = databaseType ? isOrbitDbType(databaseType) : OrbitDbTypes.EVENTS;
        this.dbOptions = options ? options : new Map<string, string>();
    }
}


export {
    OrbitDbTypes,
    isOrbitDbType,
    OpenDbOptions
}

