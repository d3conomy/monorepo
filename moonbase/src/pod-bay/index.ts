
import { Multiaddr } from "@multiformats/multiaddr";
import { LunarPod } from "../lunar-pod/index.js";
import { IdReferenceFactory, IdReferenceTypes, LogLevel, MetaData, PodBayId, PodId, PodProcessId, ProcessStage, ProcessType, isIdReferenceType, logger } from "d3-artifacts";
import { OpenDbOptions, OrbitDbTypes } from "../open-db-process/OpenDbOptions.js";
import { OpenDbProcess } from "../open-db-process/index.js";
import { IpfsFileSystem, IpfsFileSystemType, isIpfsFileSystemType } from "../ipfs-process/IpfsFileSystem.js";
import { Libp2pProcessOptions } from "../libp2p-process/processOptions.js";
import { IpfsOptions } from "../ipfs-process/IpfsOptions.js";
import { OrbitDbOptions } from "../orbitdb-process/OrbitDbOptions.js";
import { loadConfig } from "../moonbase-system/MoonbaseConfig.js";


/**
 * Represents a collection of LunarPods and provides methods for managing and interacting with them.
 * @category PodBay 
*/
class PodBay {
    public id: PodBayId;
    /**
     * The array of LunarPods in the PodBay.
     */
    public pods: Array<LunarPod>;

   /**
    * The idReferenceFactory used to create new IdReferences.
    */
    public idReferenceFactory: IdReferenceFactory;

    /**
     * Creates a new instance of the PodBay class.
     */
    constructor({
        id,
        idReferenceFactory,
        pods
    }: {
        id?: PodBayId,
        idReferenceFactory: IdReferenceFactory
        pods?: Array<LunarPod>, 
    }) {
        this.idReferenceFactory = idReferenceFactory;
        this.id = id ? id : this.idReferenceFactory.createIdReference({
            type: IdReferenceTypes.POD_BAY,
            dependsOn: this.idReferenceFactory.getIdReferencesByType(IdReferenceTypes.SYSTEM)[0]
        });
        this.pods = pods ? pods : new Array<LunarPod>();

    }

    /**
     * Returns an array of pod IDs in the PodBay.
     */
    public podIds(): Array<PodId> {
        return this.pods.map(pod => pod.id);
    }

    /**
     * Checks if a pod ID exists in the PodBay.
     */
    public checkPodId(id?: PodId): boolean {
        if (!id) {
            return false
        }

        return this.podIds().includes(id);
    }

