import { expect } from 'chai';
import { MemoryDatastore } from 'datastore-core';
import { MemoryBlockstore } from 'blockstore-core';
import { LevelBlockstore } from 'blockstore-level';
import { IpfsOptions, ipfsOptions } from '../src/process-ipfs-helia/options.js'

describe('IpfsOptions', () => {
    it('should create an instance with default values', () => {
        const options = new IpfsOptions();
        expect(options.libp2p).to.be.undefined;
        expect(options.datastore).to.be.an.instanceOf(MemoryDatastore);
        expect(options.blockstore).to.be.an.instanceOf(MemoryBlockstore);
        expect(options.start).to.be.false;
    });

    it('should create an instance with custom values', () => {
        const customValues = {
            libp2p: {}, // Add your custom libp2p object here
            datastore: new MemoryDatastore(),
            blockstore: new LevelBlockstore('path/to/blockstore'),
            start: true,
        };
        const options = new IpfsOptions(customValues);
        expect(options.libp2p).to.deep.equal(customValues.libp2p);
        expect(options.datastore).to.equal(customValues.datastore);
        expect(options.blockstore).to.equal(customValues.blockstore);
        expect(options.start).to.equal(customValues.start);
    });

    // Add more test cases as needed
});

describe('ipfsOptions', () => {
    it('should return an array of process options', () => {
        const options = ipfsOptions();
        expect(options).to.be.an('array');
        expect(options).to.have.lengthOf(5);
        // Add more assertions for each process option
    });
});
