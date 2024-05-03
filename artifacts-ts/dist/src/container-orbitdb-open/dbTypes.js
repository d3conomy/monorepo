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
export { OrbitDbTypes, isOrbitDbType };
