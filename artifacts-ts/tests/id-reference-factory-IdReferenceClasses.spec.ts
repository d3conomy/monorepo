import { expect } from 'chai';
import { describe, it } from 'mocha';
import {
    IdReference,
    SystemId,
    MoonbaseId,
    PodBayId,
    PodId,
    PodProcessId,
    JobId
} from '../src/id-reference-factory/IdReferenceClasses.js';
import { MetaData } from '../src/id-reference-factory/IdReferenceMetadata.js';

describe('/src/id-reference-factory/IdReferenceClasses.js', () => {
    describe('IdReference', () => {
        it('should create an instance with default values', () => {
            const idReference = new IdReference();
            expect(idReference.name).to.be.a('string');
            expect(idReference.metadata).to.be.an('object');
        });

        it('should create an instance with provided values', () => {
            const name = 'testId';
            const metadata = new MetaData({
                createdBy: 'system:test',
                mapped: new Map<string, any>([
                    ['testKey', 'testValue']
                ])
            })
            const idReference = new IdReference({ name, metadata });
            expect(idReference.name).to.equal(name);
            expect(idReference.metadata).to.equal(metadata);
        });

        it('should have a toString method', () => {
            const idReference = new IdReference();
            expect(idReference.toString()).to.be.a('string');
        });
    });

    describe('SystemId', () => {
        it('should create an instance with default values', () => {
            const systemId = new SystemId();
            expect(systemId.name).to.be.a('string');
            expect(systemId.metadata).to.be.an('object');
        });

        // Add more tests for SystemId if needed
    });

    describe('MoonbaseId', () => {
        // Add tests for MoonbaseId

        it('should create an instance with default values', () => {
            const moonbaseId = new MoonbaseId({
                name: 'test',
                systemId: new SystemId(),
                metadata: new MetaData({
                    createdBy: 'system:test',
                    mapped: new Map<string, any>([
                        ['testKey', 'testValue']
                    ])
                })
            });
            expect(moonbaseId.name).to.be.a('string');
            expect(moonbaseId.metadata).to.be.an('object');
        });

        it('should create an instance with provided values', () => {
            const name = 'testId';
            const systemId = new SystemId();
            const metadata = new MetaData({
                createdBy: 'system:test',
                mapped: new Map<string, any>([
                    ['testKey', 'testValue']
                ])
            })
            const moonbaseId = new MoonbaseId({ name, systemId, metadata });
            expect(moonbaseId.name).to.equal(name);
            expect(moonbaseId.metadata).to.equal(metadata);
        });


    });

    describe('PodBayId', () => {
        const systemId = new SystemId();
        const moonbaseId = new MoonbaseId({ systemId });
        
        it('should create an instance with default values', () => {
            const podBayId = new PodBayId({
                name: 'test',
                moonbaseId: moonbaseId,
                metadata: new MetaData({
                    createdBy: 'system:test',
                    mapped: new Map<string, any>([
                        ['testKey', 'testValue']
                    ])
                })
            });
            expect(podBayId.name).to.be.a('string');
            expect(podBayId.metadata).to.be.an('object');
        });

        it('should create an instance with provided values', () => {
            const name = 'testId';
            const metadata = new MetaData({
                createdBy: 'system:test',
                mapped: new Map<string, any>([
                    ['testKey', 'testValue']
                ])
            })
            const podBayId = new PodBayId({ name, moonbaseId, metadata });
            expect(podBayId.name).to.equal(name);
            expect(podBayId.metadata).to.equal(metadata);
        });
    });

    describe('PodId', () => {
        // Add tests for PodId
    });

    describe('PodProcessId', () => {
        // Add tests for PodProcessId
    });

    describe('JobId', () => {
        // Add tests for JobId
    });
});
