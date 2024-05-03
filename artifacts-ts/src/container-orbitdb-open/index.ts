

import {
    Database,
    OrbitDBAccessController
} from '@orbitdb/core';
import { OpenDbOptions } from './options.js';
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
    instanceOptions: OpenDbOptions,
    id: ContainerId
): Promise<typeof Database> => {

    const {
        orbitDb,
        databaseName,
        databaseType,
        databaseOptions
    } = instanceOptions.toParams();

    console.log(`opening database: ${databaseName}`)

    await removeLock(id.podId.name, databaseName);

    try {
        // await orbitDb.start();
        if (databaseName.startsWith('/orbitdb')) {
            return await orbitDb.open(
                databaseName,
                {
                    type: databaseType,
                    sync: true,
                    AccessController: OrbitDBAccessController({
                        write: ['*']
                    })
                },
                // ...databaseOptions.toParams()
            );
        }
        else {
            return await orbitDb.open(
                databaseName,
                {
                    type: databaseType,
                    AccessController: OrbitDBAccessController({
                        write: ['*']
                    })
                },
                // options?.entries()
            );
        }
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
