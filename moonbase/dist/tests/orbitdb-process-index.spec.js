import { expect } from 'chai';
import { MoonbaseId, PodBayId, PodId, PodProcessId, SystemId } from "d3-artifacts";
import { OrbitDbProcess } from '../src/orbitdb-process/index.js';
import { Libp2pProcessConfig } from '../src/libp2p-process/processConfig.js';
import { createLibp2pProcessOptions } from '../src/libp2p-process/processOptions.js';
import { Libp2pProcess } from '../src/libp2p-process/process.js';
import { IpfsOptions } from '../src/ipfs-process/IpfsOptions.js';
import { IpfsProcess } from '../src/ipfs-process/index.js';
import { OrbitDbOptions } from '../src/orbitdb-process/OrbitDbOptions.js';
describe('OrbitDbProcess', () => {
    let libp2pProcess;
    let orbitDbProcess;
    let ipfsProcess;
    beforeEach(async () => {
        const systemId = new SystemId();
        const moonbaseId = new MoonbaseId({ systemId });
        const podBayId = new PodBayId({ moonbaseId });
        const podId = new PodId({ podBayId });
        const id = new PodProcessId({ podId });
        const libp2pProcessConfig = new Libp2pProcessConfig({
            autoStart: true
        });
        const libp2pProcessOptions = await createLibp2pProcessOptions(libp2pProcessConfig);
        libp2pProcess = new Libp2pProcess({ id, options: libp2pProcessOptions });
        await libp2pProcess.init();
        const ipfsOptions = new IpfsOptions({
            libp2p: libp2pProcess,
            start: false
        });
        const ipfsId = new PodProcessId({ podId });
        ipfsProcess = new IpfsProcess({
            id: ipfsId,
            options: ipfsOptions
        });
        await ipfsProcess.init();
        // await ipfsProcess.start();
        const orbitDbOptions = new OrbitDbOptions({
            ipfs: ipfsProcess,
            enableDID: true
        });
        const orbitDbId = new PodProcessId({ podId });
        orbitDbProcess = new OrbitDbProcess({
            id: orbitDbId,
            options: orbitDbOptions
        });
    });
    afterEach(async () => {
        await orbitDbProcess.stop();
        await ipfsProcess.stop();
        await libp2pProcess.stop();
    });
    it('should create an OrbitDb process', async () => {
        await orbitDbProcess.init();
        expect(orbitDbProcess.process).to.exist;
        await orbitDbProcess.stop();
    });
    it('should throw an error if no Ipfs process is provided', () => {
        expect(() => new OrbitDbOptions({})).to.throw('No Ipfs process found');
    });
    // it('should open a database', async () => {
    //     await orbitDbProcess.init();
    //     console.log(`OrbitDb process created on OrbitDbProcess: ${orbitDbProcess.process} with Libp2p Peer Id: ${orbitDbProcess.process?.ipfs.libp2p.peerId}`)
    //     console.log(`AddEventListener: ${orbitDbProcess.process?.ipfs.libp2p.services.pubsub?.eventEmitter}`)
    //     const db = await orbitDbProcess.open({databaseName: 'test-database', databaseType: 'keyvalue'});
    //     expect(db).to.exist;
    //     await db.close();
    //     await orbitDbProcess.stop();
    // });
});
