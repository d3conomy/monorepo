import { IdReferenceFactory, PodBayId, PodId, PodProcessId, ProcessStage, ProcessType } from "d3-artifacts";
import { Libp2pProcess, Libp2pProcessOptions } from "../libp2p-process/index.js";
import { IpfsFileSystem, IpfsFileSystemType, IpfsOptions, IpfsProcess } from "../ipfs-process/index.js";
import { OrbitDbOptions, OrbitDbProcess } from "../orbitdb-process/index.js";
import { OpenDbOptions, OpenDbProcess } from "../open-db-process/index.js";
import { GossipSubProcess } from "../libp2p-process/pubsub.js";
/**
 * Represents a LunarPod, which is a container for managing various processes and databases.
 * @category Pod
*/
declare class LunarPod {
    id: PodId;
    libp2p?: Libp2pProcess;
    ipfs?: IpfsProcess;
    orbitDb?: OrbitDbProcess;
    pubsub?: GossipSubProcess;
    fs: Map<PodProcessId, IpfsFileSystem>;
    db: Map<PodProcessId, OpenDbProcess>;
    private idReferenceFactory;
    private processIds;
    /**
     * Construct a new Lunar Pod that is ready for initialization.
     */
    constructor({ id, libp2p, ipfs, orbitDb, idReferenceFactory, podBayId, processIds }: {
        id?: PodId;
        libp2p?: Libp2pProcess;
        ipfs?: IpfsProcess;
        orbitDb?: OrbitDbProcess;
        idReferenceFactory: IdReferenceFactory;
        podBayId?: PodBayId;
        processIds?: Map<ProcessType, PodProcessId>;
    });
    /**
     * Get the processes and their statuses for this pod.
     */
    getProcesses(): Array<{
        id: PodProcessId;
        status: ProcessStage;
    }>;
    /**
     * Initialize all processes and databases in the pod.
     */
    private initAll;
    /**
     * Initialize a specific process or all processes in the pod.
     */
    init(processType?: string | ProcessType, options?: {
        databaseName?: string;
        databaseType?: string;
        libp2pOptions?: Libp2pProcessOptions;
        ipfsOptions?: IpfsOptions;
        orbitDbOptions?: OrbitDbOptions;
        openDbOptions?: OpenDbOptions;
        pubsubTopic?: string;
    }): Promise<void>;
    /**
     * Start the Libp2p process in the pod.
     */
    initLibp2p({ libp2pOptions }?: {
        libp2pOptions?: Libp2pProcessOptions;
    }): Promise<PodProcessId>;
    /**
     * Start the IPFS process in the pod.
     */
    initIpfs({ ipfsOptions, libp2pOptions }?: {
        ipfsOptions?: IpfsOptions;
        libp2pOptions?: Libp2pProcessOptions;
    }): Promise<void>;
    /**
     * Start the OrbitDb process in the pod.
     */
    initOrbitDb({ orbitDbOptions, ipfsOptions, libp2pOptions }?: {
        orbitDbOptions?: OrbitDbOptions;
        ipfsOptions?: IpfsOptions;
        libp2pOptions?: Libp2pProcessOptions;
    }): Promise<void>;
    /**
     * Start the OrbitDb process in the pod.
     */
    initOpenDb({ databaseName, databaseType, dbOptions, libp2pOptions, ipfsOptions, orbitDbOptions, }?: {
        databaseName?: string;
        databaseType?: string;
        dbOptions?: Map<string, string>;
        libp2pOptions?: Libp2pProcessOptions;
        ipfsOptions?: IpfsOptions;
        orbitDbOptions?: OrbitDbOptions;
    }): Promise<PodProcessId | void>;
    initPubSub(topic?: string): Promise<void>;
    initFileSystem({ type, processId, name }?: {
        type?: IpfsFileSystemType;
        processId?: PodProcessId;
        name?: string;
    }): Promise<PodProcessId>;
    /**
     * Get the OrbitDb process in the pod.
     */
    getOpenDb(orbitDbName: string | PodProcessId): OpenDbProcess | undefined;
    /**
     * Get all Open Databases in the pod.
     */
    getAllOpenDbs(): Map<PodProcessId, OpenDbProcess>;
    /**
     * Get the names of all Open Databases in the pod.
     */
    getDbNames(): Array<string>;
    /**
     * Start a process or all processes in the pod.
     */
    start(processType?: string): Promise<void>;
    /**
     * Stop a specific open database in the pod.
     */
    stopOpenDb(orbitDbName: string): Promise<void>;
    /**
     * Stop specific processTypes or all processTypes in the pod.
     */
    stop(processType?: string): Promise<void>;
    /**
     * Restart specific processTypes or all processTypes in the pod.
     */
    restart(processType?: string): Promise<void>;
    /**
     * Get the status of all processes and databases in the pod.
     */
    status(): {
        libp2p?: ProcessStage;
        ipfs?: ProcessStage;
        orbitdb?: ProcessStage;
        db?: Array<ProcessStage>;
    };
}
export { LunarPod };
//# sourceMappingURL=index.d.ts.map