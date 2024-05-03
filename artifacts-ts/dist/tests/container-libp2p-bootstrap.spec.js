import { expect } from 'chai';
import { multiaddr } from '@multiformats/multiaddr';
import { libp2pBootstrap, bootstrapOptions } from '../src/container-libp2p/bootstrap.js';
describe('libp2pBootstrap', () => {
    it('should return default bootstrap configuration when defaultConfig is true', () => {
        const instanceOptions = bootstrapOptions();
        instanceOptions.set('defaultConfig', true);
        instanceOptions.set('list', true);
        const result = libp2pBootstrap(instanceOptions);
        expect(result).to.deep.equal([
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa",
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb",
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt",
            "/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ"
        ]);
    });
    it('should return custom bootstrap configuration when multiaddrs is provided', () => {
        const instanceOptions = bootstrapOptions();
        instanceOptions.set('multiaddrs', [
            '/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuA',
            '/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuB'
        ]);
        instanceOptions.set('list', true);
        instanceOptions.set('defaultConfig', false);
        const result = libp2pBootstrap(instanceOptions);
        expect(result).to.deep.equal([
            '/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuA',
            '/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuB'
        ]);
    });
    it('should return custom bootstrap configuration when multiaddrs is provided as Multiaddr[]', () => {
        const instanceOptions = bootstrapOptions();
        instanceOptions.set('list', true);
        instanceOptions.set('defaultConfig', false);
        instanceOptions.set('multiaddrs', [
            multiaddr('/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuA'),
            multiaddr('/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuB')
        ]);
        const result = libp2pBootstrap(instanceOptions);
        expect(result).to.deep.equal([
            '/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuA',
            '/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuB'
        ]);
    });
});
