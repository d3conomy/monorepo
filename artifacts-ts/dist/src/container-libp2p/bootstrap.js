import { multiaddr } from '@multiformats/multiaddr';
import { bootstrap } from '@libp2p/bootstrap';
import { InstanceOptions } from '../container/options.js';
const bootstrapOptions = () => {
    return new InstanceOptions({ options: [
            {
                name: 'defaultConfig',
                description: 'Use default bootstrap configuration',
                defaultValue: true
            },
            {
                name: 'multiaddrs',
                description: 'Custom bootstrap configuration',
                defaultValue: []
            },
            {
                name: 'list',
                description: 'List bootstrap configuration, instead of returning a function',
                defaultValue: false
            }
        ] });
};
/**
 * Default bootstrap configuration for libp2p
 * @category Libp2p
 */
const defaultBootstrapConfig = [
    "/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
    "/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa",
    "/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb",
    "/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt",
    "/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ"
];
const libp2pBootstrap = (options) => {
    let addrs = new Array();
    const { defaultConfig, multiaddrs, list } = options.toParams();
    if (defaultConfig === true) {
        defaultBootstrapConfig.forEach((addr) => {
            addrs.push(addr);
        });
    }
    if (multiaddrs ? multiaddrs?.length > 0 : false) {
        multiaddrs?.forEach((addr) => {
            if (typeof addr === 'string') {
                addrs.push(addr);
            }
            else {
                addrs.push(multiaddr(addr).toString());
            }
        });
    }
    if (list) {
        return addrs;
    }
    return bootstrap({ list: addrs });
};
export { libp2pBootstrap, bootstrapOptions };
