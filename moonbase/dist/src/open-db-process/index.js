import { OrbitDBAccessController } from '@orbitdb/core';
import { LogLevel, ProcessStage, logger } from 'd3-artifacts';
import path from 'path';
import fs from 'fs/promises';
/**
 * Opens a database.
 * @category Database
 */
const openDb = async ({ orbitDb, databaseName, databaseType, options }) => {
    try {
        await orbitDb.start();
        // if (databaseName.startsWith('/orbitdb')) {
        return await orbitDb.process.open(databaseName, {
            type: databaseType,
            // sync: true,
            AccessController: OrbitDBAccessController({
                write: ['*']
            })
        });
        // }
        // else {
        //     return await orbitDb.process.open(
        //         databaseName, 
        //         {
        //             type: databaseType,
        //             AccessController: OrbitDBAccessController({
        //                 write: ['*']
        //             })
        //         },
        //         options?.entries()
        //     );
        // }
    }
    catch (error) {
        logger({
            level: LogLevel.ERROR,
            message: `Error opening database: ${error}`
        });
    }
};
class OpenDbProcess {
    id;
    process;
    options;
    processStatus = ProcessStage.NEW;
    /**
     * Constructs a new instance of the OpenDb class.
     */
    constructor({ id, process, options }) {
        this.id = id;
        this.process = process;
        this.options = options;
    }
    /**
     * Checks if the database process exists.
     */
    checkProcess() {
        return this.process ? true : false;
    }
    /**
     * Initializes the database process.
     */
    async init() {
        if (this.processStatus !== ProcessStage.INITIALIZING &&
            this.processStatus !== ProcessStage.INITIALIZED &&
            this.processStatus !== ProcessStage.STARTING &&
            this.processStatus !== ProcessStage.STARTED) {
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
        await this.removeLock();
        if (this.options) {
            this.process = await openDb({
                orbitDb: this.options.orbitDb,
                databaseName: this.options.databaseName,
                databaseType: this.options.databaseType,
                options: this.options.dbOptions
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
    async start() {
        this.processStatus = ProcessStage.STARTED;
        return;
    }
    /**
     * Check the Status of the databaseProcess
     */
    status() {
        return this.processStatus;
    }
    async removeLock() {
        if (this.address()) {
            const __dirname = path.resolve();
            const orbitDbDataPath = path.join(__dirname, `./data/pods/system/orbitdb/orbitdb/${this.address().toString().split('/')[2]}`);
            const headLockFile = path.join(orbitDbDataPath, '/log/_heads/LOCK');
            const indexLockFile = path.join(orbitDbDataPath, '/log/_index/LOCK');
            try {
                //check if the files exist
                if (await fs.stat(headLockFile)) {
                    await fs.unlink(headLockFile);
                }
                if (await fs.stat(indexLockFile)) {
                    await fs.unlink(indexLockFile);
                }
            }
            catch (error) {
                logger({
                    level: LogLevel.ERROR,
                    processId: this.id,
                    message: `Error removing lock files: ${error}`
                });
            }
        }
    }
    /**
     * Stops the database process.
     */
    async stop() {
        if (this.processStatus !== ProcessStage.STOPPING &&
            this.processStatus !== ProcessStage.STOPPED) {
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
        await this.removeLock();
    }
    /**
     * Restarts the database process.
     */
    async restart() {
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
    address() {
        return this.process?.address;
    }
    /**
     * Adds data to the database.
     */
    async add(data) {
        return await this.process?.add(data);
    }
    /**
     * Retrieves all data from the database.
     */
    async all() {
        return await this.process?.all();
    }
    /**
     * Retrieves data from the database based on the given hash.
     */
    async get(hash) {
        return await this.process?.get(hash);
    }
    /**
     * Puts data into the database with the given key and value.
     */
    async put(key, value) {
        return await this.process?.put(key, value);
    }
    /**
     * Puts a document into the database.
     */
    async putDoc(doc) {
        return await this.process?.put(doc);
    }
    /**
     * Deletes data from the database based on the given key.
     */
    async del(key) {
        await this.process?.del(key);
    }
    /**
     * Queries the database using the given mapper function.
     */
    async query(mapper) {
        return await this.process?.query(mapper);
    }
}
export { OpenDbProcess, openDb, };
export * from './OpenDbOptions.js';
