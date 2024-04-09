import { Libp2pOptions, ServiceFactoryMap } from "libp2p";
import { transports } from './transports.js'
import { listenAddressesConfig } from './addresses.js'
import { libp2pServices } from './services.js'
import { streamMuxers } from './streamMuxers.js'
import { peerDiscovery } from './peerDiscovery.js'
import { connectionEncryption } from './connectionEncryption.js'
import { connectionGater } from './connectionGater.js'
import { libp2pPeerId } from './peerId.js'
import { Libp2pProcessConfig } from "./processConfig.js";
import { PeerId } from "@libp2p/interface";
import { connectionProtector } from "./protector.js";

class Libp2pProcessOptions {
    public processOptions?: Libp2pOptions;
    public processConfig?: Libp2pProcessConfig
    public peerId?: string | PeerId;

    constructor({
        processOptions,
        processConfig,
        peerId
    }: {
        processConfig?: Libp2pProcessConfig
        processOptions?: Libp2pOptions,
        peerId?: string | PeerId
    } = {}) {
        this.processConfig = processConfig;
        this.peerId = peerId;
        this.processOptions = processOptions;
    }

    public async init() {

        this.peerId = await libp2pPeerId({id: this.peerId})

        if ( !this.processConfig ) {
            this.processConfig = new Libp2pProcessConfig({peerId: this.peerId});
            this.processConfig.peerId = this.peerId;
        }

        if ( !this.processOptions && this.processConfig) {               
            this.processOptions = await createLibp2pOptions(this.processConfig);
        }
    }
}

/**
 * Create a libp2p process configuration
 * @category Libp2p
 * @param options - The libp2p process configuration options
 * @returns The libp2p process configuration
 * @example
 */
const createLibp2pOptions = async ({
    autoStart,
    peerId,
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
    enableNoise,
    enableTls,
    enablePrivateSwarm,
    privateSwarmKey,
    enableBootstrap,
    bootstrapMultiaddrs,
    enableMDNS,
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
    enableDenyDialMultiaddr,
    denyDialMultiaddr,
    enableYamux,
    enableMplex
}: Libp2pProcessConfig = 
    new Libp2pProcessConfig()
): Promise<Libp2pOptions> => {
    let options: Libp2pOptions = {
        start: autoStart,
        addresses: listenAddressesConfig({
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
        }),
        transports: transports({
            enableWebSockets,
            enableWebTransport,
            enableTcp,
            enableWebRTC,
            enableCircuitRelayTransport
        }),
        connectionEncryption: connectionEncryption({
            enableNoise,
            enableTls
        }),
        streamMuxers: streamMuxers({
            enableYamux,
            enableMplex
        }),
        services: libp2pServices({
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
            enablePing
        }) as ServiceFactoryMap,
        peerDiscovery: peerDiscovery({
            enableMDNS,
            enableBootstrap,
            bootstrapMultiaddrs
        }),
        connectionGater: connectionGater({
            enableDenyDialMultiaddr,
            denyDialMultiaddr
        }),
    }
    
    if (peerId) {
        options.peerId = await libp2pPeerId({id: peerId})
    }

    if (enablePrivateSwarm) {
        options.connectionProtector = connectionProtector({
            swarmKeyAsHex: privateSwarmKey
        })
    }

    return options
}

const createLibp2pProcessOptions = async (
    {
        processOptions,
        processConfig,
        peerId
    }: {
        processOptions?: Libp2pOptions,
        processConfig?: Libp2pProcessConfig,
        peerId?: string | PeerId
    } = {}): Promise<Libp2pProcessOptions> => {
    const options = new Libp2pProcessOptions({
        processOptions: processOptions,
        processConfig: processConfig,
        peerId: peerId
    });
    await options.init();
    return options;
}

export {
    createLibp2pOptions,
    Libp2pProcessOptions,
    createLibp2pProcessOptions,
}