

import {
    Database,
    OrbitDBAccessController
} from '@orbitdb/core';
import { OpenDbOptions, openDbOptions } from './options.js';
import { ContainerId } from '../id-reference-factory/index.js';
import { openDbCommands } from './commands.js';
import { removeLock } from './helpers.js';
import { Container } from '../container/index.js';
import { InstanceTypes } from '../container/instance.js';

/**
 * Opens a database.
 * @category Database
 */
const databaseInitializer = async (
    options: OpenDbOptions,
    id: ContainerId
): Promise<typeof Database> => {

    options.injectDefaults(openDbOptions())

    const {
        orbitDb,
        databaseName,
        databaseType,
        databaseOptions,
        directory
    } = options.toParams();

    console.log(`opening database: ${databaseName}`)

    await removeLock({podId: id.podId.name, address: databaseName, directory: directory});

    try {
        let openDatabaseOptions = new Map<string, any>();

        if (databaseName.startsWith('/orbitdb')) {
            openDatabaseOptions.set('sync', true);
        }

        openDatabaseOptions.set('type', databaseType);

        openDatabaseOptions.set('AccessController', OrbitDBAccessController({
            write: ['*']
        }));

        if (databaseOptions) {
            openDatabaseOptions = new Map([...openDatabaseOptions, ...databaseOptions]);
        }

        // const orbitDbInstance = orbitDb.getInstance();

        console.log(`opening using orbitdb instance: ${orbitDb.id} for database: ${databaseName} with options: ${JSON.stringify(openDatabaseOptions)} and type: ${databaseType}`)
        
        //timeout for 1s

    // await new Promise(resolve => setTimeout(resolve, 2000));

        return await orbitDb.getInstance().open(
            databaseName,
            { ...openDatabaseOptions }
        );
    }
    catch (error) {
        console.log(`error opening database: ${error}`)
    }
}


class DatabaseContainer
    extends Container<InstanceTypes.Database>
{

    /**
     * Constructs a new instance of the OpenDb class.
     */
    constructor(
        id: ContainerId,
        options: OpenDbOptions
    ) {
        super({
            id,
            type: InstanceTypes.Database,
            options,
            initializer: databaseInitializer,
            commands: openDbCommands
        })
    
    }
}

export {
    DatabaseContainer,
}
