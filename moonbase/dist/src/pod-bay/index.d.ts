import { Multiaddr } from "@multiformats/multiaddr";
import { LunarPod } from "../lunar-pod/index.js";
import { IdReferenceFactory, PodBayId, PodId, PodProcessId, ProcessStage, ProcessType } from "d3-artifacts";
import { OrbitDbTypes } from "../open-db-process/OpenDbOptions.js";
import { OpenDbProcess } from "../open-db-process/index.js";
/**
 * Represents a collection of LunarPods and provides methods for managing and interacting with them.
 * @category PodBay
*/
declare class PodBay {
    id: PodBayId;
    /**
     * The array of LunarPods in the PodBay.
     */
    pods: Array<LunarPod>;
    /**
     * The idReferenceFactory used to create new IdReferences.
     */
    idReferenceFactory: IdReferenceFactory;
    /**
     * Creates a new instance of the PodBay class.
     */
    constructor({ id, idReferenceFactory, pods }: {
        id?: PodBayId;
        idReferenceFactory: IdReferenceFactory;
        pods?: Array<LunarPod>;
    });
    /**
     * Returns an array of pod IDs in the PodBay.
     */
    podIds(): Array<PodId>;
    /**
     * Checks if a pod ID exists in the PodBay.
     */
    checkPodId(id?: PodId): boolean;
    /**
     * Creates a new pod in the PodBay.
     */
    newPod({ id, processType }?: {
        id?: PodId;
        processType?: ProcessType;
    }): Promise<PodId | undefined>;
    /**
     * Adds a pod to the PodBay.
     */
    addPod(pod: LunarPod): void;
    /**
     * Gets a pod from the PodBay.
     */
    getPod(id?: PodId | string): LunarPod | undefined;
    /**
     * Removes a pod from the PodBay.
     */
    removePod(id: PodId | string): Promise<void>;
    /**
     * Gets the status of a pod in the PodBay.
     */
    getStatus(id: PodId): {
        libp2p?: ProcessStage;
        orbitDb?: ProcessStage;
        ipfs?: ProcessStage;
        db?: Array<ProcessStage>;
    } | undefined;
    /**
     * Gets the names of all open databases in the PodBay.
     */
    getAllOpenDbNames(): Array<string>;
    private checkIfOpenDbExists;
    /**
     * Opens a database in the PodBay.
     */
    openDb({ orbitDbId, dbName, dbType, options }: {
        orbitDbId?: PodProcessId;
        dbName: string;
        dbType: OrbitDbTypes | string;
        dialAddress?: string;
        options?: Map<string, string>;
    }): Promise<{
        openDb: OpenDbProcess;
        address?: string;
        podId: PodId;
        multiaddrs?: Multiaddr[];
    } | undefined>;
    /**
     * Gets the open database with the specified name or ID.
     */
    getOpenDb(dbName: PodProcessId | string): OpenDbProcess | undefined;
    /**
     * Closes the open database with the specified name or ID.
     */
    closeDb(dbName: string | PodProcessId): Promise<PodProcessId | undefined>;
    /**
     * Gets the open pubsub topics in the PodBay.
     */
    getOpenTopics(): Array<string>;
    /**
     * Publishes a message to a topic in the PodBay.
     */
    subscribe({ topic, podId }: {
        topic: string;
        podId: PodId;
    }): Promise<void>;
    /**
     * Publishes a message to a topic in the PodBay.
     */
    publish({ topic, message, podId }: {
        topic: string;
        message: string;
        podId: PodId;
    }): Promise<any>;
}
export { PodBay };
//# sourceMappingURL=index.d.ts.map