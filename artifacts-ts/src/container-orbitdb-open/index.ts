

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
import { InstanceOptions } from '../container/options.js';

/**
 * Opens a database.
 * @category Database
 */
const databaseInitializer = async (
    options: OpenDbOptions,
    id: ContainerId
): Promise<typeof Database> => {

    const {
        orbitdb,
        databaseName,
        databaseType,
        databaseOptions,
        directory
    } = options.toParams();

    await removeLock({podId: id.podId.name, address: databaseName, directory: directory});

    let sync = false;
    if (databaseName.startsWith('/orbitdb')) {
        sync = true;
    }

    try {
        let openDatabaseOptions = {
            type: databaseType,
            sync: true,
        };

        // console.log(`opening using orbitdb instance: ${orbitdb.id} for database: ${databaseName} with options: ${JSON.stringify(openDatabaseOptions)} and type: ${databaseType}`)

        return await orbitdb.getInstance().open(
            databaseName,
            {
                ...openDatabaseOptions,
                // ...databaseOptions,
                AccessController: OrbitDBAccessController({
                    write: ['*']
                })
            }
        );
    }
    catch (error) {
        console.log(`error opening database: ${error}`)
    }
}


class DatabaseContainer
    extends Container<InstanceTypes.database>
{

    /**
     * Constructs a new instance of the OpenDb class.
     */
    constructor(
        id: ContainerId,
        options: InstanceOptions
    ) {
        super({
            id,
            type: InstanceTypes.database,
            options,
            initializer: databaseInitializer,
            commands: openDbCommands
        })
    
    }
}

export {
    DatabaseContainer,
}
