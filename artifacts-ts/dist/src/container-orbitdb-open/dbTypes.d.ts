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
export { OrbitDbTypes, isOrbitDbType };
//# sourceMappingURL=dbTypes.d.ts.map