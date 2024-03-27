import { v4 as uuidv4 } from 'uuid';
import chance from 'chance';

import { IdReferenceFormats } from '../../constants/IdReferenceFormats';


/**
 * Generates a random id
 * @category Utils
 * @example    
 * const id = createRandomId("names")
 * console.log(id) // "johnny-zebra"
 */
const createRandomId = (overrideFormats?: string | IdReferenceFormats): string => {
    let nameFormat = isIdReferenceFormat(overrideFormats);

    switch (nameFormat) {
        case IdReferenceFormats.Name:
            return chance().first().toLowerCase() + '-' + chance().word({capitalize: false, syllables: 3});
        case IdReferenceFormats.UUID:
            return uuidv4();
        case IdReferenceFormats.String:
            return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        default:
            return uuidv4();
    }
}

/**
 * Checks if the format is an id reference format
 * @category Utils
 * @example    
 * const isIdReferenceFormat = isIdReferenceFormat("names")
 * console.log(isIdReferenceFormat) // false
 * @example
 * const isIdReferenceFormat = isIdReferenceFormat("name")
 * console.log(isIdReferenceFormat) // true
 */
const isIdReferenceFormat = (format: string | IdReferenceFormats): boolean => {
    return Object.values(IdReferenceFormats).includes(format as IdReferenceFormats);
}

const checkIdReferenceFormat = (format: string | IdReferenceFormats): IdReferenceFormats => {
    if (!isIdReferenceFormat(format)) {
        return Defaults.IdReferenceFormat;
    }
    return format as IdReferenceFormats;
}




export {
    createRandomId,
    isIdReferenceFormat,
}