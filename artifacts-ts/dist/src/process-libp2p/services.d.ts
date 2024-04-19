import { IProcessOptions } from '../process-interface';
declare const serviceOptions: IProcessOptions;
/**
 * Default libp2p options
 * @category Libp2p
 */
declare const services: ({ enableGossipSub, enablePublishToZeroTopicPeers, enableAutoNAT, enableIdentify, enableUPnPNAT, enableDHT, enableDHTClient, enableIpnsValidator, enableIpnsSelector, enableLanDHT, lanDhtProtocol, lanDhtPeerInfoMapperRemovePublicAddresses, lanDhtClientMode, enableRelay, enableDCUTR, enablePing, }?: {
    enableGossipSub?: boolean | undefined;
    enablePublishToZeroTopicPeers?: boolean | undefined;
    enableAutoNAT?: boolean | undefined;
    enableIdentify?: boolean | undefined;
    enableUPnPNAT?: boolean | undefined;
    enableDHT?: boolean | undefined;
    enableDHTClient?: boolean | undefined;
    enableIpnsValidator?: boolean | undefined;
    enableIpnsSelector?: boolean | undefined;
    enableLanDHT?: boolean | undefined;
    lanDhtProtocol?: string | undefined;
    lanDhtPeerInfoMapperRemovePublicAddresses?: boolean | undefined;
    lanDhtClientMode?: boolean | undefined;
    enableRelay?: boolean | undefined;
    enableDCUTR?: boolean | undefined;
    enablePing?: boolean | undefined;
}) => {};
export { services as libp2pServices, serviceOptions };
//# sourceMappingURL=services.d.ts.map