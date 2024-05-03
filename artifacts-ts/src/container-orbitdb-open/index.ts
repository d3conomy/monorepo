

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
        databaseOptions
    } = options.toParams();

    console.log(`opening database: ${databaseName}`)

    await removeLock(id.podId.name, databaseName);

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

        const orbitDbInstance = orbitDb.getInstance();
        
        return await orbitDbInstance.open(
            databaseName,
            { ...openDatabaseOptions }
        );
    }
    catch (error) {
        // logger({
        //     level: LogLevel.ERROR,
        //     message: `Error opening database: ${error}`
        // });
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
