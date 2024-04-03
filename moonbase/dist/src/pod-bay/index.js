import { LunarPod } from "../lunar-pod/index.js";
import { IdReferenceTypes, LogLevel, MetaData, PodId, PodProcessId, ProcessType, logger } from "d3-artifacts";
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
    async newPod({ id, processType } = {}) {
        if (!id) {
            id = this.idReferenceFactory.createIdReference({
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
                await pod.init(processType);
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
    checkIfOpenDbExists(dbName) {
        const dbExists = this.getAllOpenDbNames().includes(dbName);
        if (!dbExists) {
            return false;
        }
        logger({
            level: LogLevel.WARN,
            message: `Database ${dbName} already opened`
        });
        const openDb = this.getOpenDb(dbName);
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
    async openDb({ orbitDbId, dbName, dbType, options }) {
        //get a pod with an orbitDbProcess
        let orbitDbPod;
        let openDbOptions;
        let openDb;
        if (this.checkIfOpenDbExists(dbName)) {
        }
        if (orbitDbId) {
            orbitDbPod = this.pods.find(pod => {
                logger({
                    level: LogLevel.INFO,
                    message: `Checking pod ${pod.id.name} for orbitDb`
                });
                if (pod.orbitDb &&
                    pod.id.name === orbitDbId.name &&
                    pod.db.size > 0) {
                    openDb = pod.getOpenDb(dbName);
                    return {
                        openDb,
                        type: openDb?.options?.databaseType,
                        address: openDb?.address(),
                        multiaddrs: pod.libp2p?.getMultiaddrs(),
                    };
                }
            });
        }
        else {
            orbitDbPod = this.pods.find(pod => pod.db.size === 0);
        }
        if (!orbitDbPod ||
            !orbitDbPod.orbitDb ||
            orbitDbPod?.db?.size > 0) {
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
                options: options ? options : new Map()
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
    getOpenDb(dbName) {
        let podId;
        let processId;
        if (dbName instanceof PodProcessId) {
            processId = dbName;
            podId = processId.podId;
        }
        else {
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
}
export { PodBay };
