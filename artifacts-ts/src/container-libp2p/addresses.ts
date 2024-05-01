import { Multiaddr } from "@multiformats/multiaddr";
import { InstanceOption, InstanceOptions, createOptionsList } from '../container/options.js'

 
const setListenAddresses = (
    multiaddrs: Array<Multiaddr>
): { listen: Array<string> } => {
    return {
        listen: multiaddrs.map((addr) => addr.toString())
    }
}

const listenAddressesOptions = (): InstanceOptions => {
    return new InstanceOptions({options: createOptionsList([
        {
            name: 'enableTcp',
            description: 'Enable TCP transport',
            defaultValue: true
        } as InstanceOption<boolean>,
        {
            name: 'tcpPort',
            description: 'TCP port',
            defaultValue: 0
        } as InstanceOption<number>,
        {
            name: 'enableIp4',
            description: 'Enable IPv4 transport',
            defaultValue: true
        } as InstanceOption<boolean>,
        {
            name: 'ip4Domain',
            description: 'IPv4 domain',
            defaultValue: '0.0.0.0'
        } as InstanceOption<string>,
        {
            name: 'enableUdp',
            description: 'Enable UDP transport',
            defaultValue: true
        } as InstanceOption<boolean>,
        {
            name: 'udpPort',
            description: 'UDP port',
            defaultValue: 0
        } as InstanceOption<number>,
        {
            name: 'enableIp6',
            description: 'Enable IPv6 transport',
            defaultValue: true
        } as InstanceOption<boolean>,
        {
            name: 'ip6Domain',
            description: 'IPv6 domain',
            defaultValue: '::'
        } as InstanceOption<string>,
        {
            name: 'enableQuicv1',
            description: 'Enable QUIC transport',
            defaultValue: true
        } as InstanceOption<boolean>,
        {
            name: 'enableWebTransport',
            description: 'Enable WebTransport transport',
            defaultValue: true
        } as InstanceOption<boolean>,
        {
            name: 'enableWebSockets',
            description: 'Enable WebSockets transport',
            defaultValue: true
        } as InstanceOption<boolean>,
        {
            name: 'enableWebRTC',
            description: 'Enable WebRTC transport',
            defaultValue: true
        } as InstanceOption<boolean>,
        {
            name: 'enableWebRTCStar',
            description: 'Enable WebRTC Star transport',
            defaultValue: false
        } as InstanceOption<boolean>,
        {
            name: 'webRTCStarAddress',
            description: 'WebRTC Star address',
            required: false
        } as InstanceOption<boolean>,
        {
            name: 'enableCircuitRelayTransport',
            description: 'Enable Circuit Relay transport',
            defaultValue: true
        } as InstanceOption<boolean>,
        {
            name: 'additionalMultiaddrs',
            description: 'Additional multiaddrs',
            required: false
        } as InstanceOption<boolean>
    ])})
}


const listenAddresses = (instanceOptions: InstanceOptions): { listen: Array<string> } => {

    const {
        enableTcp,
        tcpPort,
        enableIp4,
        ip4Domain,
        enableUdp,
        udpPort,
        enableIp6,
        ip6Domain,
        enableQuicv1,
        enableWebTransport,
        enableWebSockets,
        enableWebRTC,
        enableWebRTCStar,
        webRTCStarAddress,
        enableCircuitRelayTransport,
        additionalMultiaddrs
    } = instanceOptions.toParams()

    const listenAddresses: Array<string> = []

    if (enableIp4) {
        if (enableTcp) {
            listenAddresses.push(`/ip4/${ip4Domain}/tcp/${tcpPort}`)
        }
        if (enableUdp) {
            listenAddresses.push(`/ip4/${ip4Domain}/udp/${udpPort}`)
        }
        if (enableQuicv1 && enableTcp) {
            listenAddresses.push(`/ip4/${ip4Domain}/udp/${udpPort}/quic-v1`)
        }
        if (enableWebTransport && enableUdp) {
            listenAddresses.push(`/ip4/${ip4Domain}/udp/${udpPort}/quic-v1/webtransport`)
        }
        if (enableWebSockets && enableTcp) {
            listenAddresses.push(`/ip4/${ip4Domain}/tcp/${tcpPort}/ws/`)
        }
    }

    if (enableIp6) {
        if (enableTcp) {
            listenAddresses.push(`/ip6/${ip6Domain}/tcp/${tcpPort}`)
        }
        if (enableUdp) {
            listenAddresses.push(`/ip6/${ip6Domain}/udp/${udpPort}`)
        }
        if (enableQuicv1 && enableTcp) {
            listenAddresses.push(`/ip6/${ip6Domain}/udp/${udpPort}/quic-v1`)
        }
        if (enableWebTransport && enableUdp) {
            listenAddresses.push(`/ip6/${ip6Domain}/udp/${udpPort}/quic-v1/webtransport`)
        }
        if (enableWebSockets && enableTcp) {
            listenAddresses.push(`/ip6/${ip6Domain}/tcp/${tcpPort}/ws/`)
        }
    }

    if (enableWebRTC) {
        listenAddresses.push('/webrtc')
    }

    // if (enableCircuitRelayTransport) {
    //     listenAddresses.push('/p2p-circuit')
    // }

    if (enableWebRTCStar === true) {
        if (webRTCStarAddress === undefined || webRTCStarAddress === null) {
            throw new Error('webrtcStarAddress must be provided')
        }
        listenAddresses.push(webRTCStarAddress.toString())
    }

    if (additionalMultiaddrs ? additionalMultiaddrs?.length > 0 : false) {
        additionalMultiaddrs?.forEach((addr: Multiaddr | string) => {
            if (typeof addr === 'string') {
                listenAddresses.push(addr)
            }
            else {
                listenAddresses.push(addr.toString())
            }
        })
    }

    return { listen: listenAddresses }
}


export {
    setListenAddresses,
    listenAddresses as listenAddressesConfig,
    listenAddressesOptions
}