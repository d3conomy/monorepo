/**
 * The Types of OrbitDb databases.
 * @category Database
 */
var OrbitDbTypes;
(function (OrbitDbTypes) {
    OrbitDbTypes["EVENTS"] = "events";
    OrbitDbTypes["DOCUMENTS"] = "documents";
    OrbitDbTypes["KEYVALUE"] = "keyvalue";
    OrbitDbTypes["KEYVALUEINDEXED"] = "keyvalueindexed";
})(OrbitDbTypes || (OrbitDbTypes = {}));
const isOrbitDbType = (value) => {
    if (Object.values(OrbitDbTypes).includes(value)) {
        return value;
    }
    throw new Error('Invalid OrbitDb type');
};
/**
 * The options for opening a database.
 * @category Database
 */
class OpenDbOptions {
    id;
    orbitDb;
    databaseName;
    databaseType;
    dbOptions;
    processOptions;
    /**
     * Constructs a new instance of the _OpenDbOptions class.
     */
    constructor({ id, orbitDb, databaseName, databaseType, dbOptions, options }) {
        this.id = id;
        this.orbitDb = orbitDb;
        this.databaseName = databaseName;
        this.databaseType = databaseType ? isOrbitDbType(databaseType) : OrbitDbTypes.EVENTS;
        this.dbOptions = dbOptions ? dbOptions : new Map();
        this.processOptions = options ? options : undefined;
    }
}
export { OrbitDbTypes, isOrbitDbType, OpenDbOptions };
