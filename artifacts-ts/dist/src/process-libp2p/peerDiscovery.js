import { mdns } from '@libp2p/mdns';
import { libp2pBootstrap } from './bootstrap.js';
import { createProcessOption, injectDefaultValues, mapProcessOptions } from '../process-interface/processOptions.js';
const peerDiscoveryOptions = () => [
    createProcessOption({
        name: 'enableMDNS',
        description: 'Enable mDNS peer discovery',
        defaultValue: false
    }),
    createProcessOption({
        name: 'enableBootstrap',
        description: 'Enable bootstrap peer discovery',
        defaultValue: true
    }),
    createProcessOption({
        name: 'useDefaultBootstrap',
        description: 'Use default bootstrap configuration',
        defaultValue: false
    }),
    createProcessOption({
        name: 'bootstrapMultiaddrs',
        description: 'Custom bootstrap configuration',
        defaultValue: []
    })
];
/**
 * Default Peer Discover libp2p options
 * @category Libp2p
 */
const peerDiscovery = ({ ...values } = {}) => {
    const injectedDefaultValues = injectDefaultValues({ options: peerDiscoveryOptions(), values });
    const { enableMDNS, enableBootstrap, useDefaultBootstrap, bootstrapMultiaddrs } = mapProcessOptions(injectedDefaultValues);
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
