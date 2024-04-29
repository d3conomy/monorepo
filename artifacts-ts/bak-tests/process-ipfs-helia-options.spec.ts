import { expect } from "chai";
import { HeliaLibp2p } from "helia";
import { IProcessCommand, IProcessCommandArgInput, IProcessContainer, IProcessExecuteCommand, Process, ProcessCommands, ProcessType, createProcessContainer, createProcessOption, runCommand } from "../src/process-interface/index.js";
import { dagJson } from "@helia/dag-json";
import { CID } from "multiformats";
import { Libp2p } from "libp2p";
import { JobId, MoonbaseId, PodBayId, PodId, PodProcessId, SystemId } from "../src/id-reference-factory/index.js";
import { ipfsCommands } from "../src/process-ipfs-helia/commands.js";
import { createLibp2pProcess } from "../src/process-libp2p/process.js";
import { createIpfsInstance, createIpfsProcess } from "../src/process-ipfs-helia/process.js";
import { MemoryDatastore } from 'datastore-core';
import { MemoryBlockstore } from 'blockstore-core';
import { LevelBlockstore } from 'blockstore-level';
import { IpfsOptions, ipfsOptions } from '../src/process-ipfs-helia/options.js'
import fs from 'fs/promises';

describe('IpfsOptions', () => {
    let instance: HeliaLibp2p<Libp2p> | null = null;
    let jobId: JobId;
    let commands: ProcessCommands;
    let libp2pProcess: Process;
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

        const process = await createIpfsProcess(podProcessIdFn(), [createProcessOption({ name: "libp2p", value: libp2pProcess?.container?.instance })]);
        
        instance = process.container?.instance as HeliaLibp2p<Libp2p>;
        commands = new ProcessCommands({
            commands: ipfsCommands,
            container: { type: ProcessType.IPFS, instance: instance }
        });
    });

    afterEach(async () => {
        instance?.stop();
        instance = null;
        const path = 'data/pods/pod1';

        await fs.rm(path, { recursive: true, force: true })
    });

    it('should create an instance with default values', () => {
        const options = new IpfsOptions({
            libp2p: libp2pProcess
        });
        // expect(options.libp2p).to.be.undefined;
        expect(options.datastore).to.be.an.instanceOf(MemoryDatastore);
        expect(options.blockstore).to.be.an.instanceOf(LevelBlockstore);
        expect(options.start).to.be.false;
    });

    it('should create an instance with custom values', () => {
        const customValues = {
            libp2p: libp2pProcess,
            datastore: new MemoryDatastore(),
            blockstore: new LevelBlockstore('data/pods/pod1/ipfs/blockstore'),
            start: true,
        };
        const options = new IpfsOptions(customValues);
        expect(options.libp2p).to.deep.equal(customValues.libp2p);
        expect(options.datastore).to.equal(customValues.datastore);
        expect(options.blockstore).to.be.an.instanceOf(LevelBlockstore);
        expect(options.start).to.equal(customValues.start);
    });

    // Add more test cases as needed
});

describe('ipfsOptions', () => {
    it('should return an array of process options', () => {
        const options = ipfsOptions();
        expect(options).to.be.an('array');
        expect(options).to.have.lengthOf(5);
        // Add more assertions for each process option
    });
});
