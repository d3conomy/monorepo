import { v4 as uuidv4 } from 'uuid';
import chance from 'chance';

import { Defaults } from '../defaults';
import { MetaData } from './metaData';
import { DateReference } from './date';


/**
 * Enum for id reference format
 * @category Utils
 */
enum IdReferenceFormat {
    UUID = 'uuid',
    Name = 'name',
    String = 'string'
}

/**
 * Check if a string is a valid id reference format
 * @category Utils
 * @description If no format is provided, the default is used
 */
const isIdReferenceFormat = (format?: string | IdReferenceFormat): IdReferenceFormat => {
    if (Object.values(IdReferenceFormat).includes(format as IdReferenceFormat)) {
        return format as IdReferenceFormat;
    }
    else if (format === undefined) {
        return Defaults.idReferenceFormat;
    }
    throw new Error('Invalid id reference format');
}

/**
 * Generates a random id
 * @category Utils
 * @example    
 * const id = createRandomId("names")
 * console.log(id) // "johnny-zebra"
 */
const createRandomId = (overrideFormat?: string | IdReferenceFormat): string => {
    let nameFormat = isIdReferenceFormat(overrideFormat);

    switch (nameFormat) {
        case IdReferenceFormat.Name:
            return chance().first().toLowerCase() + '-' + chance().word({capitalize: false, syllables: 3});
        case IdReferenceFormat.UUID:
            return uuidv4();
        case IdReferenceFormat.String:
            return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        default:
            return uuidv4();
    }
}

/**
 * Interface for an id reference
 * @category Logging
 */
interface IIdReference {
    name: string;
    metadata: MetaData;

    toString: () => string;
}

/**
 * Id reference class
 * @category Utils
 */
class IdReference
    implements IIdReference
{
    public readonly name: string;
    public metadata: MetaData;

    /**
     * Create a new id reference
     * @example
     * const id = new IdReference({name: "johnny-zebra"})
     * console.log(id) // "johnny-zebra"
     *
     * @example
     * const id = new IdReference({metadata: new MetaData([["key", "value"]])})
     * console.log(id) // "johnny-zebra"
     */
    constructor({
        name,
        metadata,
        format
    }: {
        name?: string,
        metadata?: MetaData | Map<string, any>,
        format?: IdReferenceFormat | string
    } = {}) {
        this.name = name ? name : createRandomId(format);
        
        this.metadata = metadata ? metadata : new MetaData();
        this.metadata.set("created", new DateReference());
        if (!name) {
            this.metadata.set("format", format );
        }
    }

    public toString(): string {
        return this.name;
    }
}

export {
    IdReferenceFormat,
    isIdReferenceFormat,
    createRandomId,
    IIdReference,
    IdReference,
}