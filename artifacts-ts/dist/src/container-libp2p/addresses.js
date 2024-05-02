import { InstanceOptions } from '../container/options.js';
const setListenAddresses = (multiaddrs) => {
    return {
        listen: multiaddrs.map((addr) => addr.toString())
    };
};
const listenAddressesOptions = () => {
    return new InstanceOptions({ options: [
            {
                name: 'enableTcp',
                description: 'Enable TCP transport',
                defaultValue: true
            },
            {
                name: 'tcpPort',
                description: 'TCP port',
                defaultValue: 0
            },
            {
                name: 'enableIp4',
                description: 'Enable IPv4 transport',
                defaultValue: true
            },
            {
                name: 'ip4Domain',
                description: 'IPv4 domain',
                defaultValue: '0.0.0.0'
            },
            {
                name: 'enableUdp',
                description: 'Enable UDP transport',
                defaultValue: true
            },
            {
                name: 'udpPort',
                description: 'UDP port',
                defaultValue: 0
            },
            {
                name: 'enableIp6',
                description: 'Enable IPv6 transport',
                defaultValue: true
            },
            {
                name: 'ip6Domain',
                description: 'IPv6 domain',
                defaultValue: '::'
            },
            {
                name: 'enableQuicv1',
                description: 'Enable QUIC transport',
                defaultValue: true
            },
            {
                name: 'enableWebTransport',
                description: 'Enable WebTransport transport',
                defaultValue: true
            },
            {
                name: 'enableWebSockets',
                description: 'Enable WebSockets transport',
                defaultValue: true
            },
            {
                name: 'enableWebRTC',
                description: 'Enable WebRTC transport',
                defaultValue: true
            },
            {
                name: 'enableWebRTCStar',
                description: 'Enable WebRTC Star transport',
                defaultValue: false
            },
            {
                name: 'webRTCStarAddress',
                description: 'WebRTC Star address',
                required: false
            },
            {
                name: 'enableCircuitRelayTransport',
                description: 'Enable Circuit Relay transport',
                defaultValue: true
            },
            {
                name: 'additionalMultiaddrs',
                description: 'Additional multiaddrs',
                required: false
            }
        ] });
};
const listenAddresses = (options) => {
    options.injectDefaults(listenAddressesOptions());
    const { enableTcp, tcpPort, enableIp4, ip4Domain, enableUdp, udpPort, enableIp6, ip6Domain, enableQuicv1, enableWebTransport, enableWebSockets, enableWebRTC, enableWebRTCStar, webRTCStarAddress, enableCircuitRelayTransport, additionalMultiaddrs } = options.toParams();
    const listenAddresses = [];
    if (enableIp4) {
        if (enableTcp) {
            listenAddresses.push(`/ip4/${ip4Domain}/tcp/${tcpPort}`);
        }
        if (enableUdp) {
            listenAddresses.push(`/ip4/${ip4Domain}/udp/${udpPort}`);
        }
        if (enableQuicv1 && enableTcp) {
            listenAddresses.push(`/ip4/${ip4Domain}/udp/${udpPort}/quic-v1`);
        }
        if (enableWebTransport && enableUdp) {
            listenAddresses.push(`/ip4/${ip4Domain}/udp/${udpPort}/quic-v1/webtransport`);
        }
        if (enableWebSockets && enableTcp) {
            listenAddresses.push(`/ip4/${ip4Domain}/tcp/${tcpPort}/ws/`);
        }
    }
    if (enableIp6) {
        if (enableTcp) {
            listenAddresses.push(`/ip6/${ip6Domain}/tcp/${tcpPort}`);
        }
        if (enableUdp) {
            listenAddresses.push(`/ip6/${ip6Domain}/udp/${udpPort}`);
        }
        if (enableQuicv1 && enableTcp) {
            listenAddresses.push(`/ip6/${ip6Domain}/udp/${udpPort}/quic-v1`);
        }
        if (enableWebTransport && enableUdp) {
            listenAddresses.push(`/ip6/${ip6Domain}/udp/${udpPort}/quic-v1/webtransport`);
        }
        if (enableWebSockets && enableTcp) {
            listenAddresses.push(`/ip6/${ip6Domain}/tcp/${tcpPort}/ws/`);
        }
    }
    if (enableWebRTC) {
        listenAddresses.push('/webrtc');
    }
    // if (enableCircuitRelayTransport) {
    //     listenAddresses.push('/p2p-circuit')
    // }
    if (enableWebRTCStar === true) {
        if (webRTCStarAddress === undefined || webRTCStarAddress === null) {
            throw new Error('webrtcStarAddress must be provided');
        }
        listenAddresses.push(webRTCStarAddress.toString());
    }
    if (additionalMultiaddrs ? additionalMultiaddrs?.length > 0 : false) {
        additionalMultiaddrs?.forEach((addr) => {
            if (typeof addr === 'string') {
                listenAddresses.push(addr);
            }
            else {
                listenAddresses.push(addr.toString());
            }
        });
    }
    return { listen: listenAddresses };
};
export { setListenAddresses, listenAddresses as listenAddressesConfig, listenAddressesOptions };