    /**
     * Creates a new pod in the PodBay.
     */
    public async newPod({
        id,
        podName,
        processType,
        options
    }:{
        id?: PodId,
        podName?: string,
        processType?: ProcessType,
        options?: {
            databaseName?: string,
            databaseType?: string,
            libp2pOptions?: Libp2pProcessOptions,
            ipfsOptions?: IpfsOptions,
            orbitDbOptions?: OrbitDbOptions,
            openDbOptions?: OpenDbOptions,
            pubsubTopic?: string
        }
    } = {}): Promise<PodId | undefined> {
        if (!id) {
            id = this.idReferenceFactory.createIdReference({
                name: podName ? podName : `pod-${this.pods.length + 1}`,
                type: IdReferenceTypes.POD,
                metadata: new MetaData({
                    mapped: new Map<string, any>([
                        ["processType", processType],
                        ["createdBy", this.id.name]
                    ])
                }),
                dependsOn: this.id
            });
        }
        if (id && !this.checkPodId(id)) {

            let pod = new LunarPod({id, idReferenceFactory: this.idReferenceFactory});
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
    public addPod(pod: LunarPod): void {
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
    public getPod(id?: PodId | string): LunarPod | undefined {
        // if (!id) {
        //     logger({
        //         level: LogLevel.ERROR,
        //         message: `IdReference is undefined`
        //     })
        // }
        // else {
            let podId: PodId;
            if (typeof id === "string") {
                podId = this.idReferenceFactory.getIdReference(id) as PodId;
            }
            else if (id instanceof PodId){
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
        // }
    }

    /**
     * Removes a pod from the PodBay.
     */
    public async removePod(id: PodId | string): Promise<void> {
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
    public getStatus(id: PodId): {
        libp2p?: ProcessStage,
        orbitDb?: ProcessStage,
        ipfs?: ProcessStage,
        db?: Array<ProcessStage>
    } | undefined{
        const pod = this.getPod(id);
        if (pod) {
            return pod.status();
        }
    }

    /**
     * Gets the names of all open databases in the PodBay.
     */
    public getAllOpenDbNames(): Array<string> {
        const dbNames: Array<string> = [];
        this.pods.forEach(pod => {
            pod.db.forEach(db => {
                dbNames.push(db.id.name);
            });
        });
        return dbNames;
    }

    private async checkIfOpenDbExists(dbName: string): Promise<{
        openDb: OpenDbProcess,
        address?: string,
        type: OrbitDbTypes | string,
        podId: PodId,
        multiaddrs?: Multiaddr[]
    } | undefined> {
        const dbExists: boolean = this.getAllOpenDbNames().includes(dbName);

        if (!dbExists) {
            return;
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
            return;
        }

        // get the pod that has the openDb
        const orbitDbPod: LunarPod | undefined = this.pods.find(pod => {
            if (!openDb) {
                return;
            }
            if (pod.db.has(openDb.id)) {
                return pod;
            }
        });

        return {
            openDb,
            address: openDb.address(),
            type: openDb.id.metadata.get('databaseType'),
            podId: openDb.id.podId,
            multiaddrs: orbitDbPod?.libp2p?.getMultiaddrs()

        }
    }

    /**
     * Opens a database in the PodBay.
     */
    public async openDb({
        podId,
        orbitDbId,
        dbName,
        dbType,
        options
    } : {
        podId?: PodId,
        orbitDbId?: PodProcessId,
        dbName: string,
        dbType: OrbitDbTypes | string,
        dialAddress?: string,
        options?: Map<string, string>
    }): Promise<{
        openDb: PodProcessId,
        address?: string,
        type: OrbitDbTypes | string,
        podId: PodId,
        multiaddrs?: Multiaddr[]
    } | undefined> {
        //get a pod with an orbitDbProcess
        let orbitDbPod: LunarPod | undefined;
        let openDbOptions: {
            databaseName: string,
            databaseType: OrbitDbTypes | string,
            dbOptions: Map<string, string>
        };
        let openDb: OpenDbProcess | undefined;


        const db = await this.checkIfOpenDbExists(dbName)

        if (db && db.openDb) {
            return {
                openDb: db.openDb.id,
                address: db.address,
                type: db.type,
                podId: db.podId,
                multiaddrs: db.multiaddrs
            }
        }

        if (orbitDbId || podId) {
            orbitDbPod = this.getPod(podId);
            if (!orbitDbPod) {
                // if (orbitDbPod.id.name !== orbitDbId.podId.name) {
                    orbitDbPod = this.getPod(orbitDbId?.podId);
                // }
            }
            
            if (!orbitDbPod) {
                orbitDbPod = this.pods.find(pod => pod.orbitDb && pod.id.name !== 'system');
            }
        }


        openDbOptions = {
            databaseName: dbName,
            databaseType: dbType,
            dbOptions: options? options : new Map<string, string>()
        };



        if (!orbitDbPod ||
            !orbitDbPod.orbitDb
        ) {
            podId = await this.newPod({
                id: this.idReferenceFactory.createIdReference({
                    type: IdReferenceTypes.POD,
                    metadata: new MetaData({
                        mapped: new Map<string, any>([
                            ["processType", ProcessType.OPEN_DB],
                            ["createdBy", this.id.name]
                        ])
                    }),
                    dependsOn: this.id
                }),
                processType: ProcessType.OPEN_DB,
                options: openDbOptions
            });
        }

        if (podId) {
            orbitDbPod = this.getPod(podId);
        }

        if (!orbitDbPod) {
            logger({
                level: LogLevel.ERROR,
                message: `Error creating pod`
            });
            return;
        }

        openDb = orbitDbPod.getOpenDb(dbName)

        if (!openDb) {
            try {
                await orbitDbPod.initOpenDb(openDbOptions);
            }
            catch (error) {
                logger({
                    level: LogLevel.ERROR,
                    message: `Error opening database: ${error}`
                });
                // await this.closeDb(openDbOptions.databaseName);
                // await this.removePod(orbitDbPod.id);
                return;
            }

            openDb = orbitDbPod.getOpenDb(dbName);
        }

        if (!openDb) {
            logger({
                level: LogLevel.ERROR,
                message: `Database ${dbName} not found`
            });
            return;
        }

        return {
            openDb: openDb.id,
            address: openDb.address(),
            type: dbType,
            podId: orbitDbPod.id,
            multiaddrs: orbitDbPod.libp2p?.getMultiaddrs()
        
        }

        // // if (orbitDbPod && orbitDbPod.orbitDb) {
            

        //     try {
        //         await orbitDbPod.initOpenDb(openDbOptions);
        //     }
        //     catch (error) {
        //         logger({
        //             level: LogLevel.ERROR,
        //             message: `Error opening database: ${error}`
        //         });
        //         // await this.closeDb(openDbOptions.databaseName);
        //         // await this.removePod(orbitDbPod.id);
        //         return;
        //     }

        //     const openDbProcess = await this.getOpenDb(dbName);

        //     if (openDbProcess) {
        //         return { 
        //             openDb: openDbProcess.id,
        //             address: openDbProcess?.address(),
        //             type: openDbProcess.id.metadata.get('databaseType'),
        //             podId: orbitDbPod.id,
        //             multiaddrs: orbitDbPod.libp2p?.getMultiaddrs()
        //         }
        //     }
        // }
    }

    /**
     * Gets the open database with the specified name or ID.
     */
    public async getOpenDb(dbName: PodProcessId | string): Promise<OpenDbProcess | undefined> {
        let podId: PodId | undefined;
        let processId: PodProcessId | undefined;

        if (dbName instanceof PodProcessId) {
            processId = dbName;
            podId = processId.podId;
        }
        else {
            if (dbName.startsWith('zdpu')) {
                dbName = `/orbitdb/${dbName}`;

            }

            if (dbName === 'system-auth') {
                const config = await loadConfig()
                dbName = `/orbitdb/${config.auth.authDbCid}`;
            }

            if (dbName === 'system-sessions') {
                const config = await loadConfig()
                dbName = `/orbitdb/${config.auth.sessionDbCid}`;
            }

            if (dbName === 'system-auth-events') {
                const config = await loadConfig()
                dbName = `/orbitdb/${config.auth.eventLogCid}`;
            }

            processId = this.idReferenceFactory.getIdReference(dbName) as PodProcessId;
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
    public async closeDb(dbName: string | PodProcessId): Promise<PodProcessId | undefined> {
        let orbitDbId: PodProcessId | undefined;
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
    public getOpenTopics(): Array<string> {
        const topics: Array<string> = [];
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
    public async subscribe({
        topic,
        podId
    }: {
        topic: string,
        podId: PodId
    }): Promise<void> {
        const pod = this.getPod(podId);
        await pod?.initPubSub(topic);
    }

    /**
     * Publishes a message to a topic in the PodBay.
     */
    public async publish({
        topic,
        message,
        podId
    }: {
        topic: string,
        message: string
        podId: PodId
    }): Promise<any> {
        const pod = this.getPod(podId);
        return await pod?.pubsub?.publish(new TextEncoder().encode(message));

    }

    /**
     * Get the list of open filesystems in the PodBay.
     */
    public getOpenFs(): Array<string> {
        const fs: Array<string> = new Array<string>();
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
    public getFs(fsName: PodProcessId | string): IpfsFileSystem {
        let podId: PodId | undefined;
        let processId: PodProcessId | undefined;

        if (fsName instanceof PodProcessId) {
            processId = fsName;
            podId = processId.podId;
        }
        else {
            let openFsIds = this.getOpenFs();
            console.log(openFsIds)
            
            openFsIds.forEach(id => {
                console.log(id)
                let idReference = this.idReferenceFactory.getIdReference(id);
                console.log(idReference)
                if (idReference && idReference instanceof PodProcessId) {
                    if (idReference.name === fsName) {
                        processId = idReference;
                        podId = processId.podId;
                    }
                    console.log(processId)
                }
            });
        }

        console.log(`podId: ${podId}, processId: ${processId}`)
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
    public async createFs({
        podId,
        filesystemName,
        filesystemType
    }: {
        podId?: PodId | string,
        filesystemName?: string,
        filesystemType?: string | IpfsFileSystemType
    } ={}): Promise<PodProcessId> {
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
                    mapped: new Map<string, any>([
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

export {
    PodBay
};
