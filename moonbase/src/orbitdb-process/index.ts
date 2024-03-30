import {
    OrbitDb,
    createOrbitDB,
    Database
} from '@orbitdb/core';
import { IProcess, IdReference, LogLevel, PodProcessId, ProcessStage, ResponseCode, logger } from 'd3-artifacts';
import { OrbitDbOptions } from './OrbitDbOptions.js';
import { openDb } from '../open-db-process/index.js';


/**
 * Create an OrbitDb process
 * @category OrbitDb
 */
const createOrbitDbProcess = async ({
    ipfs,
    enableDID,
    identityProvider,
    directory
}: OrbitDbOptions): Promise<typeof OrbitDb> => {
    if (enableDID) {
        return await createOrbitDB({
            ipfs: ipfs.process,
            identity: {
                provider: identityProvider
            },
            directory: directory
        });
    }
    return await createOrbitDB({
        ipfs: ipfs.process,
        directory: directory
    });
}

/**
 * A class representing an OrbitDb process
 * @category OrbitDb
 */
class OrbitDbProcess
    implements IProcess
{
    public id: PodProcessId;
    public process?: typeof OrbitDb;
    public options?: OrbitDbOptions;
    private processStatus: ProcessStage = ProcessStage.NEW;

    constructor({
        id,
        process,
        options
    }: {
        id: PodProcessId,
        process?: typeof OrbitDb,
        options?: OrbitDbOptions
    }) {
        this.id = id;
        this.process = process;
        this.options = options;
    }

    /**
     * Check if the OrbitDb process exists
     */
    public checkProcess(): boolean {
        if (this.process) {
            return true
        }
        logger({
            level: LogLevel.ERROR,
            processId: this.id,
            message: `No OrbitDb process found`
        })
        return false
    };

    /**
     * Initialize the OrbitDb process
     */
    public async init(): Promise<void> {
        this.processStatus = ProcessStage.INITIALIZING;
        if (this.process) {
            logger({
                level: LogLevel.ERROR,
                processId: this.id,
                message: `OrbitDb process already exists`
            })
            return;
        }

        if (!this.options) {
            throw new Error(`No OrbitDb options found`)
        }

        if (!this.options.ipfs) {
            throw new Error(`No Ipfs process found`)
        }

        try {
            this.process = await createOrbitDbProcess(this.options);
            this.processStatus = ProcessStage.INITIALIZED;
        }
        catch (error: Error | any) {
            logger({
                level: LogLevel.ERROR,
                processId: this.id,
                message: `Error initializing OrbitDb process: ${error}`
            })
            this.processStatus = ProcessStage.ERROR;
            throw error;
        }
    }

    /**
     * Get the status of the OrbitDb process
     */
    public status(): ProcessStage {
        return this.processStatus;
    }

    /**
     * Start the OrbitDb process
     */
    public async start(): Promise<void> {
        this.processStatus = ProcessStage.STARTED;
        // this.processStatus = ProcessStage.STARTING;
        // await this.open({
        //     databaseName: this.options?.databaseName || 'events',
        //     databaseType: 'eventlog'
        // });
    }

    // /**
    //  * Open an OrbitDb database
    //  */
    // public async open({
    //     databaseName,
    //     databaseType,
    //     options
    // }: {
    //     databaseName: string;
    //     databaseType: string;
    //     options?: Map<string, any>
    // }): Promise<typeof Database> {
    //     if (!this.process) {
    //         logger({
    //             level: LogLevel.ERROR,
    //             code: ResponseCode.NOT_FOUND,
    //             message: `No OrbitDb process found`
    //         })
    //     }
    //     else {
    //         this.processStatus = ProcessStage.STARTING;
    //         try {
    //             return await openDb({
    //                 orbitDb: this.process,
    //                 databaseName: databaseName,
    //                 databaseType: databaseType,
    //                 options: options
    //             });
    //         }

    //         catch (error) {
    //             logger({
    //                 level: LogLevel.ERROR,
    //                 message: `Error opening database process: ${error}`
    //             })
    //             throw error;
    //         }
    //     }
    // }

    /**
     * Stop the OrbitDb process
     */
    public async stop(): Promise<void> {
        if (this.process) {
            try {
                this.processStatus = ProcessStage.STOPPING;
                await this.process.stop();
                logger({
                    level: LogLevel.INFO,
                    processId: this.id,
                    message: `OrbitDb process stopped`
                })
                this.processStatus = ProcessStage.STOPPED;
            }
            catch (error) {
                logger({
                    level: LogLevel.ERROR,
                    processId: this.id,
                    message: `Error stopping OrbitDb process: ${error}`
                })
                this.processStatus = ProcessStage.ERROR;
                throw error;
            }
        }
    }

    /**
     * Restart the OrbitDb process
     */
    public async restart(): Promise<void> {
        throw new Error(`OrbitDb process cannot be restarted, open a database instead`)
    }
}

export {
    createOrbitDbProcess,
    OrbitDbProcess
}

export * from './OrbitDbOptions.js';
export * from './OrbitDbIdentityProvider.js';
