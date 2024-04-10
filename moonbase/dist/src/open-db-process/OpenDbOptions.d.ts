import { PodProcessId } from 'd3-artifacts';
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
    id: PodProcessId;
    orbitDb: OrbitDbProcess;
    databaseName: string;
    databaseType: OrbitDbTypes;
    dbOptions?: Map<string, string>;
    /**
     * Constructs a new instance of the _OpenDbOptions class.
     */
    constructor({ id, orbitDb, databaseName, databaseType, options, }: {
        id: PodProcessId;
        orbitDb: OrbitDbProcess;
        databaseName: string;
        databaseType?: OrbitDbTypes | string;
        options?: Map<string, string>;
    });
}
export { OrbitDbTypes, isOrbitDbType, OpenDbOptions };
//# sourceMappingURL=OpenDbOptions.d.ts.map