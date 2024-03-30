/// <reference path="../../../src/typings.d.ts" />
import { OrbitDb } from '@orbitdb/core';
import { IProcess, PodProcessId, ProcessStage } from 'd3-artifacts';
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
    id: PodProcessId;
    process?: typeof OrbitDb;
    options?: OrbitDbOptions;
    private processStatus;
    constructor({ id, process, options }: {
        id: PodProcessId;
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
     * Stop the OrbitDb process
     */
    stop(): Promise<void>;
    /**
     * Restart the OrbitDb process
     */
    restart(): Promise<void>;
}
export { createOrbitDbProcess, OrbitDbProcess };
export * from './OrbitDbOptions.js';
export * from './OrbitDbIdentityProvider.js';
//# sourceMappingURL=index.d.ts.map