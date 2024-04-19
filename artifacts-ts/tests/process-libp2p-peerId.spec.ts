import { expect } from 'chai';
import { libp2pPeerId, peerIdOptions } from '../src/process-libp2p/peerId.js';
import { createEd25519PeerId } from '@libp2p/peer-id-factory';
import { peerIdFromString, peerIdFromPeerId, } from '@libp2p/peer-id';

describe('libp2pPeerId', () => {
    it('should create a PeerId from a string', async () => {
        const id = '12D3KooWJ93mLfEhgc5DsWy5fy5Sjqr4xR9bp35EdxEKRFEb4AbK';
        const peerId = await libp2pPeerId({ id });
        expect(peerId).to.exist;
        // expect(peerId).to.be.an.instanceOf('oject');
        expect(peerId?.toString()).to.equal(id);
    });

    it('should create a PeerId from an existing PeerId', async () => {
        const existingPeerId = await createEd25519PeerId();
        const peerId = await libp2pPeerId({ id: existingPeerId });
        expect(peerId).to.exist;
        // expect(peerId).to.be.an.instanceOf('object');
        expect(peerId?.toString()).to.equal(existingPeerId.toString());
    });

    it('should create a new Ed25519 PeerId if no id is provided', async () => {
        const peerId = await libp2pPeerId();
        expect(peerId).to.exist;
        // expect(peerId).to.be.an.instanceOf('object');
        expect(peerId?.privateKey).to.exist;
    });

    // Add more test cases as needed
});

describe('peerIdOptions', () => {
    it('should have the correct properties', () => {
        const option = peerIdOptions[0];
        expect(option).to.have.property('name', 'id');
        expect(option).to.have.property('description', 'PeerId');
        expect(option).to.have.property('required', false);
    });

    // Add more test cases as needed
});
