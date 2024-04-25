import { expect } from 'chai';
import { Libp2pOptions } from 'libp2p';
import { IProcessOption, IProcessOptionsList, Process, ProcessCommands, ProcessOptions, createProcessOption } from '../src/process-interface/index.js';
import { listenAddressesConfig, listenAddressesOptions } from '../src/process-libp2p/address.js';
import { bootstrapOptions } from '../src/process-libp2p/bootstrap.js';
import { connectionEncryption, connectionEncryptionOptions } from '../src/process-libp2p/connectionEncryption.js';
import { connectionGater, connectionGaterOptions } from '../src/process-libp2p/connectionGater.js';
import { connectionProtector, connectionProtectorOptions } from '../src/process-libp2p/connectionProtector.js';
import { peerDiscovery, peerDiscoveryOptions } from '../src/process-libp2p/peerDiscovery.js';
import { libp2pPeerId, peerIdOptions } from '../src/process-libp2p/peerId.js';
import { libp2pServices, serviceOptions } from '../src/process-libp2p/services.js';
import { streamMuxerOptions, streamMuxers } from '../src/process-libp2p/streamMuxers.js';

import { convertListToMap, converMaptoList, libp2pOptionsParams  } from '../src/process-libp2p/options.js';


describe('Process', () => {

    describe('ProcessOptions', () => {
        it('should be a map of IProcessOption', () => {
            expect(libp2pOptionsParams()).to.be.an('map');
            expect(libp2pOptionsParams().size).to.equal(48);
            expect(libp2pOptionsParams().get('enableTcp')).to.be.true;
            expect(libp2pOptionsParams().get('tcpPort')).to.deep.equal(0);
            expect(libp2pOptionsParams().get('enableIp4')).to.deep.equal(true);
            expect(libp2pOptionsParams().get('ip4Domain')).to.deep.equal('0.0.0.0');
        });
    })
});


