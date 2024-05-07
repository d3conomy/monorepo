import { OrbitDb } from '@orbitdb/core'

import { InstanceOption, InstanceOptions } from "../container/options.js";
import { OrbitDbTypes } from './dbTypes.js';
import { OrbitDbContainer } from '../container-orbitdb/index.js';
import { createRandomId } from '../id-reference-factory/IdReferenceFunctions.js';


const openDbOptions = (): InstanceOptions => {
    return new InstanceOptions({ options: [
        {
            name: "orbitdb",
            description: "The OrbitDb instance",
            required: false
        } as InstanceOption<OrbitDbContainer>,
        {
            name: "databaseName",
            description: "The name of the database",
            required: true,
            value: createRandomId()
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
        } as InstanceOption<Map<string, any>>,
        {
            name: "directory",
            description: "The directory for the database",
            required: false,
            defaultValue: './orbitdb'
        } as InstanceOption<string>
    ]})
}

/**
 * The options for opening a database.
 * @category Database
 */
class OpenDbOptions
    extends InstanceOptions 
{

    constructor(options?: InstanceOptions, defaults: boolean = true) {
        super({options: options, injectDefaults: defaults, defaults: openDbOptions()})
    }
}


export {
    openDbOptions,
    OpenDbOptions
}

