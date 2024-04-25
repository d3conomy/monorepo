import { circuitRelayTransport } from '@libp2p/circuit-relay-v2';
import { webSockets } from '@libp2p/websockets';
import { webTransport } from '@libp2p/webtransport';
import { tcp } from '@libp2p/tcp';
import { webRTC } from '@libp2p/webrtc';
import { createProcessOption, injectDefaultValues, mapProcessOptions } from '../process-interface/index.js';
const transportOptionsParams = [
    createProcessOption({
        name: 'enableWebSockets',
        description: 'Enable WebSockets',
        required: false,
        defaultValue: true
    }),
    createProcessOption({
        name: 'enableWebTransport',
        description: 'Enable WebTransport',
        required: false,
        defaultValue: true
    }),
    createProcessOption({
        name: 'enableTcp',
        description: 'Enable TCP',
        required: false,
        defaultValue: true
    }),
    createProcessOption({
        name: 'enableWebRTC',
        description: 'Enable WebRTC',
        required: false,
        defaultValue: false
    }),
    createProcessOption({
        name: 'enableCircuitRelayTransport',
        description: 'Enable Circuit Relay Transport',
        required: false,
        defaultValue: true
    }),
    createProcessOption({
        name: 'enableCircuitRelayTransportDiscoverRelays',
        description: 'Enable Circuit Relay Transport Discover Relays',
        required: false,
        defaultValue: 2
    })
];
const transports = ({ ...values } = {}) => {
    const injectedDefaultValues = injectDefaultValues({ options: transportOptionsParams, values });
    const { enableWebSockets, enableWebTransport, enableTcp, enableWebRTC, enableCircuitRelayTransport, enableCircuitRelayTransportDiscoverRelays } = mapProcessOptions(injectedDefaultValues);
    let transportOptions = new Array();
    if (enableWebSockets) {
        transportOptions.push(webSockets());
    }
    if (enableWebTransport) {
        transportOptions.push(webTransport());
    }
    if (enableTcp) {
        transportOptions.push(tcp());
    }
    if (enableWebRTC) {
        transportOptions.push(webRTC());
    }
    if (enableCircuitRelayTransport) {
        if (enableCircuitRelayTransportDiscoverRelays !== undefined &&
            enableCircuitRelayTransportDiscoverRelays !== null &&
            enableCircuitRelayTransportDiscoverRelays > 0) {
            transportOptions.push(circuitRelayTransport({
                discoverRelays: enableCircuitRelayTransportDiscoverRelays
            }));
        }
        else {
            transportOptions.push(circuitRelayTransport());
        }
    }
    return transportOptions;
};
export { transports, transportOptionsParams };
