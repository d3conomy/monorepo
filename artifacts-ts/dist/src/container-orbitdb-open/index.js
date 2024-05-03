import { OrbitDBAccessController } from '@orbitdb/core';
import { openDbCommands } from './commands.js';
import { removeLock } from './helpers.js';
import { Container } from '../container/index.js';
import { InstanceTypes } from '../container/instance.js';
/**
 * Opens a database.
 * @category Database
 */
const databaseInitializer = async (instanceOptions, id) => {
    const { orbitDb, databaseName, databaseType, databaseOptions } = instanceOptions.toParams();
    console.log(`opening database: ${databaseName}`);
    await removeLock(id.podId.name, databaseName);
    try {
        // await orbitDb.start();
        if (databaseName.startsWith('/orbitdb')) {
            return await orbitDb.open(databaseName, {
                type: databaseType,
                sync: true,
                AccessController: OrbitDBAccessController({
                    write: ['*']
                })
            });
        }
        else {
            return await orbitDb.open(databaseName, {
                type: databaseType,
                AccessController: OrbitDBAccessController({
                    write: ['*']
                })
            });
        }
    }
    catch (error) {
        // logger({
        //     level: LogLevel.ERROR,
        //     message: `Error opening database: ${error}`
        // });
    }
};
class DatabaseContainer extends Container {
    /**
     * Constructs a new instance of the OpenDb class.
     */
    constructor(id, options) {
        super({
            id,
            type: InstanceTypes.Database,
            options,
            initializer: databaseInitializer,
            commands: openDbCommands
        });
    }
}
export { DatabaseContainer, };
