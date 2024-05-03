import { OrbitDb } from '@orbitdb/core'

import { InstanceOption, InstanceOptions } from "../container/options.js";
import { OrbitDbTypes } from './dbTypes.js';


const openDbOptions = (): InstanceOptions => {
    return new InstanceOptions({ options: [
        {
            name: "orbitDb",
            description: "The OrbitDb instance",
            required: true
        } as InstanceOption<typeof OrbitDb>,
        {
            name: "databaseName",
            description: "The name of the database",
            required: true
        } as InstanceOption<string>,
        {
            name: "databaseType",
            description: "The type of the database",
            required: false,
            defaultValue: OrbitDbTypes.KEYVALUE
        } as InstanceOption<OrbitDbTypes>,
        {
            name: "databaseOptions",
            description: "The options for the database",
            required: false
        } as InstanceOption<Map<string, any>>
    ]})
}

/**
 * The options for opening a database.
 * @category Database
 */
class OpenDbOptions
    extends InstanceOptions 
{

    constructor(options: InstanceOptions = openDbOptions()) {
        super({options: options.toArray()})
    }
}


export {
    openDbOptions,
    OpenDbOptions
}

