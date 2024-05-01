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
import { InstanceOption, InstanceOptions, createOptionsList } from '../container/options.js'


const serviceOptions = (): InstanceOptions => {
    return new InstanceOptions({options: createOptionsList([
        {
            name: 'enableGossipSub',
            description: 'Enable GossipSub',
            defaultValue: true
        } as InstanceOption<boolean>,
        {
            name: 'enablePublishToZeroTopicPeers',
            description: 'Enable publish to zero topic peers',
            defaultValue: true
        } as InstanceOption<boolean>,
        {
            name: 'enableAutoNAT',
            description: 'Enable AutoNAT',
            defaultValue: true
        } as InstanceOption<boolean>,
        {
            name: 'enableIdentify',
            description: 'Enable Identify',
            defaultValue: true
        } as InstanceOption<boolean>,
        {
            name: 'enableUPnPNAT',
            description: 'Enable UPnP NAT',
            defaultValue: true
        } as InstanceOption<boolean>,
        {
            name: 'enableDHT',
            description: 'Enable DHT',
            defaultValue: true
        } as InstanceOption<boolean>,
        {
            name: 'enableDHTClient',
            description: 'Enable DHT Client',
            defaultValue: true
        } as InstanceOption<boolean>,
        {
            name: 'enableIpnsValidator',
            description: 'Enable IPNS Validator',
            defaultValue: true
        } as InstanceOption<boolean>,
        {
            name: 'enableIpnsSelector',
            description: 'Enable IPNS Selector',
            defaultValue: true
        } as InstanceOption<boolean>,
        {
            name: 'enableLanDHT',
            description: 'Enable LAN DHT',
            defaultValue: true
        } as InstanceOption<boolean>,
        {
            name: 'lanDhtProtocol',
            description: 'LAN DHT Protocol',
            defaultValue: 'lan'
        } as InstanceOption<string>,

        {
            name: 'lanDhtPeerInfoMapperRemovePublicAddresses',
            description: 'LAN DHT Peer Info Mapper Remove Public Addresses',
            defaultValue: true
        } as InstanceOption<boolean>,

        {
            name: 'lanDhtClientMode',
            description: 'LAN DHT Client Mode',
            defaultValue: true
        } as InstanceOption<boolean>,

        {
            name: 'enableRelay',
            description: 'Enable Relay',
            defaultValue: true
        } as InstanceOption<boolean>,

        {
            name: 'enableDCUTR',
            description: 'Enable DCUTR',
            defaultValue: true
        } as InstanceOption<boolean>,

        {
            name: 'enablePing',
            description: 'Enable Ping',
            defaultValue: true
        } as InstanceOption<boolean>,
    ])})
}

/**
 * Default libp2p options
 * @category Libp2p
 */
const services = (options: InstanceOptions): any => {
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

    const {
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
    } = options.toParams()

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