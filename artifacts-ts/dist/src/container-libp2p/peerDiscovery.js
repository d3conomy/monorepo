import { mdns } from '@libp2p/mdns';
import { libp2pBootstrap } from './bootstrap.js';
import { InstanceOptions, createOptionsList } from '../container/options.js';
const peerDiscoveryOptions = () => {
    return new InstanceOptions({ options: createOptionsList([
            {
                name: 'enableMDNS',
                description: 'Enable mDNS peer discovery',
                defaultValue: false
            },
            {
                name: 'enableBootstrap',
                description: 'Enable bootstrap peer discovery',
                defaultValue: true
            },
            {
                name: 'useDefaultBootstrap',
                description: 'Use default bootstrap configuration',
                defaultValue: false
            },
            {
                name: 'bootstrapMultiaddrs',
                description: 'Custom bootstrap configuration',
                defaultValue: []
            }
        ]) });
};
/**
 * Default Peer Discover libp2p options
 * @category Libp2p
 */
const peerDiscovery = (options) => {
    const { enableMDNS, enableBootstrap, useDefaultBootstrap, bootstrapMultiaddrs } = options.toParams();
    let peerDiscovery = new Array();
    if (enableBootstrap && (useDefaultBootstrap || bootstrapMultiaddrs.length > 0)) {
        peerDiscovery.push(libp2pBootstrap({
            defaultConfig: useDefaultBootstrap,
            multiaddrs: bootstrapMultiaddrs
        }));
    }
    if (enableMDNS) {
        peerDiscovery.push(mdns());
    }
    return peerDiscovery;
};
export { peerDiscovery, peerDiscoveryOptions };
