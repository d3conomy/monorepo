import { IdReferenceTypes, MetaData } from "../id-reference-factory/index.js";
var ProcessType;
(function (ProcessType) {
    ProcessType["LIBP2P"] = "libp2p";
    ProcessType["IPFS"] = "ipfs";
    ProcessType["ORBITDB"] = "orbitdb";
    ProcessType["OPEN_DB"] = "open-db";
    ProcessType["PUB_SUB"] = "pub-sub";
    ProcessType["FILE_SYSTEM"] = "file-system";
    ProcessType["CUSTOM"] = "custom";
})(ProcessType || (ProcessType = {}));
const isProcessType = (value) => {
    if (Object.values(ProcessType).includes(value)) {
        return value;
    }
    throw new Error('Invalid process type');
};
/**
 * Create process ids for a pod
 * @param podId The pod id
 * @param idReferenceFactory The id reference factory
 * @returns A map of process ids
 * @category Process
 */
const createProcessIds = ({ podId, idReferenceFactory, processIds = new Map() }) => {
    processIds = new Map();
    Object.values(ProcessType).forEach((type) => {
        if (!processIds.has(type)) {
            const metadata = new MetaData({
                mapped: new Map([
                    ['processType', type]
                ]),
                createdBy: podId.name
            });
            processIds.set(type, idReferenceFactory.createIdReference({
                name: `${podId.name}-${type}`,
                type: IdReferenceTypes.PROCESS,
                dependsOn: podId,
                metadata
            }));
        }
    });
    return processIds;
};
export { createProcessIds, isProcessType, ProcessType, };
