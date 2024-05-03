import { IdReferenceFormats, IdReferenceTypes } from './IdReferenceConstants.js';
/**
 * Check if the format is a valid IdReferenceFormat
 */
declare const isIdReferenceFormat: (format?: string) => IdReferenceFormats;
declare const isIdReferenceType: (type: string) => IdReferenceTypes;
/**
 * Create a random id
 */
declare const createRandomId: (format?: IdReferenceFormats | string) => string;
export { isIdReferenceFormat, isIdReferenceType, createRandomId };
//# sourceMappingURL=IdReferenceFunctions.d.ts.map