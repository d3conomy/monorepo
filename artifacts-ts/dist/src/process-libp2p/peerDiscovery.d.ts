import { Multiaddr } from '@multiformats/multiaddr';
import { IProcessOptions } from '../process-interface/processOptions.js';
declare const peerDiscoveryOptions: IProcessOptions;
/**
 * Default Peer Discover libp2p options
 * @category Libp2p
 */
declare const peerDiscovery: ({ enableMDNS, enableBootstrap, useDefaultBootstrap, bootstrapMultiaddrs }?: {
    enableMDNS?: boolean | undefined;
    enableBootstrap?: boolean | undefined;
    useDefaultBootstrap?: boolean | undefined;
    bootstrapMultiaddrs?: (string | Multiaddr)[] | undefined;
}) => any[];
export { peerDiscovery, peerDiscoveryOptions };
//# sourceMappingURL=peerDiscovery.d.ts.map