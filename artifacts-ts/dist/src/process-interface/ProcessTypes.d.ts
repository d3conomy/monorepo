import { IdReferenceFactory, PodId, PodProcessId } from "../id-reference-factory/index.js";
declare enum ProcessType {
    LIBP2P = "libp2p",
    IPFS = "ipfs",
    ORBITDB = "orbitdb",
    OPEN_DB = "open-db",
    PUB_SUB = "pub-sub",
    FILE_SYSTEM = "file-system"
}
declare const isProcessType: (value: any) => ProcessType;
/**
 * Create process ids for a pod
 * @param podId The pod id
 * @param idReferenceFactory The id reference factory
 * @returns A map of process ids
 * @category Process
 */
declare const createProcessIds: ({ podId, idReferenceFactory, processIds }: {
    podId: PodId;
    idReferenceFactory: IdReferenceFactory;
    processIds?: Map<ProcessType, PodProcessId> | undefined;
}) => Map<ProcessType, PodProcessId>;
export { createProcessIds, isProcessType, ProcessType, };
//# sourceMappingURL=processTypes.d.ts.map