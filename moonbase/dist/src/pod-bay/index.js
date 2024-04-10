import { LunarPod } from "../lunar-pod/index.js";
import { IdReferenceTypes, LogLevel, MetaData, PodId, PodProcessId, ProcessType, logger } from "d3-artifacts";
import { isIpfsFileSystemType } from "../ipfs-process/IpfsFileSystem.js";
import { loadConfig } from "../moonbase-system/MoonbaseConfig.js";
/**
 * Represents a collection of LunarPods and provides methods for managing and interacting with them.
 * @category PodBay
*/
class PodBay {
    id;
    /**
     * The array of LunarPods in the PodBay.
     */
    pods;
    /**
     * The idReferenceFactory used to create new IdReferences.
     */
    idReferenceFactory;
    /**
     * Creates a new instance of the PodBay class.
     */
    constructor({ id, idReferenceFactory, pods }) {
        this.idReferenceFactory = idReferenceFactory;
        this.id = id ? id : this.idReferenceFactory.createIdReference({
            type: IdReferenceTypes.POD_BAY,
            dependsOn: this.idReferenceFactory.getIdReferencesByType(IdReferenceTypes.SYSTEM)[0]
        });
        this.pods = pods ? pods : new Array();
    }
    /**
     * Returns an array of pod IDs in the PodBay.
     */
    podIds() {
        return this.pods.map(pod => pod.id);
    }
    /**
     * Checks if a pod ID exists in the PodBay.
     */
    checkPodId(id) {
        if (!id) {
            throw new Error('IdReference is undefined');
        }
        return this.podIds().includes(id);
    }
    /**
     * Creates a new pod in the PodBay.
     */
    async newPod({ id, podName, processType, options } = {}) {
        if (!id) {
            id = this.idReferenceFactory.createIdReference({
                name: podName ? podName : `pod-${this.pods.length + 1}`,
                type: IdReferenceTypes.POD,
                metadata: new MetaData({
                    mapped: new Map([
                        ["processType", processType],
                        ["createdBy", this.id.name]
                    ])
                }),
                dependsOn: this.id
            });
        }
        if (id && !this.checkPodId(id)) {
            let pod = new LunarPod({ id, idReferenceFactory: this.idReferenceFactory });
            if (processType) {
                await pod.init(processType, options);
            }
            this.addPod(pod);
            return pod.id;
        }
        else {
            logger({
                level: LogLevel.ERROR,
                message: `Pod with id ${id?.name} already exists`
            });
        }
    }
    /**
     * Adds a pod to the PodBay.
     */
    addPod(pod) {
        if (!this.checkPodId(pod.id)) {
            this.pods.push(pod);
        }
        else {
            throw new Error(`Pod with id ${pod.id.name} already exists`);
        }
    }
    /**
     * Gets a pod from the PodBay.
     */
    getPod(id) {
        if (!id) {
            logger({
                level: LogLevel.ERROR,
                message: `IdReference is undefined`
            });
        }
        else {
            let podId;
            if (typeof id === "string") {
                podId = this.idReferenceFactory.getIdReference(id);
            }
            else if (id instanceof PodId) {
                podId = id;
            }
            else {
                logger({
                    level: LogLevel.ERROR,
                    message: `IdReference is not of type PodId`
                });
            }
            const pod = this.pods.find(pod => pod.id.name === podId.name);
            if (pod) {
                return pod;
            }
            else {
                logger({
                    level: LogLevel.ERROR,
                    message: `Pod with id ${id} not found`
                });
            }
        }
    }
    /**
     * Removes a pod from the PodBay.
     */
    async removePod(id) {
        const pod = this.getPod(id);
        if (pod) {
            if (pod.db.size > 0) {
                pod.db.forEach(async (db, key) => {
                    await pod.stopOpenDb(key.name);
                });
            }
            await pod.stop();
            const index = this.pods.indexOf(pod);
            const deletetdId = this.pods.splice(index, 1);
            this.idReferenceFactory.deleteIdReference(deletetdId[0].id.name);
            logger({
                level: LogLevel.INFO,
                message: `Pod with id ${deletetdId[0].id.name} removed`
            });
        }
        else {
            logger({
                level: LogLevel.ERROR,
                message: `Pod with id ${id} not found`
            });
        }
    }
    /**
     * Gets the status of a pod in the PodBay.
     */
    getStatus(id) {
        const pod = this.getPod(id);
        if (pod) {
            return pod.status();
        }
    }
    /**
     * Gets the names of all open databases in the PodBay.
     */
    getAllOpenDbNames() {
        const dbNames = [];
        this.pods.forEach(pod => {
            pod.db.forEach(db => {
                dbNames.push(db.id.name);
            });
        });
        return dbNames;
    }
    async checkIfOpenDbExists(dbName) {
        const dbExists = this.getAllOpenDbNames().includes(dbName);
        if (!dbExists) {
            return false;
        }
        logger({
            level: LogLevel.WARN,
            message: `Database ${dbName} already opened`
        });
        const openDb = await this.getOpenDb(dbName);
        if (!openDb) {
            logger({
                level: LogLevel.ERROR,
                message: `Database ${dbName} not found`
            });
            return false;
        }
        // get the pod that has the openDb
        const orbitDbPod = this.pods.find(pod => {
            if (openDb && pod.db.has(openDb.id)) {
                return pod;
            }
        });
        return {
            openDb,
            address: openDb.address(),
            podId: openDb.id.podId,
            multiaddrs: orbitDbPod?.libp2p?.getMultiaddrs()
        };
    }
    /**
     * Opens a database in the PodBay.
     */
    async openDb({ podId, orbitDbId, dbName, dbType, options }) {
        //get a pod with an orbitDbProcess
        let orbitDbPod;
        let openDbOptions;
        let openDb;
        if (await this.checkIfOpenDbExists(dbName)) {
            logger({
                level: LogLevel.WARN,
                message: `Database ${dbName} already opened`
            });
            const db = await this.getOpenDb(dbName);
            if (!db) {
                logger({
                    level: LogLevel.ERROR,
                    message: `Database ${dbName} not found`
                });
                return;
            }
            return {
                openDb: db,
                address: db.address(),
                podId: db.id.podId,
                multiaddrs: this.getPod(db.id.podId)?.libp2p?.getMultiaddrs()
            };
        }
        // if (!orbitDbId && !podId) {
        //     orbitDbPod = this.pods.find(pod => pod.orbitDb && pod.db.size >= 0);
        //     if (!orbitDbPod) {
        //         const podId = await this.newPod({
        //             id: this.idReferenceFactory.createIdReference({
        //                 type: IdReferenceTypes.POD,
        //                 metadata: new MetaData({
        //                     mapped: new Map<string, any>([
        //                         ["processType", ProcessType.ORBITDB],
        //                         ["createdBy", this.id.name]
        //                     ])
        //                 }),
        //                 dependsOn: this.id
        //             }),
        //             processType: ProcessType.ORBITDB
        //         });
        //         orbitDbPod = this.getPod(podId);
        //     }
        // }
        if (orbitDbId || podId) {
            orbitDbPod = this.getPod(podId);
            if (!orbitDbPod) {
                // if (orbitDbPod.id.name !== orbitDbId.podId.name) {
                orbitDbPod = this.getPod(orbitDbId?.podId);
                // }
            }
            if (!orbitDbPod) {
                orbitDbPod = this.pods.find(pod => pod.orbitDb && pod.db.size >= 0);
            }
        }
        if (!orbitDbPod ||
            !orbitDbPod.orbitDb) {
            const podId = await this.newPod({
                id: this.idReferenceFactory.createIdReference({
                    type: IdReferenceTypes.POD,
                    metadata: new MetaData({
                        mapped: new Map([
                            ["processType", ProcessType.OPEN_DB],
                            ["createdBy", this.id.name]
                        ])
                    }),
                    dependsOn: this.id
                }),
                processType: ProcessType.OPEN_DB
            });
            orbitDbPod = this.getPod(podId);
            logger({
                level: LogLevel.INFO,
                message: `New pod ${podId?.name} created for orbitDb`
            });
        }
        if (orbitDbPod && orbitDbPod.orbitDb) {
            openDbOptions = {
                databaseName: dbName,
                databaseType: dbType,
                dbOptions: options ? options : new Map(),
                options: options
            };
            try {
                openDb = await orbitDbPod.initOpenDb(openDbOptions);
            }
            catch (error) {
                logger({
                    level: LogLevel.ERROR,
                    message: `Error opening database: ${error}`
                });
                // await this.closeDb(openDbOptions.databaseName);
                await this.removePod(orbitDbPod.id);
                return;
            }
            if (openDb) {
                return {
                    openDb,
                    address: openDb.address(),
                    podId: orbitDbPod.id,
                    multiaddrs: orbitDbPod.libp2p?.getMultiaddrs()
                };
            }
        }
    }
    /**
     * Gets the open database with the specified name or ID.
     */
    async getOpenDb(dbName) {
        let podId;
        let processId;
        if (dbName instanceof PodProcessId) {
            processId = dbName;
            podId = processId.podId;
        }
        else {
            if (dbName.startsWith('zdpu')) {
                dbName = `/orbitdb/${dbName}`;
            }
            if (dbName === 'system-auth') {
                const config = await loadConfig();
                dbName = `/orbitdb/${config.auth.authDbCid}`;
            }
            if (dbName === 'system-sessions') {
                const config = await loadConfig();
                dbName = `/orbitdb/${config.auth.sessionDbCid}`;
            }
            if (dbName === 'system-auth-events') {
                const config = await loadConfig();
                dbName = `/orbitdb/${config.auth.eventLogCid}`;
            }
            processId = this.idReferenceFactory.getIdReference(dbName);
            if (processId) {
                podId = processId.podId;
            }
        }
        if (podId) {
            const pod = this.getPod(podId);
            if (pod) {
                return pod.getOpenDb(processId);
            }
        }
        // throw new Error(`Database ${dbName} not found`);
    }
    /**
     * Closes the open database with the specified name or ID.
     */
    async closeDb(dbName) {
        let orbitDbId;
        if (dbName instanceof PodProcessId) {
            orbitDbId = dbName;
        }
        else {
            const idReference = this.idReferenceFactory.getIdReference(dbName);
            if (idReference && idReference instanceof PodProcessId) {
                orbitDbId = idReference;
            }
        }
        if (!orbitDbId) {
            logger({
                level: LogLevel.ERROR,
                message: `Database ${dbName} not found`
            });
            return;
        }
        //close the open db
        const orbitDbPod = this.pods.find(pod => {
            if (!orbitDbId) {
                return;
            }
            if (pod.db.has(orbitDbId)) {
                return pod;
            }
        });
        if (orbitDbPod) {
            await orbitDbPod.stopOpenDb(orbitDbId.name);
            this.removePod(orbitDbPod.id);
            return orbitDbId;
        }
    }
    /**
     * Gets the open pubsub topics in the PodBay.
     */
    getOpenTopics() {
        const topics = [];
        this.pods.forEach(pod => {
            pod.pubsub?.getSubscriptions().forEach(pubsub => {
                topics.push(pubsub);
            });
        });
        return topics;
    }
    /**
     * Publishes a message to a topic in the PodBay.
     */
    async subscribe({ topic, podId }) {
        const pod = this.getPod(podId);
        await pod?.initPubSub(topic);
    }
    /**
     * Publishes a message to a topic in the PodBay.
     */
    async publish({ topic, message, podId }) {
        const pod = this.getPod(podId);
        return await pod?.pubsub?.publish(new TextEncoder().encode(message));
    }
    /**
     * Get the list of open filesystems in the PodBay.
     */
    getOpenFs() {
        const fs = new Array();
        this.pods.forEach(pod => {
            pod.fs?.forEach(fsName => {
                fs.push(fsName.id.name);
            });
        });
        return fs;
    }
    /**
     * Get the filesystem with the specified name or ID.
     */
    getFs(fsName) {
        let podId;
        let processId;
        if (fsName instanceof PodProcessId) {
            processId = fsName;
            podId = processId.podId;
        }
        else {
            let openFsIds = this.getOpenFs();
            console.log(openFsIds);
            openFsIds.forEach(id => {
                console.log(id);
                let idReference = this.idReferenceFactory.getIdReference(id);
                console.log(idReference);
                if (idReference && idReference instanceof PodProcessId) {
                    if (idReference.name === fsName) {
                        processId = idReference;
                        podId = processId.podId;
                    }
                    console.log(processId);
                }
            });
        }
        console.log(`podId: ${podId}, processId: ${processId}`);
        if (podId) {
            const pod = this.getPod(podId);
            if (pod && processId) {
                const process = pod.fs.get(processId);
                if (process) {
                    return process;
                }
            }
        }
        throw new Error(`FileSystem ${fsName} not found`);
    }
    /**
     * Create a new filesystem in the PodBay.
     */
    async createFs({ podId, filesystemName, filesystemType } = {}) {
        const pod = this.getPod(podId);
        if (!pod) {
            logger({
                level: LogLevel.ERROR,
                message: `Pod with id ${podId} not found`
            });
            throw new Error(`Pod with id ${podId} not found`);
        }
        return await pod?.initFileSystem({
            processId: this.idReferenceFactory.createIdReference({
                name: filesystemName,
                type: IdReferenceTypes.PROCESS,
                metadata: new MetaData({
                    mapped: new Map([
                        ["filesystemType", filesystemType],
                        ["createdBy", this.id.name]
                    ])
                }),
                dependsOn: podId
            }),
            type: isIpfsFileSystemType(filesystemType),
            name: filesystemName
        });
    }
}
export { PodBay };
