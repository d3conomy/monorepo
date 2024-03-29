import { OrbitDbProcess } from '../orbitdb-process';
/**
 * The Types of OrbitDb databases.
 * @category Database
 */
declare enum OrbitDbTypes {
    EVENTS = "events",
    DOCUMENTS = "documents",
    KEYVALUE = "keyvalue",
    KEYVALUEINDEXED = "keyvalueindexed"
}
declare const isOrbitDbType: (value: string) => OrbitDbTypes;
/**
 * The options for opening a database.
 * @category Database
 */
declare class OpenDbOptions {
    orbitDb: OrbitDbProcess;
    databaseName: string;
    databaseType: OrbitDbTypes;
    options?: Map<string, string>;
    /**
     * Constructs a new instance of the _OpenDbOptions class.
     */
    constructor({ orbitDb, databaseName, databaseType, options }: {
        orbitDb: OrbitDbProcess;
        databaseName: string;
        databaseType?: OrbitDbTypes | string;
        options?: Map<string, string>;
    });
}
export { OrbitDbTypes, isOrbitDbType, OpenDbOptions };
//# sourceMappingURL=OpenDbOptions.d.ts.map