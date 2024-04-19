import { expect } from 'chai';
import { libp2pBootstrap } from '../src/process-libp2p/bootstrap.js'

describe('libp2pBootstrap', () => {
    it('should return default bootstrap configuration when no options are provided', () => {
        const result: Array<string> = libp2pBootstrap([{ name: "list", value: true }] as any);
        expect(result.toString()).to.equal([
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa",
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb",
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt",
            "/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ"
        ].toString());
    });

    it('should return custom bootstrap configuration when multiaddrs option is provided', () => {
        const multiaddrs = [
            "/ip4/127.0.0.1/tcp/1234/p2p/QmTest1",
            "/ip4/127.0.0.1/tcp/5678/p2p/QmTest2"
        ];
        const result = libp2pBootstrap([{name: "defaultConfig", value: false},{name: "multiaddrs", value: multiaddrs},{name: "list", value: true }] as any);
        expect(result.toString()).to.equal([
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa",
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb",
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt",
            "/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ",
            "/ip4/127.0.0.1/tcp/1234/p2p/QmTest1",
            "/ip4/127.0.0.1/tcp/5678/p2p/QmTest2"
        ].toString());
    });

    it('should return list of bootstrap configuration when list option is true', () => {
        const result = libp2pBootstrap([{ name: "list", value: true }] as any);
        expect(result.toString()).to.deep.equal([
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa",
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb",
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt",
            "/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ"
        ].toString());
    });

    it('should return a function by default', () => {
        const result = libp2pBootstrap();
        expect(result).to.be.a('function');
    });

    it('should return a function when options are provided', () => {
        const result = libp2pBootstrap([{name: "defaultConfig", value: false},{name: "list", value: false }] as any);
        expect(result).to.be.a('function');
    });
});
