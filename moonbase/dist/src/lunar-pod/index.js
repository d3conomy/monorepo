import { IdReferenceTypes, LogLevel, MetaData, PodProcessId, ProcessStage, ProcessType, isProcessType, logger } from "d3-artifacts";
import { Libp2pProcess } from "../libp2p-process/index.js";
import { IpfsFileSystem, IpfsOptions, IpfsProcess } from "../ipfs-process/index.js";
import { OrbitDbOptions, OrbitDbProcess } from "../orbitdb-process/index.js";
import { OpenDbOptions, OpenDbProcess, OrbitDbTypes } from "../open-db-process/index.js";
import { createProcessIds } from "d3-artifacts";
import { GossipSubProcess } from "../libp2p-process/pubsub.js";
/**
 * Represents a LunarPod, which is a container for managing various processes and databases.
 * @category Pod
*/
class LunarPod {
    id;
    libp2p;
    ipfs;
    orbitDb;
    pubsub;
    fs = new Map();
    db = new Map();
    idReferenceFactory;
    processIds = new Map();
    /**
     * Construct a new Lunar Pod that is ready for initialization.
     */
    constructor({ id, libp2p, ipfs, orbitDb, idReferenceFactory, podBayId, processIds }) {
        this.idReferenceFactory = idReferenceFactory;
        this.id = id ? id : this.idReferenceFactory.createIdReference({
            type: IdReferenceTypes.POD,
            dependsOn: podBayId
        });
        this.processIds = createProcessIds({
            podId: this.id,
            idReferenceFactory: this.idReferenceFactory,
            processIds
        });
        if (libp2p) {
            this.libp2p = libp2p;
        }
        if (ipfs) {
            this.ipfs = ipfs;
        }
        if (orbitDb) {
            this.orbitDb = orbitDb;
        }
    }
    /**
     * Get the processes and their statuses for this pod.
     */
    getProcesses() {
        const componentIds = [
            this.libp2p?.id,
            this.ipfs?.id,
            this.orbitDb?.id,
            ...Array.from(this.db.keys()).map(key => this.db.get(key)?.id)
        ].filter(id => id !== undefined);
        const componentStatuses = [
            this.libp2p?.status(),
            this.ipfs?.status(),
            this.orbitDb?.status(),
            ...Array.from(this.db.values()).map(db => db.status())
        ].filter(status => status !== undefined);
        return componentIds.map((id, index) => {
            return {
                id,
                status: componentStatuses[index]
            };
        });
    }
    /**
     * Initialize all processes and databases in the pod.
     */
    async initAll(options) {
        if (!this.libp2p) {
            await this.initLibp2p(options);
        }
        if (!this.ipfs) {
            await this.initIpfs(options);
        }
        if (!this.orbitDb) {
            await this.initOrbitDb(options);
        }
        // if (options?.openDbOptions) {
        //     await this.initOpenDb(options);
        // }
    }
    /**
     * Initialize a specific process or all processes in the pod.
     */
    async init(processType, options) {
        if (processType) {
            processType = isProcessType(processType);
        }
        switch (processType) {
            case ProcessType.LIBP2P:
                await this.initLibp2p(options);
                break;
            case ProcessType.PUBSUB:
                await this.initPubSub(options?.pubsubTopic);
                break;
            case ProcessType.IPFS:
                await this.initIpfs(options);
                break;
            case ProcessType.ORBITDB:
                await this.initOrbitDb(options);
                break;
            case ProcessType.DATABASE:
                await this.initOpenDb(options);
                break;
            // case ProcessType.FILE_SYSTEM:
            //     await this.initFileSystem();
            //     break;
            default:
                await this.initAll(options);
                break;
        }
    }
    /**
     * Start the Libp2p process in the pod.
     */
    async initLibp2p({ libp2pOptions } = {}) {
        let processId = this.processIds.get(ProcessType.LIBP2P);
        if (!processId) {
            processId = this.idReferenceFactory.createIdReference({
                name: `${this.id.name}-libp2p`,
                type: IdReferenceTypes.PROCESS,
                dependsOn: this.id
            });
        }
        if (!this.libp2p) {
            this.libp2p = new Libp2pProcess({
                id: processId,
                options: libp2pOptions
            });
        }
        await this.libp2p.init();
        return processId;
    }
    /**
     * Start the IPFS process in the pod.
     */
    async initIpfs({ ipfsOptions, libp2pOptions } = {}) {
        if (!this.libp2p) {
            await this.initLibp2p({ libp2pOptions: libp2pOptions });
        }
        if (!this.ipfs) {
            ipfsOptions = new IpfsOptions({
                libp2p: this.libp2p,
                datastore: ipfsOptions?.datastore,
                blockstore: ipfsOptions?.blockstore,
                start: ipfsOptions?.start
            });
            this.ipfs = new IpfsProcess({
                id: this.processIds.get(ProcessType.IPFS) ||
                    this.idReferenceFactory.createIdReference({
                        name: `${this.id.name}-ipfs`,
                        type: IdReferenceTypes.PROCESS,
                        dependsOn: this.id
                    }),
                options: ipfsOptions
            });
        }
        await this.ipfs.init();
    }
    /**
     * Start the OrbitDb process in the pod.
     */
    async initOrbitDb({ orbitDbOptions, ipfsOptions, libp2pOptions } = {}) {
        if (!this.ipfs) {
            await this.initIpfs({
                ipfsOptions: ipfsOptions,
                libp2pOptions: libp2pOptions
            });
        }
        if (this.libp2p?.status() !== 'started') {
            await this.libp2p?.start();
        }
        if (!this.orbitDb) {
            orbitDbOptions = new OrbitDbOptions({
                ipfs: this.ipfs,
                directory: orbitDbOptions?.directory,
                enableDID: orbitDbOptions?.enableDID,
                identityProvider: orbitDbOptions?.identityProvider,
                identitySeed: orbitDbOptions?.identitySeed
            });
            this.orbitDb = new OrbitDbProcess({
                id: this.processIds.get(ProcessType.ORBITDB) ||
                    this.idReferenceFactory.createIdReference({
                        name: `${this.id.name}-orbitdb`,
                        type: IdReferenceTypes.PROCESS,
                        dependsOn: this.id
                    }),
                options: orbitDbOptions
            });
        }
        await this.orbitDb.init();
    }
    /**
     * Start the OrbitDb process in the pod.
     */
    async initOpenDb({ databaseName, databaseType, dbOptions, libp2pOptions, ipfsOptions, orbitDbOptions, } = {}) {
        if (!this.orbitDb) {
            await this.initOrbitDb({
                orbitDbOptions: orbitDbOptions,
                ipfsOptions: ipfsOptions,
                libp2pOptions: libp2pOptions
            });
        }
        if (!databaseName) {
            databaseName = `${this.id.name}-db`;
        }
        if (!databaseType) {
            databaseType = OrbitDbTypes.EVENTS;
        }
        if (this.getDbNames().includes(databaseName)) {
            return this.getOpenDb(databaseName)?.id;
        }
        const databaseId = this.idReferenceFactory.createIdReference({
            name: databaseName,
            type: IdReferenceTypes.PROCESS,
            dependsOn: this.id,
            metadata: new MetaData({
                mapped: new Map([
                    ["databaseName", databaseName],
                    ["databaseType", databaseType],
                    ["createdBy", this.id.name]
                ]),
            })
        });
        if (this.orbitDb) {
            const openDbOptions = new OpenDbOptions({
                id: databaseId,
                orbitDb: this.orbitDb,
                databaseName,
                databaseType,
                options: dbOptions
            });
            // }
            //     logger({
            //         level: LogLevel.INFO,
            //         podId: this.id,
            //         stage: ProcessStage.INITIALIZING,
            //         message: `Opening database ${openDbOptions?.databaseName} on OrbitDb ${this.orbitDb.id.name} in LunarPod ${this.id.name}`
            //     })
            const db = new OpenDbProcess({
                id: databaseId,
                options: openDbOptions
            });
            try {
                await db.init();
                this.db.set(databaseId, db);
                logger({
                    level: LogLevel.INFO,
                    podId: this.id,
                    stage: ProcessStage.INITIALIZED,
                    message: `Database ${openDbOptions?.databaseName} opened on OrbitDb ${this.orbitDb.id.name} in LunarPod ${this.id.name}`
                });
                return databaseId;
            }
            catch (error) {
                logger({
                    level: LogLevel.ERROR,
                    message: `Error opening database: ${error}`
                });
                await this.stop();
                throw error;
            }
        }
        // throw new Error('OrbitDb process not initialized');
    }
    async initPubSub(topic) {
        if (this.libp2p && !this.pubsub) {
            const processId = this.processIds.get(ProcessType.PUBSUB) ||
                this.idReferenceFactory.createIdReference({
                    name: `${this.id.name}-pubsub`,
                    type: IdReferenceTypes.PROCESS,
                    dependsOn: this.id
                });
            this.pubsub = new GossipSubProcess({
                id: processId,
                topic: topic ? topic : 'moonbase-pubsub',
                libp2pProcess: this.libp2p
            });
            await this.pubsub.init();
        }
    }
    async initFileSystem({ type, processId, name } = {}) {
        if (this.ipfs) {
            processId = processId ? processId :
                this.idReferenceFactory.createIdReference({
                    name: name ? name : `${this.id.name}-fs`,
                    type: IdReferenceTypes.PROCESS,
                    dependsOn: this.id
                });
            const fs = new IpfsFileSystem({
                id: processId,
                ipfs: this.ipfs,
                filesystemType: type
            });
            await fs.init();
            this.fs.set(processId, fs);
            return processId;
        }
        else {
            throw new Error('IPFS process not initialized');
        }
    }
    /**
     * Get the OrbitDb process in the pod.
     */
    getOpenDb(orbitDbName) {
        for (const [key, value] of this.db) {
            if (orbitDbName instanceof PodProcessId) {
                if (key === orbitDbName) {
                    return value;
                }
            }
            else {
                if (key.name === orbitDbName) {
                    return value;
                }
            }
        }
        // throw new Error(`Database ${orbitDbName} not found in LunarPod ${this.id.name}`);
    }
    /**
     * Get all Open Databases in the pod.
     */
    getAllOpenDbs() {
        return this.db;
    }
    /**
     * Get the names of all Open Databases in the pod.
     */
    getDbNames() {
        return Array.from(this.db.keys()).map(key => key.name);
    }
    /**
     * Start a process or all processes in the pod.
     */
    async start(processType = 'all') {
        if ((this.libp2p && processType === 'all') ||
            (this.libp2p && processType === 'libp2p')) {
            await this.libp2p.start();
        }
        if ((this.ipfs && processType === 'all') ||
            (this.ipfs && processType === 'ipfs')) {
            await this.ipfs.start();
        }
        if ((this.orbitDb && processType === 'all') ||
            (this.orbitDb && processType === 'orbitdb')) {
            await this.orbitDb.start();
        }
    }
    /**
     * Stop a specific open database in the pod.
     */
    async stopOpenDb(orbitDbName) {
        const db = this.getOpenDb(orbitDbName);
        if (db) {
            await db.stop();
            this.idReferenceFactory.deleteIdReference(db.id.name);
        }
    }
    /**
     * Stop specific processTypes or all processTypes in the pod.
     */
    async stop(processType = 'all') {
        if ((this.db && processType === 'all') ||
            (this.db && processType === 'db')) {
            this.db.forEach(async (db) => {
                await db.stop();
            });
        }
        if ((this.orbitDb && processType === 'all') ||
            (this.orbitDb && processType === 'orbitdb')) {
            await this.orbitDb.stop();
        }
        if ((this.ipfs && processType === 'all') ||
            (this.ipfs && processType === 'ipfs')) {
            await this.ipfs.stop();
        }
        if ((this.libp2p && processType === 'all') ||
            (this.libp2p && processType === 'libp2p')) {
            await this.libp2p.stop();
        }
    }
    /**
     * Restart specific processTypes or all processTypes in the pod.
     */
    async restart(processType = 'all') {
        return this.stop(processType).then(async () => await this.start(processType));
    }
    /**
     * Get the status of all processes and databases in the pod.
     */
    status() {
        return {
            libp2p: this.libp2p?.status(),
            ipfs: this.ipfs?.status(),
            orbitdb: this.orbitDb?.status(),
            db: Array.from(this.db.values()).map(db => db.status())
        };
    }
}
export { LunarPod };
