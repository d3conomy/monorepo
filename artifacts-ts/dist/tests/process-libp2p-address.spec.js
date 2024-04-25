import { expect } from 'chai';
import { listenAddressesConfig as listenAddresses } from '../src/process-libp2p/address.js';
describe('listenAddresses', () => {
    it('should throw an error if webRTCStarAddress is not provided', () => {
        expect(() => {
            let result = listenAddresses({
                enableWebRTCStar: true
            });
        }).to.throw('webrtcStarAddress must be provided');
    });
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
            webRTCStarAddress: '/dns4/signal.ipfs.trnkt.xyz/tcp/443/wss/p2p-webrtc-star/',
            enableCircuitRelayTransport: true,
            additionalMultiaddrs: ['/dns4/bootstrap.ipfs.trnkt.xyz/tcp/4001/p2p/additional-multiaddr-1']
        });
        expect(result.listen).to.deep.equal([
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
            '/dns4/signal.ipfs.trnkt.xyz/tcp/443/wss/p2p-webrtc-star/',
            '/dns4/bootstrap.ipfs.trnkt.xyz/tcp/4001/p2p/additional-multiaddr-1'
        ]);
    });
});
