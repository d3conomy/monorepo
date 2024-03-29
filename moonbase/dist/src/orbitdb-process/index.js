import { createOrbitDB } from '@orbitdb/core';
import { IdReference, LogLevel, ResponseCode, logger } from 'd3-artifacts';
import { createIdentityProvider } from './OrbitDbIdentityProvider.js';
/**
* The options for creating an OrbitDb process
* @category OrbitDb
*/
class _OrbitDbOptions {
    ipfs;
    enableDID;
    identitySeed;
    identityProvider;
    directory;
    constructor({ ipfs, enableDID, identitySeed, identityProvider, directory }) {
        if (!ipfs) {
            throw new Error(`No Ipfs process found`);
        }
        this.ipfs = ipfs;
        this.enableDID = enableDID ? enableDID : false;
        this.identitySeed = identitySeed;
        this.identityProvider = identityProvider;
        this.directory = directory ? directory : `./orbitdb/${new IdReference().name}`;
        if (this.enableDID) {
            this.identityProvider = createIdentityProvider({
                identitySeed: this.identitySeed,
                identityProvider: this.identityProvider
            });
        }
    }
}
/**
 * Create an OrbitDb process
 * @category OrbitDb
 */
const createOrbitDbProcess = async (options) => {
    if (options.enableDID) {
        return await createOrbitDB({
            ipfs: options.ipfs.process,
            identity: {
                provider: options.identityProvider
            },
            directory: options.directory
        });
    }
    return await createOrbitDB({
        ipfs: options.ipfs.process,
        directory: options.directory
    });
};
/**
 * A class representing an OrbitDb process
 * @category OrbitDb
 */
class OrbitDbProcess {
    id;
    process;
    options;
    constructor({ id, process, options }) {
        this.id = id;
        this.process = process;
        this.options = options;
    }
    /**
     * Check if the OrbitDb process exists
     */
    checkProcess() {
        if (this.process) {
            return true;
        }
        logger({
            level: LogLevel.ERROR,
            processId: this.id,
            message: `No OrbitDb process found`
        });
        return false;
    }
    ;
    /**
     * Initialize the OrbitDb process
     */
    async init() {
        if (this.process) {
            logger({
                level: LogLevel.ERROR,
                processId: this.id,
                message: `OrbitDb process already exists`
            });
            return;
        }
        if (!this.options) {
            throw new Error(`No OrbitDb options found`);
        }
        if (!this.options.ipfs) {
            throw new Error(`No Ipfs process found`);
        }
        this.process = await createOrbitDbProcess(this.options);
    }
    /**
     * Get the status of the OrbitDb process
     */
    status() {
        throw new Error(`OrbitDb process status not implemented`);
    }
    /**
     * Start the OrbitDb process
     */
    async start() {
        throw new Error(`OrbitDb process cannot be started, open a database instead`);
    }
    /**
     * Open an OrbitDb database
     */
    async open({ databaseName, databaseType, options }) {
        if (!this.process) {
            logger({
                level: LogLevel.ERROR,
                code: ResponseCode.NOT_FOUND,
                message: `No OrbitDb process found`
            });
        }
        else {
            try {
                if (databaseName.startsWith('/orbitdb')) {
                    return await this.process.open(databaseName);
                }
                ;
                return await this.process.open(databaseName, {
                    type: databaseType
                }, options?.entries());
            }
            catch (error) {
                logger({
                    level: LogLevel.ERROR,
                    message: `Error opening database process: ${error}`
                });
                throw error;
            }
        }
    }
    /**
     * Stop the OrbitDb process
     */
    async stop() {
        if (this.process) {
            try {
                await this.process.stop();
                logger({
                    level: LogLevel.INFO,
                    processId: this.id,
                    message: `OrbitDb process stopped`
                });
            }
            catch (error) {
                logger({
                    level: LogLevel.ERROR,
                    processId: this.id,
                    message: `Error stopping OrbitDb process: ${error}`
                });
                throw error;
            }
        }
    }
    /**
     * Restart the OrbitDb process
     */
    async restart() {
        throw new Error(`OrbitDb process cannot be restarted, open a database instead`);
    }
}
export { _OrbitDbOptions, createIdentityProvider, createOrbitDbProcess, OrbitDbProcess };
