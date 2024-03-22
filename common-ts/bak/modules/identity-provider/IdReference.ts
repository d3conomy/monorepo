import { IdReferenceFormats } from "../../constants/IdReferenceFormats";
import { createRandomId } from "../../methods/utilities/ids";
import { IMetaData, IIdReference } from "../../interfaces/IdReference";
import { DateReference } from "../date";
import { Defaults } from "../../constants/Defaults";

class MetaData {
    [key: string]: any;
    constructor(data?: IMetaData) {
        Object.assign(this, data);
    }
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
        format?: IdReferenceFormats | string
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
    
    /**
    * Check if a string is a valid id reference format
    * @category Utils
    * @description If no format is provided, the default is used
    */
    public static isIdReferenceFormat = (format?: string | IdReferenceFormats): IdReferenceFormats => {
       if (Object.values(IdReferenceFormats).includes(format as IdReferenceFormats)) {
           return format as IdReferenceFormats;
       }
       else if (format === undefined) {
           return Defaults.idReferenceFormat;
       }
       throw new Error('Invalid id reference format');
   }
}

export {
    IdReference
}