import { expect } from 'chai';
import { IpfsProcess } from '../src/ipfs-process/index.js';
import { createIdentityProvider } from '../src/orbitdb-process/OrbitDbIdentityProvider.js';
import { OrbitDbOptions } from '../src/orbitdb-process/OrbitDbOptions.js';
import { MoonbaseId, PodBayId, PodId, PodProcessId, SystemId } from 'd3-artifacts';
import { createLibp2pProcessOptions } from '../src/libp2p-process/processOptions.js';
import { Libp2pProcessConfig } from '../src/libp2p-process/processConfig.js';
import { Libp2pProcess } from '../src/libp2p-process/process.js';
import { IpfsOptions } from '../src/ipfs-process/IpfsOptions.js';
import sinon from 'sinon';
describe('OrbitDbOptions', () => {
    let ipfs;
    beforeEach(async () => {
        // Initialize the IpfsProcess instance
        let systemId = new SystemId();
        let moonbaseId = new MoonbaseId({ systemId });
        let podBayId = new PodBayId({ moonbaseId });
        let podId = new PodId({ podBayId });
        let processId = new PodProcessId({ podId });
        let libp2pProcessConfig = new Libp2pProcessConfig({
            autoStart: true
        });
        let libp2pProcessOptions = await createLibp2pProcessOptions(libp2pProcessConfig);
        let libp2pProcess = new Libp2pProcess({ id: processId, options: libp2pProcessOptions });
        let ipfsProcessId = new PodProcessId({ podId });
        let ipfsOptions = new IpfsOptions({ libp2p: libp2pProcess, start: true });
        ipfs = new IpfsProcess({ id: ipfsProcessId, options: ipfsOptions });
    });
    it('should throw an error if no Ipfs process is provided', () => {
        expect(() => new OrbitDbOptions({})).to.throw('No Ipfs process found');
    });
    it('should create an instance with default values', () => {
        const options = new OrbitDbOptions({ ipfs });
        expect(options.ipfs).to.equal(ipfs);
        expect(options.enableDID).to.be.false;
        expect(options.identitySeed).to.be.undefined;
        expect(options.identityProvider).to.be.undefined;
        expect(options.directory).to.not.be.undefined;
    });
    it('should create an instance with custom values', () => {
        const identitySeed = new Uint8Array(32);
        const identityProvider = createIdentityProvider({ identitySeed });
        const directory = './custom-directory';
        const options = new OrbitDbOptions({
            ipfs,
            enableDID: true,
            identitySeed,
            identityProvider,
            directory
        });
        expect(options.ipfs).to.equal(ipfs);
        expect(options.enableDID).to.be.true;
        expect(options.identitySeed).to.equal(identitySeed);
        // expect(options.identityProvider).to.equal(identityProvider);
        expect(options.directory).to.equal(directory);
    });
    it('should create an instance with a generated identity provider if enableDID is true', () => {
        // generate random 32 bit seed
        const identitySeed = new Uint8Array(32);
        const identityProvider = createIdentityProvider({ identitySeed });
        const options = new OrbitDbOptions({
            ipfs,
            enableDID: true,
            identitySeed,
            identityProvider
        });
        expect(options.ipfs).to.equal(ipfs);
        expect(options.enableDID).to.be.true;
        expect(options.identitySeed).to.equal(identitySeed);
        // expect(options.identityProvider).to.equal(identityProvider);
        expect(options.directory).to.not.be.undefined;
        sinon.restore();
    });
});
