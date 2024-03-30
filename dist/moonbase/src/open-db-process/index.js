import { LogLevel, logger } from 'd3-artifacts';
/**
 * Opens a database.
 * @category Database
 */
const openDb = async ({ orbitDb, databaseName, databaseType, options }) => {
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
};
class OpenDbProcess {
    id;
    process;
    options;
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
        }
        else {
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
    async start() {
        throw new Error('Method not implemented.');
    }
    /**
     * Check the Status of the databaseProcess
     */
    status() {
        throw new Error('Method not implemented.');
    }
    /**
     * Stops the database process.
     */
    async stop() {
        if (this.checkProcess()) {
            await this.process?.close();
            logger({
                level: LogLevel.INFO,
                processId: this.id,
                message: `Database process stopped`
            });
        }
        else {
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
    async restart() {
        await this.stop();
        await this.init();
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
