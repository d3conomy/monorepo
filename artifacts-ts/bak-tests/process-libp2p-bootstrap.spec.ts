import { expect } from 'chai';
import { libp2pBootstrap } from '../src/process-libp2p/bootstrap.js'

describe('libp2pBootstrap', () => {
    let result = [];


    afterEach(() => {
        // Reset the module
        result = [];
        libp2pBootstrap();
    })

    it('should return a function by default', () => {
        result = libp2pBootstrap();
        expect(result).to.be.lengthOf(1);
        // console.log(JSON.stringify(result));
        // expect(result[0]).to.be.a('function'); 
    });

    it('should return a function when options are provided', () => {
        result = libp2pBootstrap({"1": {name: "defaultConfig", value: false},"2": {name: "list", value: false }});
        expect(result).to.be.lengthOf(1);
        expect(result).to.be.a('function');
    });


    it('should return default bootstrap configuration when no options are provided', () => {
        result = libp2pBootstrap({"list": {name: "list", value: true }});
        expect(result).to.deep.equal([
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa",
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb",
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt",
            "/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ"
        ]);
    });

    it('should return list of bootstrap configuration when list option is true', () => {
        result = libp2pBootstrap({"list": { name: "list", value: true }, "defaultConfig": { name: "defaultConfig", value: true }});
        expect(result).to.deep.equal([
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa",
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb",
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt",
            "/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ"
        ]);
    });

    it('should return custom bootstrap configuration when multiaddrs option is provided', () => {
        const multiaddrs = [
            "/ip4/127.0.0.1/tcp/1234/p2p/QmTest1",
            "/ip4/127.0.0.1/tcp/5678/p2p/QmTest2"
        ];
        result = libp2pBootstrap({"defaultConfig": {name: "defaultConfig", value: false},"multiaddrs": {name: "multiaddrs", value: multiaddrs},"list": {name: "list", value: true }});
        expect(result).to.deep.equal([
            "/ip4/127.0.0.1/tcp/1234/p2p/QmTest1",
            "/ip4/127.0.0.1/tcp/5678/p2p/QmTest2"
        ]);
    });


});
