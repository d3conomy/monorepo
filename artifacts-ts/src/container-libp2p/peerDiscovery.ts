import { mdns } from '@libp2p/mdns'
import { Multiaddr } from '@multiformats/multiaddr'

import { libp2pBootstrap } from './bootstrap.js'
import { InstanceOption, InstanceOptions, createOptionsList } from '../container/options.js'

const peerDiscoveryOptions = (): InstanceOptions => {
    return new InstanceOptions({options: createOptionsList([
        {
            name: 'enableMDNS',
            description: 'Enable mDNS peer discovery',
            defaultValue: false
        } as InstanceOption<boolean>,
        {
            name: 'enableBootstrap',
            description: 'Enable bootstrap peer discovery',
            defaultValue: true
        } as InstanceOption<boolean>,
        {
            name: 'useDefaultBootstrap',
            description: 'Use default bootstrap configuration',
            defaultValue: false
        } as InstanceOption<boolean>,
        {
            name: 'bootstrapMultiaddrs',
            description: 'Custom bootstrap configuration',
            defaultValue: []
        } as InstanceOption<Array<string>>
    ])})
}

/**
 * Default Peer Discover libp2p options
 * @category Libp2p
 */
const peerDiscovery = (options: InstanceOptions) => {
    const { 
        enableMDNS,
        enableBootstrap,
        useDefaultBootstrap,
        bootstrapMultiaddrs
    } = options.toParams()

    let peerDiscovery: Array<any> = new Array<any>();
    if (enableBootstrap && (useDefaultBootstrap || bootstrapMultiaddrs.length > 0)) {
        peerDiscovery.push(libp2pBootstrap({
            defaultConfig: useDefaultBootstrap,
            multiaddrs: bootstrapMultiaddrs
        } as any))
    }
    if (enableMDNS) {
        peerDiscovery.push(mdns())
    }
    return peerDiscovery;
}

export {
    peerDiscovery,
    peerDiscoveryOptions
}