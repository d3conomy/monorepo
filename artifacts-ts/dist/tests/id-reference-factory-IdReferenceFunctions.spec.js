import { expect } from 'chai';
import { IdReferenceFormats } from '../src/id-reference-factory/IdReferenceConstants.js';
import { isIdReferenceFormat, createRandomId } from '../src/id-reference-factory/IdReferenceFunctions.js';
describe('isIdReferenceFormat', () => {
    it('should return the format if it is a valid IdReferenceFormat', () => {
        expect(isIdReferenceFormat(IdReferenceFormats.NAME)).to.equal(IdReferenceFormats.NAME);
        expect(isIdReferenceFormat(IdReferenceFormats.UUID)).to.equal(IdReferenceFormats.UUID);
        expect(isIdReferenceFormat(IdReferenceFormats.STRING)).to.equal(IdReferenceFormats.STRING);
    });
    it('should throw an error if the format is invalid', () => {
        expect(() => isIdReferenceFormat('invalid')).to.throw('Invalid format: invalid');
    });
});
describe('createRandomId', () => {
    it('should create a random id with the default format', () => {
        const id = createRandomId();
        expect(id).to.be.a('string');
    });
    it('should create a random id with the specified format', () => {
        const id = createRandomId(IdReferenceFormats.UUID);
        expect(id).to.be.a('string');
        expect(id).to.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    });
    it('should throw an error if the format is invalid', () => {
        expect(() => createRandomId('invalid')).to.throw('Invalid format: invalid');
    });
});
