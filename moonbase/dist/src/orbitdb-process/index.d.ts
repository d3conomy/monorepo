/// <reference path="../../../src/typings.d.ts" />
import { OrbitDb, Database } from '@orbitdb/core';
import { IpfsProcess } from '../ipfs-process/index.js';
import { IProcess, IdReference, ProcessStage } from 'd3-artifacts';
import { createIdentityProvider } from './OrbitDbIdentityProvider.js';
/**
* The options for creating an OrbitDb process
* @category OrbitDb
*/
declare class _OrbitDbOptions {
    ipfs: IpfsProcess;
    enableDID: boolean;
    identitySeed?: Uint8Array;
    identityProvider?: any;
    directory?: string;
    constructor({ ipfs, enableDID, identitySeed, identityProvider, directory }: {
        ipfs?: IpfsProcess;
        enableDID?: boolean;
        identitySeed?: Uint8Array;
        identityProvider?: any;
        directory?: string;
    });
}
/**
 * Create an OrbitDb process
 * @category OrbitDb
 */
declare const createOrbitDbProcess: (options: _OrbitDbOptions) => Promise<typeof OrbitDb>;
/**
 * A class representing an OrbitDb process
 * @category OrbitDb
 */
declare class OrbitDbProcess implements IProcess {
    id: IdReference;
    process?: typeof OrbitDb;
    options?: _OrbitDbOptions;
    constructor({ id, process, options }: {
        id: IdReference;
        process?: typeof OrbitDb;
        options?: _OrbitDbOptions;
    });
    /**
     * Check if the OrbitDb process exists
     */
    checkProcess(): boolean;
    /**
     * Initialize the OrbitDb process
     */
    init(): Promise<void>;
    /**
     * Get the status of the OrbitDb process
     */
    status(): ProcessStage;
    /**
     * Start the OrbitDb process
     */
    start(): Promise<void>;
    /**
     * Open an OrbitDb database
     */
    open({ databaseName, databaseType, options }: {
        databaseName: string;
        databaseType: string;
        options?: Map<string, string>;
    }): Promise<typeof Database>;
    /**
     * Stop the OrbitDb process
     */
    stop(): Promise<void>;
    /**
     * Restart the OrbitDb process
     */
    restart(): Promise<void>;
}
export { _OrbitDbOptions, createIdentityProvider, createOrbitDbProcess, OrbitDbProcess };
//# sourceMappingURL=index.d.ts.map