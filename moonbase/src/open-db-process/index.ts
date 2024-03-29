

import {
    Database
} from '@orbitdb/core';
import { IProcess, IdReference, LogLevel, ProcessStage, logger } from 'd3-artifacts';
import { OpenDbOptions } from './OpenDbOptions';


/**
 * Opens a database.
 * @category Database
 */
const openDb = async ({
    orbitDb,
    databaseName,
    databaseType,
    options
}: OpenDbOptions): Promise<typeof Database> => {
    logger({
        level: LogLevel.INFO,
        message: `Opening database: ${databaseName}\n` +
                    `Type: ${databaseType}\n` +
                    `process: ${orbitDb.id.name}\n` +
                    `options: ${JSON.stringify(options, null, 2)}`
    });
    try {
        // await orbitDb.start();
        return await orbitDb.open({
            databaseName,
            databaseType,
            options
        });
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
    public id: IdReference;
    public process?: typeof Database;
    public options?: OpenDbOptions;

    /**
     * Constructs a new instance of the OpenDb class.
     */
    constructor({
        id,
        process,
        options
    }: {
        id: IdReference;
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
        if (this.checkProcess()) {
            logger({
                level: LogLevel.WARN,
                processId: this.id,
                message: `Database process already exists`
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
        } else {
            logger({
                level: LogLevel.ERROR,
                processId: this.id,
                message: `No database options found`
            });
            throw new Error(`No database options found`);
        }
        logger({
            level: LogLevel.INFO,
            processId: this.id,
            message: `Database process created`
        });
    }

    /**
     * Starts the database process.
     */
    public async start(): Promise<void> {
        throw new Error('Method not implemented.');
    }

    /** 
     * Check the Status of the databaseProcess
     */
    public status(): ProcessStage {
        throw new Error('Method not implemented.');
    }

    /**
     * Stops the database process.
     */
    public async stop(): Promise<void> {
        if (this.checkProcess()) {
            await this.process?.close();
            logger({
                level: LogLevel.INFO,
                processId: this.id,
                message: `Database process stopped`
            });
        } else {
            logger({
                level: LogLevel.ERROR,
                processId: this.id,
                message: `No database process found`
            });
            throw new Error(`No database process found`);
        }
    }

    /**
     * Restarts the database process.
     */
    public async restart(): Promise<void> {
        await this.stop();
        await this.init();
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

