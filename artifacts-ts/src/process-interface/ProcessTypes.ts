import { IdReferenceFactory, IdReferenceTypes, MetaData, PodId, PodProcessId } from "../id-reference-factory/index.js"

enum ProcessType {
    LIBP2P = 'libp2p',
    IPFS = 'ipfs',
    ORBITDB = 'orbitdb',
    OPEN_DB = 'open-db',
    PUB_SUB = 'pub-sub',
    FILE_SYSTEM = 'file-system',
}

const isProcessType = (value: any): ProcessType => {
    if (Object.values(ProcessType).includes(value)) {
        return value as ProcessType;
    }
    throw new Error('Invalid process type');
}


/**
 * Create process ids for a pod
 * @param podId The pod id
 * @param idReferenceFactory The id reference factory
 * @returns A map of process ids
 * @category Process
 */
const createProcessIds = ({
    podId,
    idReferenceFactory,
    processIds = new Map<ProcessType, PodProcessId>()
}: {
    podId: PodId,
    idReferenceFactory: IdReferenceFactory,
    processIds?: Map<ProcessType, PodProcessId>
}): Map<ProcessType, PodProcessId> => {
    processIds = new Map<ProcessType, PodProcessId>();
    Object.values(ProcessType).forEach((type) => {
        if (!processIds.has(type)) {
            const metadata = new MetaData({
                mapped: new Map<string, any>([
                    ['processType', type]
                ]),
                createdBy: podId.name
            });

            processIds.set(
                type, 
                idReferenceFactory.createIdReference({
                    name: `${podId.name}-${type}`,
                    type: IdReferenceTypes.PROCESS,
                    dependsOn: podId,
                    metadata
                })
            );
        }
    });
    return processIds;
}



export {
    createProcessIds,
    isProcessType,
    ProcessType,
}
