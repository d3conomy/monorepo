import { OrbitDBAccessController } from '@orbitdb/core';
import { openDbOptions } from './options.js';
import { openDbCommands } from './commands.js';
import { removeLock } from './helpers.js';
import { Container } from '../container/index.js';
import { InstanceTypes } from '../container/instance.js';
/**
 * Opens a database.
 * @category Database
 */
const databaseInitializer = async (options, id) => {
    options.injectDefaults(openDbOptions());
    const { orbitdb, databaseName, databaseType, databaseOptions, directory } = options.toParams();
    console.log(`opening database: ${databaseName}`);
    await removeLock({ podId: id.podId.name, address: databaseName, directory: directory });
    try {
        let openDatabaseOptions = new Map();
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
        console.log(`opening using orbitdb instance: ${orbitdb.id} for database: ${databaseName} with options: ${JSON.stringify(openDatabaseOptions)} and type: ${databaseType}`);
        return await orbitdb.getInstance().open(databaseName, { ...openDatabaseOptions });
    }
    catch (error) {
        console.log(`error opening database: ${error}`);
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
