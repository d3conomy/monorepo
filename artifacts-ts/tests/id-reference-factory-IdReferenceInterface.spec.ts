import { expect } from 'chai';
import { IdReferenceFormats, IdReferenceTypes } from '../src/id-reference-factory/IdReferenceConstants.js';
import { IdReferenceFactory } from '../src/id-reference-factory/IdReferenceFactory.js'; 
import { IIdReferenceFactory } from '../src/id-reference-factory/IdReferenceInterfaces.js';
import { IMetaData } from '../src/id-reference-factory/IdReferenceInterfaces.js';
import { MetaData } from '../src/id-reference-factory/IdReferenceMetadata.js';

describe('IIdReferenceFactory', () => {
    let idReferenceFactory: IIdReferenceFactory;

    beforeEach(() => {
        idReferenceFactory = new IdReferenceFactory();
    });

    afterEach(() => {
        idReferenceFactory.deleteAllIdReferences();
    });

    it('should create a new id reference with the specified name', () => {
        const name = 'testIdReference';
        const idReference = idReferenceFactory.createIdReference({name, type: IdReferenceTypes.PROCESS});
        expect(idReference.name).to.equal(name);
    });

    it('should create a new id reference with the specified metadata', () => {
        const name = 'testIdReference';
        const metadata: IMetaData = new MetaData({mapped: new Map<string, any>([['key', 'value']])});
        const idReference = idReferenceFactory.createIdReference({name, type: IdReferenceTypes.PROCESS, metadata});
        expect(idReference.metadata).to.deep.equal(metadata);
    });

    it('should create a new id reference with the specified format', () => {
        const name = 'testIdReference';
        const format = IdReferenceFormats.UUID;
        const idReference = idReferenceFactory.createIdReference({type: IdReferenceTypes.POD, format});
        expect(idReference.toString()).to.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    });

    it('should return the created id reference by name', () => {
        const name = 'testIdReference';
        const idReference = idReferenceFactory.createIdReference({name, type: IdReferenceTypes.POD});
        const retrievedIdReference = idReferenceFactory.getIdReference(name);
        expect(retrievedIdReference).to.equal(idReference);
    });

    it('should return undefined when getting a non-existent id reference', () => {
        const retrievedIdReference = idReferenceFactory.getIdReference('nonExistentIdReference');
        expect(retrievedIdReference).to.be.undefined;
    });

    it('should delete the specified id reference', () => {
        const name = 'testIdReference';
        const idReference = idReferenceFactory.createIdReference({name, type: IdReferenceTypes.POD});
        idReferenceFactory.deleteIdReference(name);
        const retrievedIdReference = idReferenceFactory.getIdReference(name);
        expect(retrievedIdReference).to.be.undefined;
    });

    it('should delete all id references', () => {
        idReferenceFactory.createIdReference({name: 'testIdReference1', type: IdReferenceTypes.POD});
        idReferenceFactory.createIdReference({name: 'testIdReference2', type: IdReferenceTypes.POD});
        idReferenceFactory.deleteAllIdReferences();
        expect(idReferenceFactory.getIdReference('testIdReference1')).to.be.undefined;
    });
});
