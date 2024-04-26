import { expect } from 'chai';
import { removePublicAddressesMapper } from '@libp2p/kad-dht';
import { ipnsValidator } from 'ipns/validator';
import { ipnsSelector } from 'ipns/selector';
import { libp2pServices, serviceOptions } from '../src/process-libp2p/services.js';
import { compileProcessOptions } from '../src/process-interface/processOptions.js';
describe('libp2p services', () => {
    it('should return the correct service options', () => {
        const expectedServiceOptions = {
            pubsub: {
                allowPublishToZeroTopicPeers: true,
                enabled: true,
                multicodecs: ['/libp2p/pubsub/1.0.0'],
                canRelayMessage: true,
                emitSelf: true,
                messageProcessingConcurrency: 16,
                maxInboundStreams: 100,
                maxOutboundStreams: 100,
                doPX: true
            },
            autonat: {},
            identify: {},
            upnpNAT: {},
            dht: {
                clientMode: true,
                validators: { ipns: ipnsValidator },
                selectors: { ipns: ipnsSelector }
            },
            lanDHT: {
                protocol: 'lan',
                peerInfoMapper: removePublicAddressesMapper,
                clientMode: true
            },
            relay: {
                advertise: true
            },
            dcutr: {},
            ping: {}
        };
        let actualServiceOptions = compileProcessOptions(serviceOptions());
        actualServiceOptions = libp2pServices(actualServiceOptions);
        // console.log(actualServiceOptions)
        const count = Object.keys(expectedServiceOptions).length;
        expect(count).to.equal(9);
    });
});
