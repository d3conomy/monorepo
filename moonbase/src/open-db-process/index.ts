

import {
    Database
} from '@orbitdb/core';
import { IProcess, IdReference, LogLevel, PodProcessId, ProcessStage, logger } from 'd3-artifacts';
import { OpenDbOptions } from './OpenDbOptions';
import { OrbitDbProcess } from '../orbitdb-process';


/**
 * Opens a database.
 * @category Database
 */
const openDb = async ({
    orbitDb,
    databaseName,
    databaseType,
    options
}: {
    orbitDb: OrbitDbProcess,
    databaseName: string,
    databaseType: string,
    options?: Map<string, string>
}): Promise<typeof Database> => {
    try {
        await orbitDb.start();
        if (databaseName.startsWith('/orbitdb')) {
            return await orbitDb.process.open(
                databaseName
            )
        }
        else {
            return await orbitDb.process.open(
                databaseName, 
                {
                    type: databaseType
                },
                options?.entries()
            );
        }
        
    }
    catch (error) {
        logger({
            level: LogLevel.ERROR,
            message: `Error opening database: ${error}`
        });
    }
}


class OpenDbProcess
    implements IProcess
{
    public id: PodProcessId;
    public process?: typeof Database;
    public options?: OpenDbOptions;
    private processStatus: ProcessStage = ProcessStage.NEW;

    /**
     * Constructs a new instance of the OpenDb class.
     */
    constructor({
        id,
        process,
        options
    }: {
        id: PodProcessId;
        process?: typeof Database;
        options?: OpenDbOptions;
    }) {
        this.id = id;
        this.process = process;
        this.options = options;
    }

    /**
     * Checks if the database process exists.
     */
    public checkProcess(): boolean {
        return this.process ? true : false;
    }

    /**
     * Initializes the database process.
     */
    public async init(): Promise<void> {
        if (this.processStatus !== ProcessStage.INITIALIZING  &&
            this.processStatus !== ProcessStage.INITIALIZED &&
            this.processStatus !== ProcessStage.STARTING &&
            this.processStatus !== ProcessStage.STARTED
        ) {
            this.processStatus = ProcessStage.INITIALIZING;
        } 
        else {
            logger({
                level: LogLevel.WARN,
                processId: this.id,
                message: `Database process already initializing`
            });
            return;
        }

        if (this.options) {
            this.process = await openDb({
                orbitDb: this.options.orbitDb,
                databaseName: this.options.databaseName,
                databaseType: this.options.databaseType,
                options: this.options.options
            });
            this.processStatus = ProcessStage.INITIALIZED;
        } 
        else {
            logger({
                level: LogLevel.ERROR,
                processId: this.id,
                message: `No database options found`
            });
            this.processStatus = ProcessStage.ERROR;
            throw new Error(`No database options found`);
        }
    }

    /**
     * Starts the database process.
     */
    public async start(): Promise<void> {
        this.processStatus = ProcessStage.STARTED;
        return;
    }

    /** 
     * Check the Status of the databaseProcess
     */
    public status(): ProcessStage {
        return this.processStatus;
    }

    /**
     * Stops the database process.
     */
    public async stop(): Promise<void> {
        if (this.processStatus !== ProcessStage.STOPPING &&
            this.processStatus !== ProcessStage.STOPPED
        ) {
            this.processStatus = ProcessStage.STOPPING;
        }
        else {
            logger({
                level: LogLevel.WARN,
                processId: this.id,
                message: `Database process already stopping`
            });
            return;
        }

        if (this.checkProcess()) {
            await this.process?.close();
            logger({
                level: LogLevel.INFO,
                processId: this.id,
                message: `Database process stopped`
            });
            this.processStatus = ProcessStage.STOPPED;
        }
        else {
            logger({
                level: LogLevel.ERROR,
                processId: this.id,
                message: `No database process found`
            });
            this.processStatus = ProcessStage.ERROR;
            throw new Error(`No database process found`);
        }
    }

    /**
     * Restarts the database process.
     */
    public async restart(): Promise<void> {
        this.processStatus = ProcessStage.RESTARTING;
        try {
            await this.stop();
            this.processStatus = ProcessStage.STOPPED;
            await this.init();
            this.processStatus = ProcessStage.STARTED;
        }
        catch (error) {
            logger({
                level: LogLevel.ERROR,
                processId: this.id,
                message: `Error restarting database process: ${error}`
            });
            this.processStatus = ProcessStage.ERROR;
            throw error;
        }

    }

    /**
     * Gets the address of the database process.
     */
    public address(): string {
        return this.process?.address;
    }

    /**
     * Adds data to the database.
     */
    public async add(data: any): Promise<string> {
        return await this.process?.add(data);
    }

    /**
     * Retrieves all data from the database.
     */
    public async all(): Promise<any> {
        return await this.process?.all();
    }

    /**
     * Retrieves data from the database based on the given hash.
     */
    public async get(hash: string): Promise<any> {
        return await this.process?.get(hash);
    }

    /**
     * Puts data into the database with the given key and value.
     */
    public async put(key: string, value: any): Promise<string> {
        return await this.process?.put(key, value);
    }

    /**
     * Puts a document into the database.
     */
    public async putDoc(doc: any): Promise<string> {
        return await this.process?.put(doc);
    }

    /**
     * Deletes data from the database based on the given key.
     */
    public async del(key: string): Promise<void> {
        await this.process?.del(key);
    }

    /**
     * Queries the database using the given mapper function.
     */
    public async query(mapper: any): Promise<any> {
        return await this.process?.query(mapper);
    }
}



export {
    OpenDbProcess,
    openDb,
}

export * from './OpenDbOptions.js';
