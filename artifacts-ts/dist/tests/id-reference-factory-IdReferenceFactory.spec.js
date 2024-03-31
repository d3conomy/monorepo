import { expect } from 'chai';
import { IdReferenceFactory } from '../src/id-reference-factory/IdReferenceFactory.js';
describe('IdReferenceFactory', () => {
    let idReferenceFactory;
    beforeEach(() => {
        idReferenceFactory = new IdReferenceFactory();
    });
    afterEach(() => {
        idReferenceFactory.deleteAllIdReferences();
    });
    it('should create a new IdReference', () => {
        const idReference = idReferenceFactory.createIdReference({
            name: 'testId',
            type: 'SYSTEM',
        });
        expect(idReference).to.exist;
        expect(idReference.name).to.equal('testId');
        expect(idReference.metadata.get('type')).to.equal('SYSTEM');
    });
    it('should throw an error when creating an IdReference with an existing name', () => {
        const idRef = idReferenceFactory.createIdReference({
            name: 'testId',
            type: 'SYSTEM',
        });
        const idRef2 = idReferenceFactory.createIdReference({
            name: 'testId',
            type: 'SYSTEM',
        });
        expect(idRef2.name).to.not.equal('testId');
    });
    it('should get an existing IdReference by name', () => {
        const idReference = idReferenceFactory.createIdReference({
            name: 'testId',
            type: 'SYSTEM',
        });
        const retrievedIdReference = idReferenceFactory.getIdReference('testId');
        expect(retrievedIdReference).to.exist;
        expect(retrievedIdReference).to.equal(idReference);
    });
    it('should return undefined when getting a non-existing IdReference by name', () => {
        const retrievedIdReference = idReferenceFactory.getIdReference('nonExistingId');
        expect(retrievedIdReference).to.be.undefined;
    });
    it('should get all IdReferences', () => {
        idReferenceFactory.createIdReference({
            name: 'id1',
            type: 'SYSTEM',
        });
        idReferenceFactory.createIdReference({
            name: 'id2',
            type: 'MOONBASE',
        });
        const allIdReferences = idReferenceFactory.getAllIdReferences();
        expect(allIdReferences).to.have.lengthOf(2);
        expect(allIdReferences[0].name).to.equal('id1');
        expect(allIdReferences[1].name).to.equal('id2');
    });
    it('should get IdReferences by type', () => {
        const systemId = idReferenceFactory.createIdReference({
            name: 'id1',
            type: 'SYSTEM',
        });
        // idReferenceFactory.createIdReference({
        //     name: 'id2',
        //     type: 'SYSTEM',
        // });
        idReferenceFactory.createIdReference({
            name: 'id3',
            type: 'MOONBASE',
            dependsOn: systemId
        });
        const systemIdReferences = idReferenceFactory.getIdReferencesByType('SYSTEM');
        expect(systemIdReferences).to.have.lengthOf(1);
        expect(systemIdReferences[0].name).to.equal('id1');
    });
    it('should delete an existing IdReference by name', () => {
        idReferenceFactory.createIdReference({
            name: 'testId',
            type: 'SYSTEM',
        });
        idReferenceFactory.deleteIdReference('testId');
        const retrievedIdReference = idReferenceFactory.getIdReference('testId');
        expect(retrievedIdReference).to.be.undefined;
    });
    it('should delete all IdReferences', () => {
        const sytemId = idReferenceFactory.createIdReference({
            name: 'id1',
            type: 'SYSTEM',
        });
        idReferenceFactory.createIdReference({
            name: 'id2',
            type: 'MOONBASE',
            dependsOn: sytemId
        });
        idReferenceFactory.deleteAllIdReferences();
        const allIdReferences = idReferenceFactory.getAllIdReferences();
        expect(allIdReferences).to.have.lengthOf(0);
    });
});
