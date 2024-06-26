import { Multiaddr } from '@multiformats/multiaddr'
import { PeerId } from '@libp2p/interface'

class Libp2pProcessConfig {
    autoStart: boolean = false;
    peerId: PeerId | string | undefined = undefined;
    enableTcp: boolean = true;
    tcpPort: number = 0;
    enableIp4: boolean = true;
    ip4Domain: string = '0.0.0.0';
    enableUdp: boolean = true;
    udpPort: number = 0;
    enableIp6: boolean = true;
    ip6Domain: string = '::';
    enableQuicv1: boolean = true;
    enableWebTransport: boolean = true;
    enableWebSockets: boolean = true;
    enableWebRTC: boolean = false;
    enableWebRTCStar: boolean = false;
    webRTCStarAddress: Multiaddr | string = '/dns4/webrtc-star.trnk.xyz/tcp/443/wss/p2p-webrtc-star';
    enableCircuitRelayTransport: boolean = true;
    enableNoise: boolean = true;
    enableTls: boolean = true;
    enablePrivateSwarm: boolean = false;
    privateSwarmKey: string = '';
    enableBootstrap: boolean = true;
    defaultBootstrapConfig: boolean = true;
    bootstrapMultiaddrs: Array<Multiaddr | string> = new Array<Multiaddr | string>();
    enableMDNS: boolean = true;
    enableGossipSub: boolean = true;
    enablePublishToZeroTopicPeers: boolean = true;
    enableAutoNAT: boolean = true;
    enableIdentify: boolean = true;
    enableUPnPNAT: boolean = true;
    enableDHT: boolean = true;
    enableDHTClient: boolean = true;
    enableIpnsValidator: boolean = true;
    enableIpnsSelector: boolean = true;
    enableLanDHT: boolean = true;
    lanDhtProtocol: string = '/ipfs/lan/kad/1.0.0';
    lanDhtPeerInfoMapperRemovePublicAddresses: boolean = true;
    lanDhtClientMode: boolean = false;
    enableRelay: boolean = true;
    enableDCUTR: boolean = true;
    enablePing: boolean = true;
    enableDenyDialMultiaddr: boolean = true;
    denyDialMultiaddr: boolean = false;
    enableYamux: boolean = true;
    enableMplex: boolean = false;

    constructor({
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
    }: {
        autoStart?: boolean,
        peerId?: PeerId | string,
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
        enableNoise?: boolean,
        enableTls?: boolean,
        enablePrivateSwarm?: boolean,
        privateSwarmKey?: string,
        enableBootstrap?: boolean,
        bootstrapMultiaddrs?: Array<Multiaddr | string>,
        enableMDNS?: boolean,
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
        enablePing?: boolean,
        enableDenyDialMultiaddr?: boolean,
        denyDialMultiaddr?: boolean,
        enableYamux?: boolean,
        enableMplex?: boolean
    } = {}) {
        this.autoStart = autoStart ? autoStart : this.autoStart;
        this.peerId = peerId ? peerId : this.peerId;
        this.enableTcp = enableTcp ? enableTcp : this.enableTcp;
        this.tcpPort = tcpPort ? tcpPort : this.tcpPort;
        this.enableIp4 = enableIp4 ? enableIp4 : this.enableIp4;
        this.ip4Domain = ip4Domain ? ip4Domain : this.ip4Domain;
        this.enableUdp = enableUdp ? enableUdp : this.enableUdp;
        this.udpPort = udpPort ? udpPort : this.udpPort;
        this.enableIp6 = enableIp6 ? enableIp6 : this.enableIp6;
        this.ip6Domain = ip6Domain ? ip6Domain : this.ip6Domain;
        this.enableQuicv1 = enableQuicv1 ? enableQuicv1 : this.enableQuicv1;
        this.enableWebTransport = enableWebTransport ? enableWebTransport : this.enableWebTransport;
        this.enableWebSockets = enableWebSockets ? enableWebSockets : this.enableWebSockets;
        this.enableWebRTC = enableWebRTC ? enableWebRTC : this.enableWebRTC;
        this.enableWebRTCStar = enableWebRTCStar ? enableWebRTCStar : this.enableWebRTCStar;
        this.webRTCStarAddress = webRTCStarAddress ? webRTCStarAddress : this.webRTCStarAddress;
        this.enableCircuitRelayTransport = enableCircuitRelayTransport ? enableCircuitRelayTransport : this.enableCircuitRelayTransport;
        this.enableNoise = enableNoise ? enableNoise : this.enableNoise;
        this.enableTls = enableTls ? enableTls : this.enableTls;
        this.enablePrivateSwarm = enablePrivateSwarm ? enablePrivateSwarm : this.enablePrivateSwarm;
        this.privateSwarmKey = privateSwarmKey ? privateSwarmKey : this.privateSwarmKey;
        this.enableBootstrap = enableBootstrap ? enableBootstrap : this.enableBootstrap;
        this.bootstrapMultiaddrs = bootstrapMultiaddrs ? bootstrapMultiaddrs : this.bootstrapMultiaddrs;
        this.enableMDNS = enableMDNS ? enableMDNS : this.enableMDNS;
        this.enableGossipSub = enableGossipSub ? enableGossipSub : this.enableGossipSub;
        this.enablePublishToZeroTopicPeers = enablePublishToZeroTopicPeers ? enablePublishToZeroTopicPeers : this.enablePublishToZeroTopicPeers;
        this.enableAutoNAT = enableAutoNAT ? enableAutoNAT : this.enableAutoNAT;
        this.enableIdentify = enableIdentify ? enableIdentify : this.enableIdentify;
        this.enableUPnPNAT = enableUPnPNAT ? enableUPnPNAT : this.enableUPnPNAT;
        this.enableDHT = enableDHT ? enableDHT : this.enableDHT;
        this.enableDHTClient = enableDHTClient ? enableDHTClient : this.enableDHTClient;
        this.enableIpnsValidator = enableIpnsValidator ? enableIpnsValidator : this.enableIpnsValidator;
        this.enableIpnsSelector = enableIpnsSelector ? enableIpnsSelector : this.enableIpnsSelector;
        this.enableLanDHT = enableLanDHT ? enableLanDHT : this.enableLanDHT;
        this.lanDhtProtocol = lanDhtProtocol ? lanDhtProtocol : this.lanDhtProtocol;
        this.lanDhtPeerInfoMapperRemovePublicAddresses = lanDhtPeerInfoMapperRemovePublicAddresses ? lanDhtPeerInfoMapperRemovePublicAddresses : this.lanDhtPeerInfoMapperRemovePublicAddresses;
        this.lanDhtClientMode = lanDhtClientMode ? lanDhtClientMode : this.lanDhtClientMode;
        this.enableRelay = enableRelay ? enableRelay : this.enableRelay;
        this.enableDCUTR = enableDCUTR ? enableDCUTR : this.enableDCUTR;
        this.enablePing = enablePing ? enablePing : this.enablePing;
        this.enableDenyDialMultiaddr = enableDenyDialMultiaddr ? enableDenyDialMultiaddr : this.enableDenyDialMultiaddr;
        this.denyDialMultiaddr = denyDialMultiaddr ? denyDialMultiaddr : this.denyDialMultiaddr;
        this.enableYamux = enableYamux ? enableYamux : this.enableYamux;
        this.enableMplex = enableMplex ? enableMplex : this.enableMplex;
    }
}


export {
    Libp2pProcessConfig
}