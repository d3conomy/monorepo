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
import { OrbitDbProcess, createOrbitDbProcess } from '../src/process-orbitdb/process.js';

describe('OrbitDbOptions', () => {
    let instance: HeliaLibp2p<Libp2p> | null = null;
    let jobId: JobId;
    let process: IpfsProcess;
    let commands: ProcessCommands;
    let libp2pProcess: Process;
    let orbitDbProcess: Process;
    let podProcessId: PodProcessId

    beforeEach( async () => {
        instance = null;
        jobId = new JobId({
            name: 'start',
            componentId: new SystemId()
        });

        const podProcessIdFn = () => { return new PodProcessId({
            name: 'process1',
            podId: new PodId({ name: 'pod1', podBayId: new PodBayId({ name: 'podBay1', moonbaseId: new MoonbaseId({ name: 'moonbase1', systemId: new SystemId()}) }) })
        });}

        libp2pProcess = await createLibp2pProcess(podProcessIdFn());

        process = await createIpfsProcess(podProcessIdFn(), [createProcessOption({ name: "libp2p", value: libp2pProcess?.container?.instance })]);
        
        instance = process.container?.instance as HeliaLibp2p<Libp2p>;
    });
    //     commands = new ProcessCommands({
    //         commands: ipfsCommands,
    //         container: { type: ProcessType.IPFS, instance: instance }
    //     });

    //     orbitDbProcess = await createOrbitDbProcess(podProcessIdFn(), [createProcessOption({ name: "ipfs", value: instance })]);

    //     expect(orbitDbProcess).to.be.an.instanceOf(OrbitDbProcess);
    // });

    afterEach(async () => {
        instance?.stop();
        instance = null;
        const path = 'data/pods/pod1';

        // await fs.rm(path, { recursive: true, force: true }) 
    });

    it('should create an instance of OrbitDbOptions with default values', () => {
        const options = new OrbitDbOptions({ipfs: process });
        // expect(options.ipfs).to.equal(ipfsProcess);
        expect(options.enableDID).to.be.false;
        expect(options.identitySeed).to.be.undefined;
        expect(options.identityProvider).to.be.undefined;
        // expect(options.directory).to.equal(`./data/pods/${ipfsProcess.id.podId.toString()}/orbitdb`);
    });

    it('should create an instance of OrbitDbOptions with custom values', () => {
        const customValues = {
            ipfs: process,
            enableDID: true,
            identitySeed: new Uint8Array(32),
            identityProvider: undefined,
            directory: './custom-directory'
        };
        const options = new OrbitDbOptions(customValues);
        console.log(`orbitDbOptions: ${options.ipfs.id}`)
        expect(options.ipfs.container?.instance).to.equal(instance);
        // expect(options.identityProvider).to.equal(customValues.identityProvider);
        expect(options.directory).to.equal(customValues.directory);
    });

    it('should throw an error if no Ipfs process is provided', () => {
        expect(() => new OrbitDbOptions({ ipfs: undefined })).to.throw('No Ipfs process found');
    });

    // Add more test cases as needed

});
