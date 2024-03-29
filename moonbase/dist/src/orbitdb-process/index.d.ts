/// <reference path="../../../src/typings.d.ts" />
import { OrbitDb, Database } from '@orbitdb/core';
import { IProcess, IdReference, ProcessStage } from 'd3-artifacts';
import { OrbitDbOptions } from './OrbitDbOptions.js';
/**
 * Create an OrbitDb process
 * @category OrbitDb
 */
declare const createOrbitDbProcess: ({ ipfs, enableDID, identityProvider, directory }: OrbitDbOptions) => Promise<typeof OrbitDb>;
/**
 * A class representing an OrbitDb process
 * @category OrbitDb
 */
declare class OrbitDbProcess implements IProcess {
    id: IdReference;
    process?: typeof OrbitDb;
    options?: OrbitDbOptions;
    constructor({ id, process, options }: {
        id: IdReference;
        process?: typeof OrbitDb;
        options?: OrbitDbOptions;
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
export { createOrbitDbProcess, OrbitDbProcess };
//# sourceMappingURL=index.d.ts.map