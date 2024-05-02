import { circuitRelayTransport } from '@libp2p/circuit-relay-v2'
import { webSockets } from '@libp2p/websockets'
import { webTransport } from '@libp2p/webtransport'
import { tcp } from '@libp2p/tcp'
import { webRTC } from '@libp2p/webrtc'
import { InstanceOption, InstanceOptions, createOptionsList } from '../container/options.js'

const transportOptions = (): InstanceOptions => {
    return new InstanceOptions({options: [
        {
            name: 'enableWebSockets',
            description: 'Enable WebSockets',
            required: false,
            defaultValue: true
        } as InstanceOption<boolean>,
        {
            name: 'enableWebTransport',
            description: 'Enable WebTransport',
            required: false,
            defaultValue: true
        } as InstanceOption<boolean>,
        {
            name: 'enableTcp',
            description: 'Enable TCP',
            required: false,
            defaultValue: true
        } as InstanceOption<boolean>,
        {
            name: 'enableWebRTC',
            description: 'Enable WebRTC',
            required: false,
            defaultValue: false
        } as InstanceOption<boolean>,
        {
            name: 'enableCircuitRelayTransport',
            description: 'Enable Circuit Relay Transport',
            required: false,
            defaultValue: true
        } as InstanceOption<boolean>,
        {
            name: 'enableCircuitRelayTransportDiscoverRelays',
            description: 'Enable Circuit Relay Transport Discover Relays',
            required: false,
            defaultValue: 2
        } as InstanceOption<number>
    ]})
}

const transports = (options: InstanceOptions): Array<any> => {

    const {
        enableWebSockets,
        enableWebTransport,
        enableTcp,
        enableWebRTC,
        enableCircuitRelayTransport,
        enableCircuitRelayTransportDiscoverRelays
    } = options.toParams()


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

