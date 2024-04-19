import { Multiaddr } from "@multiformats/multiaddr";
import { IProcessOptions, createProcessOption, formatProcessOptions } from "../process-interface/index.js";
 
const setListenAddresses = (
    multiaddrs: Array<Multiaddr>
): { listen: Array<string> } => {
    return {
        listen: multiaddrs.map((addr) => addr.toString())
    }
}

const listenAddressesOptions: IProcessOptions = [
    createProcessOption({
        name: 'enableTcp',
        description: 'Enable TCP transport',
        defaultValue: true
    }),
    createProcessOption({
        name: 'tcpPort',
        description: 'TCP port',
        defaultValue: 0
    }),
    createProcessOption({
        name: 'enableIp4',
        description: 'Enable IPv4 transport',
        defaultValue: true
    }),
    createProcessOption({
        name: 'ip4Domain',
        description: 'IPv4 domain',
        defaultValue: '0.0.0.0'
    }),
    createProcessOption({
        name: 'enableUdp',
        description: 'Enable UDP transport',
        defaultValue: true
    }),
    createProcessOption({
        name: 'udpPort',
        description: 'UDP port',
        defaultValue: 0
    }),
    createProcessOption({
        name: 'enableIp6',
        description: 'Enable IPv6 transport',
        defaultValue: true
    }),
    createProcessOption({
        name: 'ip6Domain',
        description: 'IPv6 domain',
        defaultValue: '::'
    }),
    createProcessOption({
        name: 'enableQuicv1',
        description: 'Enable QUIC transport',
        defaultValue: true
    }),
    createProcessOption({
        name: 'enableWebTransport',
        description: 'Enable WebTransport transport',
        defaultValue: true
    }),
    createProcessOption({
        name: 'enableWebSockets',
        description: 'Enable WebSockets transport',
        defaultValue: true
    }),
    createProcessOption({
        name: 'enableWebRTC',
        description: 'Enable WebRTC transport',
        defaultValue: true
    }),
    createProcessOption({
        name: 'enableWebRTCStar',
        description: 'Enable WebRTC Star transport',
        defaultValue: false
    }),
    createProcessOption({
        name: 'webRTCStarAddress',
        description: 'WebRTC Star address',
        required: false
    }),
    createProcessOption({
        name: 'enableCircuitRelayTransport',
        description: 'Enable Circuit Relay transport',
        defaultValue: true
    }),
    createProcessOption({
        name: 'additionalMultiaddrs',
        description: 'Additional multiaddrs',
        required: false
    })
]

const listenAddressesParams = formatProcessOptions(listenAddressesOptions)

const listenAddresses = ({
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
} : {
    enableTcp?: boolean,
    tcpPort?: number,
    enableIp4?: boolean,
    ip4Domain?: string,
    enableUdp?: boolean,
    udpPort?: number,
    enableIp6?: boolean,
    ip6Domain?: string,
    enableQuicv1?: boolean,
    enableWebTransport?: boolean,
    enableWebSockets?: boolean,
    enableWebRTC?: boolean,
    enableWebRTCStar?: boolean,
    webRTCStarAddress?: Multiaddr | string,
    enableCircuitRelayTransport?: boolean,
    additionalMultiaddrs?: Array<Multiaddr | string>
} = {}): { listen: Array<string> } => {
    let listenAddresses: Array<string> = new Array<string>()

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

    if (enableWebRTCStar) {
        if (!webRTCStarAddress) {
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