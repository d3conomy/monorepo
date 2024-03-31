import { IdReferenceFactory, PodBayId, PodId, PodProcessId, ProcessStage, ProcessType } from "d3-artifacts";
import { Libp2pProcess, Libp2pProcessOptions } from "../libp2p-process/index.js";
import { IpfsOptions, IpfsProcess } from "../ipfs-process/index.js";
import { OrbitDbOptions, OrbitDbProcess } from "../orbitdb-process/index.js";
import { OpenDbProcess } from "../open-db-process/index.js";
/**
 * Represents a LunarPod, which is a container for managing various processes and databases.
 * @category Pod
*/
declare class LunarPod {
    id: PodId;
    libp2p?: Libp2pProcess;
    ipfs?: IpfsProcess;
    orbitDb?: OrbitDbProcess;
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
    init(processType?: string | ProcessType): Promise<void>;
    /**
     * Start the Libp2p process in the pod.
     */
    initLibp2p({ libp2pOptions }?: {
        libp2pOptions?: Libp2pProcessOptions;
    }): Promise<void>;
    /**
     * Start the IPFS process in the pod.
     */
    initIpfs({ ipfsOptions }?: {
        ipfsOptions?: IpfsOptions;
    }): Promise<void>;
    /**
     * Start the OrbitDb process in the pod.
     */
    initOrbitDb({ orbitDbOptions }?: {
        orbitDbOptions?: OrbitDbOptions;
    }): Promise<void>;
    /**
     * Start the OrbitDb process in the pod.
     */
    initOpenDb({ databaseName, databaseType, options }?: {
        databaseName?: string;
        databaseType?: string;
        options?: Map<string, string>;
    }): Promise<OpenDbProcess | undefined>;
    /**
     * Get the OrbitDb process in the pod.
     */
    getOpenDb(orbitDbName: string | PodProcessId): OpenDbProcess;
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