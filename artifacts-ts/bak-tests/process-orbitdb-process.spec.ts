import { expect } from 'chai';
import { createProcess } from '../src/process-interface/process.js';
import { IProcessOption, createProcessOption, injectDefaultValues, mapProcessOptions } from '../src/process-interface/processOptions.js';
import { IpfsProcess, createIpfsProcess, ipfsCommands } from '../src/process-ipfs-helia/index.js';
import { JobId, MoonbaseId, PodBayId, PodId, PodProcessId, SystemId } from "../src/id-reference-factory/index.js";
import { IProcessCommand, IProcessCommandArgInput, IProcessContainer, IProcessExecuteCommand, Process, ProcessCommands, ProcessType, createProcessContainer, runCommand } from "../src/process-interface/index.js";
import { HeliaLibp2p } from 'helia';
import { Libp2p } from 'libp2p';
import { createIdentityProvider } from '../src/process-orbitdb/identityProvider.js';
import { orbitDbOptions, OrbitDbOptions } from '../src/process-orbitdb/options.js';
import { createLibp2pProcess } from '../src/process-libp2p/process.js';
import { createOrbitDbProcess, OrbitDbProcess } from '../src/process-orbitdb/process.js';

const podProcessIdFn = () => { return new PodProcessId({
    name: 'process1',
    podId: new PodId({ name: 'pod1', podBayId: new PodBayId({ name: 'podBay1', moonbaseId: new MoonbaseId({ name: 'moonbase1', systemId: new SystemId()}) }) })
});}

describe('OrbitDbProcess', () => {
    let orbitDbProcess: OrbitDbProcess;
    let instance: HeliaLibp2p<Libp2p> | null = null;
    let jobId: JobId;
    let process: IpfsProcess;
    let commands: ProcessCommands;
    let libp2pProcess: Process<ProcessType.LIBP2P>;
    let podProcessId: PodProcessId

    beforeEach( async () => {
        instance = null;
        jobId = new JobId({
            name: 'start',
            componentId: new SystemId()
        });

        libp2pProcess = await createLibp2pProcess(podProcessIdFn());

        process = await createIpfsProcess(podProcessIdFn(), [createProcessOption({ name: "libp2p", value: libp2pProcess })]);
        
        instance = process.container?.instance as HeliaLibp2p<Libp2p>;
        
        const podProcessId = podProcessIdFn();
        orbitDbProcess = await createOrbitDbProcess(podProcessId,[createProcessOption({name: "ipfs", value: process })]);
    });

    afterEach(async () => {
        // await orbitDbProcess.container?.instance?.ipfs.libp2p.stop()
        // await orbitDbProcess.container?.instance?.stop()

        // await libp2pProcess.container?.instance?.stop()
        await instance?.stop();
        await process.container?.instance?.stop()
        await libp2pProcess.container?.instance?.stop()
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
