import { expect } from 'chai';
import { createProcessOption } from '../src/process-interface/processOptions.js';
import { createIpfsProcess } from '../src/process-ipfs-helia/index.js';
import { JobId, MoonbaseId, PodBayId, PodId, PodProcessId, SystemId } from "../src/id-reference-factory/index.js";
import { createLibp2pProcess } from '../src/process-libp2p/process.js';
import { createOrbitDbProcess, OrbitDbProcess } from '../src/process-orbitdb/process.js';
const podProcessIdFn = () => {
    return new PodProcessId({
        name: 'process1',
        podId: new PodId({ name: 'pod1', podBayId: new PodBayId({ name: 'podBay1', moonbaseId: new MoonbaseId({ name: 'moonbase1', systemId: new SystemId() }) }) })
    });
};
describe('OrbitDbProcess', () => {
    let orbitDbProcess;
    let instance = null;
    let jobId;
    let process;
    let commands;
    let libp2pProcess;
    let podProcessId;
    beforeEach(async () => {
        instance = null;
        jobId = new JobId({
            name: 'start',
            componentId: new SystemId()
        });
        libp2pProcess = await createLibp2pProcess(podProcessIdFn());
        process = await createIpfsProcess(podProcessIdFn(), [createProcessOption({ name: "libp2p", value: libp2pProcess })]);
        instance = process.container?.instance;
        const podProcessId = podProcessIdFn();
        orbitDbProcess = await createOrbitDbProcess(podProcessId, [createProcessOption({ name: "ipfs", value: process })]);
    });
    afterEach(async () => {
        // await orbitDbProcess.container?.instance?.ipfs.libp2p.stop()
        // await orbitDbProcess.container?.instance?.stop()
        // await libp2pProcess.container?.instance?.stop()
        await instance?.stop();
        await process.container?.instance?.stop();
        await libp2pProcess.container?.instance?.stop();
        instance = null;
    });
    it('should create an instance of OrbitDbProcess', async () => {
        expect(orbitDbProcess).to.be.an.instanceOf(OrbitDbProcess);
        // await orbitDbProcess.container?.instance?.ipfs.libp2p.stop()
        // await orbitDbProcess.container?.instance?.stop()
        // await process.container?.instance?.libp2p.stop()
        // await libp2pProcess.container?.instance?.stop()
        // await instance?.stop();
    });
    // it('should initialize OrbitDbProcess', async () => {
    //     // await orbitDbProcess.init();
    //     expect(orbitDbProcess.id).to.not.be.undefined;
    //     await orbitDbProcess.container?.instance?.ipfs.libp2p.stop()
    //     await orbitDbProcess.container?.instance?.stop()
    //     await process.container?.instance?.libp2p.stop()
    //     await libp2pProcess.container?.instance?.stop()
    //     await instance?.stop();
    // });
});
