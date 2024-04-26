import { expect } from 'chai';
import { libp2pOptionsParams } from '../src/process-libp2p/options.js';
describe('Process', () => {
    describe('ProcessOptions', () => {
        it('should be a map of IProcessOption', () => {
            expect(libp2pOptionsParams()).to.be.an.instanceOf(Array);
            // expect(libp2pOptionsParams()).to.be.an('map');
            // expect(libp2pOptionsParams().size).to.equal(49);
            // expect(libp2pOptionsParams().get('enableTcp')).to.be.true;
            // expect(libp2pOptionsParams().get('tcpPort')).to.deep.equal(0);
            // expect(libp2pOptionsParams().get('enableIp4')).to.deep.equal(true);
            // expect(libp2pOptionsParams().get('ip4Domain')).to.deep.equal('0.0.0.0');
        });
    });
});
