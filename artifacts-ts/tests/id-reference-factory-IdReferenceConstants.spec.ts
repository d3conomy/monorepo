import { expect } from 'chai';
import { IdReferenceFormats, IdReferenceTypes } from '../src/id-reference-factory/IdReferenceConstants.js';

describe('IdReferenceFormats', () => {
    it('should have the correct values', () => {
        expect(IdReferenceFormats.UUID).to.equal('uuid');
        expect(IdReferenceFormats.NAME).to.equal('name');
        expect(IdReferenceFormats.STRING).to.equal('string');
        expect(IdReferenceFormats.CUSTOM).to.equal('custom');
    });
});

describe('IdReferenceTypes', () => {
    it('should have the correct values', () => {
        expect(IdReferenceTypes.SYSTEM).to.equal('system');
        expect(IdReferenceTypes.MOONBASE).to.equal('moonbase');
        expect(IdReferenceTypes.PODBAY).to.equal('podbay');
        expect(IdReferenceTypes.POD).to.equal('pod');
        expect(IdReferenceTypes.PROCESS).to.equal('process');
        expect(IdReferenceTypes.JOB).to.equal('job');
    });
});
