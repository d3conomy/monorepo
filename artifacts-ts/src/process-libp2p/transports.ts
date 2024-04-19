import { circuitRelayTransport } from '@libp2p/circuit-relay-v2'
import { webSockets } from '@libp2p/websockets'
import { webTransport } from '@libp2p/webtransport'
import { tcp } from '@libp2p/tcp'
import { webRTC } from '@libp2p/webrtc'
import { IProcessOptions } from '../process-interface'

const transportOptions: IProcessOptions = [
    {
        name: 'enableWebSockets',
        description: 'Enable WebSockets',
        required: false,
        defaultValue: true
    },
    {
        name: 'enableWebTransport',
        description: 'Enable WebTransport',
        required: false,
        defaultValue: true
    },
    {
        name: 'enableTcp',
        description: 'Enable TCP',
        required: false,
        defaultValue: true
    },
    {
        name: 'enableWebRTC',
        description: 'Enable WebRTC',
        required: false,
        defaultValue: false
    },
    {
        name: 'enableCircuitRelayTransport',
        description: 'Enable Circuit Relay Transport',
        required: false,
        defaultValue: true
    },
    {
        name: 'enableCircuitRelayTransportDiscoverRelays',
        description: 'Enable Circuit Relay Transport Discover Relays',
        required: false,
        defaultValue: 2
    }
]

const transports = ({
    enableWebSockets = true,
    enableWebTransport = true,
    enableTcp = true,
    enableWebRTC = false,
    enableCircuitRelayTransport = true,
    enableCircuitRelayTransportDiscoverRelays = 2,
} : {
    enableWebSockets?: boolean,
    enableWebTransport?: boolean,
    enableTcp?: boolean,
    enableWebRTC?: boolean,
    enableCircuitRelayTransport?: boolean,
    enableCircuitRelayTransportDiscoverRelays?: number
} = {}): Array<any> => {
    let transportOptions: Array<any> = new Array<any>()

    if (enableWebSockets) {
        transportOptions.push(webSockets())
    }

    if (enableWebTransport) {
        transportOptions.push(webTransport())
    }

    if (enableTcp) {
        transportOptions.push(tcp())
    }

    if (enableWebRTC) {
        transportOptions.push(webRTC())
    }

    if (enableCircuitRelayTransport) {
        if (
            enableCircuitRelayTransportDiscoverRelays !== undefined &&
            enableCircuitRelayTransportDiscoverRelays !== null &&
            enableCircuitRelayTransportDiscoverRelays > 0
        ) {
            transportOptions.push(circuitRelayTransport({
                discoverRelays: enableCircuitRelayTransportDiscoverRelays
            }))
        } else {
            transportOptions.push(circuitRelayTransport())
        }
    }

    return transportOptions
};

export {
    transports,
    transportOptions
}

