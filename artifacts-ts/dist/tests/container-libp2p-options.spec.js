import { expect } from 'chai';
import { createLibp2pOptions } from '../src/container-libp2p/options.js';
describe('Libp2pOptions', () => {
    describe('createSubProcesses', () => {
        it('should create libp2p options with default options', async () => {
            const libp2pOptions = await createLibp2pOptions();
            console.log(libp2pOptions);
            expect(libp2pOptions.start).to.equal(false);
            // expect(libp2pOptions.addresses?.listen).to.deep.equal([]);
            // expect(libp2pOptions.connectionEncryption).to.deep.equal([]);
            // expect(libp2pOptions.connectionGater).to.be.undefined;
            // expect(libp2pOptions.connectionProtector).to.be.undefined;
            // expect(libp2pOptions.peerDiscovery).to.be.undefined;
            // expect(libp2pOptions.peerId).to.be.undefined;
            // expect(libp2pOptions.services).to.deep.equal([]);
            // expect(libp2pOptions.streamMuxers).to.deep.equal([]);
            // expect(libp2pOptions.transports).to.deep.equal([]);
        });
    });
});
