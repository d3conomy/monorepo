import { InstanceOptions } from "../container/options.js";
import { OrbitDbTypes } from './dbTypes.js';
import { createRandomId } from '../id-reference-factory/IdReferenceFunctions.js';
const openDbOptions = () => {
    return new InstanceOptions({ options: [
            {
                name: "orbitdb",
                description: "The OrbitDb instance",
                required: false
            },
            {
                name: "databaseName",
                description: "The name of the database",
                required: true,
                defaultValue: createRandomId()
            },
            {
                name: "databaseType",
                description: "The type of the database",
                required: false,
                defaultValue: OrbitDbTypes.KEYVALUE
            },
            {
                name: "databaseOptions",
                description: "The options for the database",
                required: false
            },
            {
                name: "directory",
                description: "The directory for the database",
                required: false,
                defaultValue: './orbitdb'
            }
        ] });
};
/**
 * The options for opening a database.
 * @category Database
 */
class OpenDbOptions extends InstanceOptions {
    constructor(options, defaults = true) {
        super({ options: options, injectDefaults: defaults, defaults: openDbOptions() });
    }
}
export { openDbOptions, OpenDbOptions };
