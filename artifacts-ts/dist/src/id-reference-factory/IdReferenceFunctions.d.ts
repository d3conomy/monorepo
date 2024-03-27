import { IdReferenceFormats } from './IdReferenceConstants.js';
/**
 * Check if the format is a valid IdReferenceFormat
 */
declare const isIdReferenceFormat: (format?: string) => IdReferenceFormats;
/**
 * Create a random id
 */
declare const createRandomId: (format?: IdReferenceFormats | string) => string;
export { isIdReferenceFormat, createRandomId };
//# sourceMappingURL=IdReferenceFunctions.d.ts.map