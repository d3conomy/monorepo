import { expect } from 'chai';
import { MetaData } from '../src/id-reference-factory/IdReferenceMetadata.js';
describe('MetaData', () => {
    let metaData;
    beforeEach(() => {
        metaData = new MetaData();
    });
    it('should initialize with default values', () => {
        expect(metaData.created).to.be.an.instanceOf(Date);
        expect(metaData.updated).to.be.an.instanceOf(Date);
        expect(metaData.createdBy).to.equal('system');
        expect(metaData.updatedBy).to.equal('system');
    });
    it('should set and get values', () => {
        metaData.set('key1', 'value1');
        metaData.set('key2', 'value2');
        expect(metaData.get('key1')).to.equal('value1');
        expect(metaData.get('key2')).to.equal('value2');
    });
    it('should check if a key exists', () => {
        metaData.set('key1', 'value1');
        expect(metaData.has('key1')).to.be.true;
        expect(metaData.has('key2')).to.be.false;
    });
    it('should delete a key', () => {
        metaData.set('key1', 'value1');
        metaData.delete('key1');
        expect(metaData.has('key1')).to.be.false;
    });
    it('should clear all keys', () => {
        metaData.set('key1', 'value1');
        metaData.set('key2', 'value2');
        metaData.clear();
        expect(metaData.keys()).to.be.empty;
    });
    it('should update a value', () => {
        metaData.set('key1', 'value1');
        metaData.update({ key: 'key1', value: 'updatedValue', updatedBy: 'user1' });
        expect(metaData.get('key1')).to.equal('updatedValue');
        expect(metaData.updatedBy).to.equal('user1');
    });
    it('should return keys', () => {
        metaData.set('key1', 'value1');
        metaData.set('key2', 'value2');
        expect(metaData.keys()).to.deep.equal(['created', 'updated', 'createdBy', 'updatedBy', 'key1', 'key2']);
    });
    it('should return values', () => {
        metaData.set('key1', 'value1');
        metaData.set('key2', 'value2');
        expect(metaData.values()).to.deep.equal([metaData.created, metaData.updated, metaData.createdBy, metaData.updatedBy, 'value1', 'value2']);
    });
    it('should return entries', () => {
        metaData.set('key1', 'value1');
        metaData.set('key2', 'value2');
        expect(metaData.entries()).to.deep.equal([
            ['created', metaData.created],
            ['updated', metaData.updated],
            ['createdBy', metaData.createdBy],
            ['updatedBy', metaData.updatedBy],
            ['key1', 'value1'],
            ['key2', 'value2']
        ]);
    });
    it('should iterate over key-value pairs', () => {
        metaData.set('key1', 'value1');
        metaData.set('key2', 'value2');
        const keys = [];
        const values = [];
        metaData.forEach((key, value) => {
            keys.push(key);
            values.push(value);
        });
        expect(keys).to.deep.equal(['created', 'updated', 'createdBy', 'updatedBy', 'key1', 'key2']);
        expect(values).to.deep.equal([metaData.created, metaData.updated, metaData.createdBy, metaData.updatedBy, 'value1', 'value2']);
    });
    it('should convert to JSON', () => {
        metaData.set('key1', 'value1');
        metaData.set('key2', 'value2');
        const json = metaData.toJSON();
        expect(json).to.be.a('string');
        const jsonObject = JSON.parse(json); //
        console.log(jsonObject);
    });
    it('should convert to Map', () => {
        metaData.set('key1', 'value1');
        metaData.set('key2', 'value2');
        const map = metaData.toMap();
        expect(map).to.be.an.instanceOf(Map);
        expect([...map]).to.deep.equal([
            ['created', metaData.created],
            ['updated', metaData.updated],
            ['createdBy', metaData.createdBy],
            ['updatedBy', metaData.updatedBy],
            ['key1', 'value1'],
            ['key2', 'value2']
        ]);
    });
    it('should parse from JSON', () => {
        const json = JSON.stringify({
            created: '2022-01-01T00:00:00.000Z',
            updated: '2022-01-02T00:00:00.000Z',
            createdBy: 'user1',
            updatedBy: 'user2',
            key1: 'value1',
            key2: 'value2'
        });
        metaData.fromJSON(json);
        expect(metaData.createdBy).to.equal('user1');
        expect(metaData.updatedBy).to.equal('user2');
        expect(metaData.get('key1')).to.equal('value1');
        expect(metaData.get('key2')).to.equal('value2');
    });
    it('should parse from Map', () => {
        const map = new Map([
            ['created', new Date('2022-01-01T00:00:00.000Z')],
            ['updated', new Date('2022-01-02T00:00:00.000Z')],
            ['createdBy', 'user1'],
            ['updatedBy', 'user2'],
            ['key1', 'value1'],
            ['key2', 'value2']
        ]);
        metaData.fromMap(map);
        expect(metaData.createdBy).to.equal('user1');
        expect(metaData.updatedBy).to.equal('user2');
        expect(metaData.get('key1')).to.equal('value1');
        expect(metaData.get('key2')).to.equal('value2');
    });
});
