/// <reference path="../../../../moonbase/src/typings.d.ts" />
import { Database } from '@orbitdb/core';
import { IProcess, IdReference, ProcessStage } from 'd3-artifacts';
import { OpenDbOptions } from './OpenDbOptions';
/**
 * Opens a database.
 * @category Database
 */
declare const openDb: ({ orbitDb, databaseName, databaseType, options }: OpenDbOptions) => Promise<typeof Database>;
declare class OpenDbProcess implements IProcess {
    id: IdReference;
    process?: typeof Database;
    options?: OpenDbOptions;
    /**
     * Constructs a new instance of the OpenDb class.
     */
    constructor({ id, process, options }: {
        id: IdReference;
        process?: typeof Database;
        options?: OpenDbOptions;
    });
    /**
     * Checks if the database process exists.
     */
    checkProcess(): boolean;
    /**
     * Initializes the database process.
     */
    init(): Promise<void>;
    /**
     * Starts the database process.
     */
    start(): Promise<void>;
    /**
     * Check the Status of the databaseProcess
     */
    status(): ProcessStage;
    /**
     * Stops the database process.
     */
    stop(): Promise<void>;
    /**
     * Restarts the database process.
     */
    restart(): Promise<void>;
    /**
     * Gets the address of the database process.
     */
    address(): string;
    /**
     * Adds data to the database.
     */
    add(data: any): Promise<string>;
    /**
     * Retrieves all data from the database.
     */
    all(): Promise<any>;
    /**
     * Retrieves data from the database based on the given hash.
     */
    get(hash: string): Promise<any>;
    /**
     * Puts data into the database with the given key and value.
     */
    put(key: string, value: any): Promise<string>;
    /**
     * Puts a document into the database.
     */
    putDoc(doc: any): Promise<string>;
    /**
     * Deletes data from the database based on the given key.
     */
    del(key: string): Promise<void>;
    /**
     * Queries the database using the given mapper function.
     */
    query(mapper: any): Promise<any>;
}
export { OpenDbProcess, openDb, };
