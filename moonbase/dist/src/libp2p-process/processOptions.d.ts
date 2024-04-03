import { Libp2pOptions } from "libp2p";
import { Libp2pProcessConfig } from "./processConfig.js";
import { PeerId } from "@libp2p/interface";
declare class Libp2pProcessOptions {
    processOptions?: Libp2pOptions;
    processConfig?: Libp2pProcessConfig;
    peerId?: string | PeerId;
    constructor({ processOptions, processConfig, peerId }?: {
        processConfig?: Libp2pProcessConfig;
        processOptions?: Libp2pOptions;
        peerId?: string | PeerId;
    });
    init(): Promise<void>;
}
/**
 * Create a libp2p process configuration
 * @category Libp2p
 * @param options - The libp2p process configuration options
 * @returns The libp2p process configuration
 * @example
 */
declare const createLibp2pOptions: ({ autoStart, peerId, enableTcp, tcpPort, enableIp4, ip4Domain, enableUdp, udpPort, enableIp6, ip6Domain, enableQuicv1, enableWebTransport, enableWebSockets, enableWebRTC, enableWebRTCStar, webRTCStarAddress, enableCircuitRelayTransport, enableNoise, enableTls, enableBootstrap, bootstrapMultiaddrs, enableMDNS, enableGossipSub, enablePublishToZeroTopicPeers, enableAutoNAT, enableIdentify, enableUPnPNAT, enableDHT, enableDHTClient, enableIpnsValidator, enableIpnsSelector, enableLanDHT, lanDhtProtocol, lanDhtPeerInfoMapperRemovePublicAddresses, lanDhtClientMode, enableRelay, enableDCUTR, enablePing, enableDenyDialMultiaddr, denyDialMultiaddr, enableYamux, enableMplex }?: Libp2pProcessConfig) => Promise<Libp2pOptions>;
declare const createLibp2pProcessOptions: ({ processOptions, processConfig, peerId }?: {
    processOptions?: Libp2pOptions | undefined;
    processConfig?: Libp2pProcessConfig | undefined;
    peerId?: string | PeerId | undefined;
}) => Promise<Libp2pProcessOptions>;
export { createLibp2pOptions, Libp2pProcessOptions, createLibp2pProcessOptions, };
//# sourceMappingURL=processOptions.d.ts.map