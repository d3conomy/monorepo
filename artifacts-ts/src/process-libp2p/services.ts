import { circuitRelayServer } from '@libp2p/circuit-relay-v2'
import { dcutr } from '@libp2p/dcutr'
import { identify } from '@libp2p/identify'
import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { autoNAT } from '@libp2p/autonat'
import { KadDHTInit, kadDHT, removePublicAddressesMapper } from '@libp2p/kad-dht'
import { uPnPNAT } from '@libp2p/upnp-nat'
import { ipnsValidator } from 'ipns/validator'
import { ipnsSelector } from 'ipns/selector'
import { ping } from '@libp2p/ping'
import { ServiceFactoryMap } from 'libp2p'
import { IProcessOptions, createProcessOption } from '../process-interface/index.js'


const serviceOptions: IProcessOptions = [
    createProcessOption({
        name: 'enableGossipSub',
        description: 'Enable GossipSub',
        required: false,
        defaultValue: true
    }),
    createProcessOption({
        name: 'enablePublishToZeroTopicPeers',
        description: 'Enable publish to zero topic peers',
        required: false,
        defaultValue: true
    }),
    createProcessOption({
        name: 'enableAutoNAT',
        description: 'Enable AutoNAT',
        required: false,
        defaultValue: true
    }),
    createProcessOption({
        name: 'enableIdentify',
        description: 'Enable Identify',
        required: false,
        defaultValue: true
    }),
    createProcessOption({
        name: 'enableUPnPNAT',
        description: 'Enable UPnP NAT',
        required: false,
        defaultValue: true
    }),
    createProcessOption({
        name: 'enableDHT',
        description: 'Enable DHT',
        required: false,
        defaultValue: true
    }),
    createProcessOption({
        name: 'enableDHTClient',
        description: 'Enable DHT Client',
        required: false,
        defaultValue: true
    }),
    createProcessOption({
        name: 'enableIpnsValidator',
        description: 'Enable IPNS Validator',
        required: false,
        defaultValue: true
    }),
    createProcessOption({
        name: 'enableIpnsSelector',
        description: 'Enable IPNS Selector',
        required: false,
        defaultValue: true
    }),
    createProcessOption({
        name: 'enableLanDHT',
        description: 'Enable LAN DHT',
        required: false,
        defaultValue: true
    }),
    createProcessOption({
        name: 'lanDhtProtocol',
        description: 'LAN DHT Protocol',
        required: false,
        defaultValue: 'lan'
    }),

    createProcessOption({
        name: 'lanDhtPeerInfoMapperRemovePublicAddresses',
        description: 'LAN DHT Peer Info Mapper Remove Public Addresses',
        required: false,
        defaultValue: true
    }),

    createProcessOption({
        name: 'lanDhtClientMode',
        description: 'LAN DHT Client Mode',
        required: false,
        defaultValue: true
    }),

    createProcessOption({
        name: 'enableRelay',
        description: 'Enable Relay',
        required: false,
        defaultValue: true
    }),

    createProcessOption({
        name: 'enableDCUTR',
        description: 'Enable DCUTR',
        required: false,
        defaultValue: true
    }),

    createProcessOption({
        name: 'enablePing',
        description: 'Enable Ping',
        required: false,
        defaultValue: true
    }),
]

/**
 * Default libp2p options
 * @category Libp2p
 */
const services = ({
    enableGossipSub,
    enablePublishToZeroTopicPeers,
    enableAutoNAT,
    enableIdentify,
    enableUPnPNAT,
    enableDHT,
    enableDHTClient,
    enableIpnsValidator,
    enableIpnsSelector,
    enableLanDHT,
    lanDhtProtocol,
    lanDhtPeerInfoMapperRemovePublicAddresses,
    lanDhtClientMode,
    enableRelay,
    enableDCUTR,
    enablePing,
} : {
    enableGossipSub?: boolean,
    enablePublishToZeroTopicPeers?: boolean,
    enableAutoNAT?: boolean,
    enableIdentify?: boolean,
    enableUPnPNAT?: boolean,
    enableDHT?: boolean,
    enableDHTClient?: boolean,
    enableIpnsValidator?: boolean,
    enableIpnsSelector?: boolean,
    enableLanDHT?: boolean,
    lanDhtProtocol?: string,
    lanDhtPeerInfoMapperRemovePublicAddresses?: boolean,
    lanDhtClientMode?: boolean,
    enableRelay?: boolean,
    enableDCUTR?: boolean,
    enablePing?: boolean
} = {}): {} => {
    let serviceOptions: {
        pubsub?: any,
        autonat?: any,
        identify?: any,
        upnpNAT?: any,
        dht?: any,
        lanDHT?: any,
        relay?: any,
        dcutr?: any,
        ping?: any
    } = {}

    if (enableGossipSub) {
        serviceOptions.pubsub = gossipsub({
            allowPublishToZeroTopicPeers: enablePublishToZeroTopicPeers,
            enabled: true,
            multicodecs: ['/libp2p/pubsub/1.0.0'],
            canRelayMessage: true,
            emitSelf: true,
            messageProcessingConcurrency: 16,
            maxInboundStreams: 100,
            maxOutboundStreams: 100,
            doPX: true
        })
    }

    if (enableAutoNAT) {
        serviceOptions.autonat = autoNAT()
    }

    if (enableIdentify) {
        serviceOptions.identify = identify()
    }

    if (enableUPnPNAT) {
        serviceOptions.upnpNAT = uPnPNAT()
    }

    if (enableDHT) {
        let dhtConfig : {
            clientMode?: boolean,
            validators?: any,
            selectors?: any
        } = {}

        if (enableDHTClient) {
            dhtConfig.clientMode = true
        }

        if (enableIpnsValidator || enableIpnsSelector) {
            if (enableIpnsValidator && enableIpnsSelector) {
                dhtConfig.validators = { ipns: ipnsValidator }
                dhtConfig.selectors = { ipns: ipnsSelector }
            }

            if (enableIpnsValidator && !enableIpnsSelector) {
                dhtConfig.validators = { ipns: ipnsValidator }
            }

            if (!enableIpnsValidator && enableIpnsSelector) {
                dhtConfig.selectors = { ipns: ipnsSelector }
            }

            serviceOptions.dht = kadDHT(dhtConfig as KadDHTInit)
        }
    }

    if (enableLanDHT) {
        let lanDhtConfig: {
            protocol?: string,
            peerInfoMapper?: any,
            clientMode?: boolean
        } = {}

        if (lanDhtProtocol) {
            lanDhtConfig.protocol = lanDhtProtocol
        }

        if (lanDhtPeerInfoMapperRemovePublicAddresses) {
            lanDhtConfig.peerInfoMapper = removePublicAddressesMapper
        }

        if (lanDhtClientMode) {
            lanDhtConfig.clientMode = true
        }

        serviceOptions.lanDHT = kadDHT(lanDhtConfig as KadDHTInit)
    }

    if (enableRelay) {
        serviceOptions.relay = circuitRelayServer({
            advertise: true
        })
    }

    if (enableDCUTR) {
        serviceOptions.dcutr = dcutr()
    }

    if (enablePing) {
        serviceOptions.ping = ping()
    }

    return serviceOptions
}

export {
    services as libp2pServices,
    serviceOptions
}