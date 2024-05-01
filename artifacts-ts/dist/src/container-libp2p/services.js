import { circuitRelayServer } from '@libp2p/circuit-relay-v2';
import { dcutr } from '@libp2p/dcutr';
import { identify } from '@libp2p/identify';
import { gossipsub } from '@chainsafe/libp2p-gossipsub';
import { autoNAT } from '@libp2p/autonat';
import { kadDHT, removePublicAddressesMapper } from '@libp2p/kad-dht';
import { uPnPNAT } from '@libp2p/upnp-nat';
import { ipnsValidator } from 'ipns/validator';
import { ipnsSelector } from 'ipns/selector';
import { ping } from '@libp2p/ping';
import { InstanceOptions, createOptionsList } from '../container/options.js';
const serviceOptions = () => {
    return new InstanceOptions({ options: createOptionsList([
            {
                name: 'enableGossipSub',
                description: 'Enable GossipSub',
                defaultValue: true
            },
            {
                name: 'enablePublishToZeroTopicPeers',
                description: 'Enable publish to zero topic peers',
                defaultValue: true
            },
            {
                name: 'enableAutoNAT',
                description: 'Enable AutoNAT',
                defaultValue: true
            },
            {
                name: 'enableIdentify',
                description: 'Enable Identify',
                defaultValue: true
            },
            {
                name: 'enableUPnPNAT',
                description: 'Enable UPnP NAT',
                defaultValue: true
            },
            {
                name: 'enableDHT',
                description: 'Enable DHT',
                defaultValue: true
            },
            {
                name: 'enableDHTClient',
                description: 'Enable DHT Client',
                defaultValue: true
            },
            {
                name: 'enableIpnsValidator',
                description: 'Enable IPNS Validator',
                defaultValue: true
            },
            {
                name: 'enableIpnsSelector',
                description: 'Enable IPNS Selector',
                defaultValue: true
            },
            {
                name: 'enableLanDHT',
                description: 'Enable LAN DHT',
                defaultValue: true
            },
            {
                name: 'lanDhtProtocol',
                description: 'LAN DHT Protocol',
                defaultValue: 'lan'
            },
            {
                name: 'lanDhtPeerInfoMapperRemovePublicAddresses',
                description: 'LAN DHT Peer Info Mapper Remove Public Addresses',
                defaultValue: true
            },
            {
                name: 'lanDhtClientMode',
                description: 'LAN DHT Client Mode',
                defaultValue: true
            },
            {
                name: 'enableRelay',
                description: 'Enable Relay',
                defaultValue: true
            },
            {
                name: 'enableDCUTR',
                description: 'Enable DCUTR',
                defaultValue: true
            },
            {
                name: 'enablePing',
                description: 'Enable Ping',
                defaultValue: true
            },
        ]) });
};
/**
 * Default libp2p options
 * @category Libp2p
 */
const services = (options) => {
    let serviceOptions = {};
    const { enableGossipSub, enablePublishToZeroTopicPeers, enableAutoNAT, enableIdentify, enableUPnPNAT, enableDHT, enableDHTClient, enableIpnsValidator, enableIpnsSelector, enableLanDHT, lanDhtProtocol, lanDhtPeerInfoMapperRemovePublicAddresses, lanDhtClientMode, enableRelay, enableDCUTR, enablePing, } = options.toParams();
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
        });
    }
    if (enableAutoNAT) {
        serviceOptions.autonat = autoNAT();
    }
    if (enableIdentify) {
        serviceOptions.identify = identify();
    }
    if (enableUPnPNAT) {
        serviceOptions.upnpNAT = uPnPNAT();
    }
    if (enableDHT) {
        let dhtConfig = {};
        if (enableDHTClient) {
            dhtConfig.clientMode = true;
        }
        if (enableIpnsValidator || enableIpnsSelector) {
            if (enableIpnsValidator && enableIpnsSelector) {
                dhtConfig.validators = { ipns: ipnsValidator };
                dhtConfig.selectors = { ipns: ipnsSelector };
            }
            if (enableIpnsValidator && !enableIpnsSelector) {
                dhtConfig.validators = { ipns: ipnsValidator };
            }
            if (!enableIpnsValidator && enableIpnsSelector) {
                dhtConfig.selectors = { ipns: ipnsSelector };
            }
            serviceOptions.dht = kadDHT(dhtConfig);
        }
    }
    if (enableLanDHT) {
        let lanDhtConfig = {};
        if (lanDhtProtocol) {
            lanDhtConfig.protocol = lanDhtProtocol;
        }
        if (lanDhtPeerInfoMapperRemovePublicAddresses) {
            lanDhtConfig.peerInfoMapper = removePublicAddressesMapper;
        }
        if (lanDhtClientMode) {
            lanDhtConfig.clientMode = true;
        }
        serviceOptions.lanDHT = kadDHT(lanDhtConfig);
    }
    if (enableRelay) {
        serviceOptions.relay = circuitRelayServer({
            advertise: true
        });
    }
    if (enableDCUTR) {
        serviceOptions.dcutr = dcutr();
    }
    if (enablePing) {
        serviceOptions.ping = ping();
    }
    return serviceOptions;
};
export { services as libp2pServices, serviceOptions };
