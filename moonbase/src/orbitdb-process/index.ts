import OrbitDBIdentityProviderDID from '@orbitdb/identity-provider-did'
import KeyDidResolver from 'key-did-resolver'

import {
    Ed25519Provider
} from 'key-did-provider-ed25519'


import {
    useIdentityProvider,
    OrbitDb,
    createOrbitDB,
    Database
} from '@orbitdb/core';
import { IpfsProcess } from '../ipfs-process/index.js';
import { IProcess, IdReference, LogLevel, ProcessStage, ResponseCode, logger } from 'd3-artifacts';
import { createIdentityProvider } from './OrbitDbIdentityProvider.js';


/**
* The options for creating an OrbitDb process
* @category OrbitDb
*/
class _OrbitDbOptions {
    ipfs: IpfsProcess;
    enableDID: boolean;
    identitySeed?: Uint8Array;
    identityProvider?: any;
    directory?: string;

    constructor({
        ipfs,
        enableDID,
        identitySeed,
        identityProvider,
        directory
    }: {
        ipfs?: IpfsProcess;
        enableDID?: boolean;
        identitySeed?: Uint8Array;
        identityProvider?: any;
        directory?: string;
    }) {
        if (!ipfs) {
            throw new Error(`No Ipfs process found`)
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
const createOrbitDbProcess = async (options: _OrbitDbOptions): Promise<typeof OrbitDb> => {
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
}

/**
 * A class representing an OrbitDb process
 * @category OrbitDb
 */
class OrbitDbProcess
    implements IProcess
{
    public id: IdReference;
    public process?: typeof OrbitDb;
    public options?: _OrbitDbOptions;

    constructor({
        id,
        process,
        options
    }: {
        id: IdReference,
        process?: typeof OrbitDb,
        options?: _OrbitDbOptions
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
        this.process = await createOrbitDbProcess(this.options);
    }

    /**
     * Get the status of the OrbitDb process
     */
    public status(): ProcessStage {
        throw new Error(`OrbitDb process status not implemented`)
    }

    /**
     * Start the OrbitDb process
     */
    public async start(): Promise<void> {
        throw new Error(`OrbitDb process cannot be started, open a database instead`)
    }

    /**
     * Open an OrbitDb database
     */
    public async open({
        databaseName,
        databaseType,
        options
    }: {
        databaseName: string;
        databaseType: string;
        options?: Map<string, string>
    }): Promise<typeof Database> {
        if (!this.process) {
            logger({
                level: LogLevel.ERROR,
                code: ResponseCode.NOT_FOUND,
                message: `No OrbitDb process found`
            })
        }
        else {
            try {
                if (databaseName.startsWith('/orbitdb')) {
                    return await this.process.open(
                        databaseName
                    )
                };

                return await this.process.open(
                    databaseName, 
                    {
                        type: databaseType
                    },
                    options?.entries()
                );
            }
            catch (error) {
                logger({
                    level: LogLevel.ERROR,
                    message: `Error opening database process: ${error}`
                })
                throw error;
            }
        }
    }

    /**
     * Stop the OrbitDb process
     */
    public async stop(): Promise<void> {
        if (this.process) {
            try {
                await this.process.stop();
                logger({
                    level: LogLevel.INFO,
                    processId: this.id,
                    message: `OrbitDb process stopped`
                })
            }
            catch (error) {
                logger({
                    level: LogLevel.ERROR,
                    processId: this.id,
                    message: `Error stopping OrbitDb process: ${error}`
                })
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
    _OrbitDbOptions,
    createIdentityProvider,
    createOrbitDbProcess,
    OrbitDbProcess
}
