
import { PodProcessId } from '../id-reference-factory/IdReferenceClasses.js';
import { Process } from '../process-interface/process.js';
import { IProcessOption, ProcessOptions, ProcessOptionsParams, createProcessOption, injectDefaultValues, mapProcessOptions } from '../process-interface/processOptions.js';
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

const openDbOptions = (): Array<IProcessOption> => [
    createProcessOption({
        name: "orbitDb",
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
class OpenDbOptions
    extends ProcessOptions 
{
    public orbitDb: OrbitDbProcess;
    public databaseName: string;
    public databaseType: OrbitDbTypes;
    public dbOptions?: Map<string, any>;

    /**
     * Constructs a new instance of the _OpenDbOptions class.
     */
    constructor(processOptionParams: ProcessOptionsParams) {
        const injectedDefaultValues = injectDefaultValues({options: openDbOptions(), values: processOptionParams})

        let {
            orbitDb,
            databaseName,
            databaseType,
            options,
        } = mapProcessOptions(injectedDefaultValues);    

        if (orbitDb === undefined) {
            throw new Error(`No OrbitDb process found`)
        }

        console.log(`OpenDbOptions Class: ${databaseName}`)

        // this.orbitDb = orbitDb;
        // this.databaseName = databaseName ? databaseName : orbitDb.id.name;
        // this.databaseType = databaseType ? isOrbitDbType(databaseType) : OrbitDbTypes.EVENTS;
        // this.dbOptions = options ? options : new Map<string, any>();

        orbitDb = orbitDb;
        databaseName = databaseName !== undefined ? databaseName : orbitDb.id.name;
        databaseType = databaseType ? isOrbitDbType(databaseType) : OrbitDbTypes.EVENTS;
        const dbOptions = options ? options : new Map<string, any>();

        console.log(`databaseName: ${databaseName}`)

        super(new Map<string, any>([
            ["orbitDb", orbitDb],
            ["databaseName", databaseName],
            ["databaseType", databaseType],
            ["options", dbOptions]
        ]))

        // super({})

        this.orbitDb = orbitDb;
        this.databaseName = databaseName
        this.databaseType = databaseType
        this.dbOptions = options
    }
}


export {
    OrbitDbTypes,
    isOrbitDbType,
    OpenDbOptions,
    openDbOptions,
}

