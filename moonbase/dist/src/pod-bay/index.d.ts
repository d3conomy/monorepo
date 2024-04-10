import { Multiaddr } from "@multiformats/multiaddr";
import { LunarPod } from "../lunar-pod/index.js";
import { IdReferenceFactory, PodBayId, PodId, PodProcessId, ProcessStage, ProcessType } from "d3-artifacts";
import { OpenDbOptions, OrbitDbTypes } from "../open-db-process/OpenDbOptions.js";
import { OpenDbProcess } from "../open-db-process/index.js";
import { IpfsFileSystem, IpfsFileSystemType } from "../ipfs-process/IpfsFileSystem.js";
import { Libp2pProcessOptions } from "../libp2p-process/processOptions.js";
import { IpfsOptions } from "../ipfs-process/IpfsOptions.js";
import { OrbitDbOptions } from "../orbitdb-process/OrbitDbOptions.js";
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
    newPod({ id, podName, processType, options }?: {
        id?: PodId;
        podName?: string;
        processType?: ProcessType;
        options?: {
            databaseName?: string;
            databaseType?: string;
            libp2pOptions?: Libp2pProcessOptions;
            ipfsOptions?: IpfsOptions;
            orbitDbOptions?: OrbitDbOptions;
            openDbOptions?: OpenDbOptions;
            pubsubTopic?: string;
        };
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
    openDb({ podId, orbitDbId, dbName, dbType, options }: {
        podId?: PodId;
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
    getOpenDb(dbName: PodProcessId | string): Promise<OpenDbProcess | undefined>;
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
    /**
     * Get the list of open filesystems in the PodBay.
     */
    getOpenFs(): Array<string>;
    /**
     * Get the filesystem with the specified name or ID.
     */
    getFs(fsName: PodProcessId | string): IpfsFileSystem;
    /**
     * Create a new filesystem in the PodBay.
     */
    createFs({ podId, filesystemName, filesystemType }?: {
        podId?: PodId | string;
        filesystemName?: string;
        filesystemType?: string | IpfsFileSystemType;
    }): Promise<PodProcessId>;
}
export { PodBay };
//# sourceMappingURL=index.d.ts.map