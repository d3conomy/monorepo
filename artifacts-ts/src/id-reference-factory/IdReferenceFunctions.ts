import { v4 as uuidv4 } from 'uuid';
import chance from 'chance';

import { IdReferenceFormats, IdReferenceTypes } from './IdReferenceConstants.js';

/**
 * Check if the format is a valid IdReferenceFormat
 */
const isIdReferenceFormat = (
    format?: string
): IdReferenceFormats => {
    if (Object.values(IdReferenceFormats).includes(format as IdReferenceFormats)) {
        return format as IdReferenceFormats;
    }
    throw new Error(`Invalid format: ${format}`);
}

const isIdReferenceType = (type: string): IdReferenceTypes => {
    if (Object.values(IdReferenceTypes).includes(type as IdReferenceTypes)) {
        return type as IdReferenceTypes;
    }
    throw new Error(`Invalid IdReference type: ${type}`);
}

/**
 * Create a random id
 */
const createRandomId = (
    format?: IdReferenceFormats | string
): string => {
    format = format ? isIdReferenceFormat(format) : IdReferenceFormats.NAME;

    switch (format) {
        case IdReferenceFormats.NAME:
            return chance().first().toLowerCase() + '-' + chance().word({capitalize: false, syllables: 3});
        case IdReferenceFormats.UUID:
            return uuidv4();
        case IdReferenceFormats.STRING:
            return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        default:
            throw new Error(`Invalid format: ${format}`);
        }
}

export {
    isIdReferenceFormat,
    isIdReferenceType,
    createRandomId
}
