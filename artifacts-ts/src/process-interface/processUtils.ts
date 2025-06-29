import { IdReferenceFactory, PodId, PodProcessId } from "../id-reference-factory/index.js";
import { ProcessType } from "./ProcessType.js";

/**
 * Creates a map of process IDs for a given pod
 * @param podId - The pod ID to create process IDs for
 * @param idReferenceFactory - The factory to create ID references
 * @param processIds - Existing process IDs to merge with (optional)
 * @returns A map of ProcessType to PodProcessId
 * @category Process
 */
const createProcessIds = ({
    podId,
    idReferenceFactory,
    processIds
}: {
    podId: PodId;
    idReferenceFactory: IdReferenceFactory;
    processIds?: Map<ProcessType, PodProcessId>;
}): Map<ProcessType, PodProcessId> => {
    const processIdMap = processIds || new Map<ProcessType, PodProcessId>();

    // Create process IDs for each standard process type if they don't exist
    Object.values(ProcessType).forEach(processType => {
        if (!processIdMap.has(processType)) {
            const processId = idReferenceFactory.createIdReference({
                type: 'process' as any,
                dependsOn: podId,
                name: `${podId.name}-${processType}`
            }) as PodProcessId;
            
            processIdMap.set(processType, processId);
        }
    });

    return processIdMap;
};

export {
    createProcessIds
};
