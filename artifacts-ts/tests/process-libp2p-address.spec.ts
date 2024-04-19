import { expect } from 'chai';

import { listenAddressesConfig as listenAddresses } from '../src/process-libp2p/address.js';

describe('listenAddresses', () => {
    it('should return an array of listen addresses', () => {
        const result = listenAddresses({
            enableTcp: true,
            tcpPort: 8080,
            enableIp4: true,
            ip4Domain: '0.0.0.0',
            enableUdp: true,
            udpPort: 9090,
            enableIp6: true,
            ip6Domain: '::',
            enableQuicv1: true,
            enableWebTransport: true,
            enableWebSockets: true,
            enableWebRTC: true,
            enableWebRTCStar: true,
            webRTCStarAddress: 'webrtc-star-address',
            enableCircuitRelayTransport: true,
            additionalMultiaddrs: ['additional-multiaddr-1', 'additional-multiaddr-2']
        });

        expect(result).to.deep.equal({
            listen: [
                '/ip4/0.0.0.0/tcp/8080',
                '/ip4/0.0.0.0/udp/9090',
                '/ip4/0.0.0.0/udp/9090/quic-v1',
                '/ip4/0.0.0.0/udp/9090/quic-v1/webtransport',
                '/ip4/0.0.0.0/tcp/8080/ws/',
                '/ip6/::/tcp/8080',
                '/ip6/::/udp/9090',
                '/ip6/::/udp/9090/quic-v1',
                '/ip6/::/udp/9090/quic-v1/webtransport',
                '/ip6/::/tcp/8080/ws/',
                '/webrtc',
                'webrtc-star-address',
                'additional-multiaddr-1',
                'additional-multiaddr-2'
            ]
        });
    });

    it('should throw an error if webRTCStarAddress is not provided', () => {
        expect(() => {
            listenAddresses({
                enableWebRTCStar: true
            });
        }).to.throw('webrtcStarAddress must be provided');
    });
});

