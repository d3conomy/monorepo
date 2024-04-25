import { expect } from 'chai';
import { mdns } from '@libp2p/mdns';
import { multiaddr } from '@multiformats/multiaddr';
import { libp2pBootstrap } from '../src/process-libp2p/bootstrap.js';
import { peerDiscovery, peerDiscoveryOptions } from '../src/process-libp2p/peerDiscovery.js';
describe('peerDiscovery', () => {
    it('should return an empty array when all options are set to false', () => {
        const result = peerDiscovery({
            enableMDNS: false,
            enableBootstrap: false,
            useDefaultBootstrap: false,
            bootstrapMultiaddrs: []
        });
        expect(result).to.be.an('array').that.is.empty;
    });
    it('should include libp2pBootstrap when enableBootstrap is true and useDefaultBootstrap is true', () => {
        const result = peerDiscovery({
            enableMDNS: false,
            enableBootstrap: true,
            useDefaultBootstrap: true,
            bootstrapMultiaddrs: []
        });
        console.log(result.toString());
        expect(result.toString()).to.deep.include(libp2pBootstrap());
    });
    it('should include libp2pBootstrap when enableBootstrap is true and bootstrapMultiaddrs is not empty', () => {
        const multiaddrs = [multiaddr('/ip4/127.0.0.1/tcp/4001')];
        const result = peerDiscovery({
            enableMDNS: false,
            enableBootstrap: true,
            useDefaultBootstrap: false,
            bootstrapMultiaddrs: multiaddrs
        });
        expect(result.toString()).to.deep.include(libp2pBootstrap({
            defaultConfig: false,
            multiaddrs
        }));
    });
    it('should include mdns when enableMDNS is true', () => {
        const result = peerDiscovery({
            enableMDNS: true,
            enableBootstrap: false,
            useDefaultBootstrap: false,
            bootstrapMultiaddrs: []
        });
        expect(result.toString()).to.deep.include(mdns());
    });
});
describe('peerDiscoveryOptions', () => {
    it('should have the correct number of options', () => {
        expect(peerDiscoveryOptions).to.have.lengthOf(4);
    });
    it('should have the correct default values', () => {
        const defaultValues = [
            { name: 'enableMDNS', defaultValue: false },
            { name: 'enableBootstrap', defaultValue: true },
            { name: 'useDefaultBootstrap', defaultValue: false },
            { name: 'bootstrapMultiaddrs', defaultValue: [] }
        ];
        defaultValues.forEach(({ name, defaultValue }) => {
            const option = peerDiscoveryOptions.find(opt => opt.name === name);
            expect(option).to.exist;
            expect(option.defaultValue).to.deep.equal(defaultValue);
        });
    });
});
