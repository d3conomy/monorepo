import { InstanceOptions } from "../container/options.js";
import { OrbitDbTypes } from './dbTypes.js';
const openDbOptions = () => {
    return new InstanceOptions({ options: [
            {
                name: "orbitDb",
                description: "The OrbitDb instance",
                required: true
            },
            {
                name: "databaseName",
                description: "The name of the database",
                required: true
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
            }
        ] });
};
/**
 * The options for opening a database.
 * @category Database
 */
class OpenDbOptions extends InstanceOptions {
    constructor(options = openDbOptions()) {
        super({ options: options.toArray() });
    }
}
export { openDbOptions, OpenDbOptions };
