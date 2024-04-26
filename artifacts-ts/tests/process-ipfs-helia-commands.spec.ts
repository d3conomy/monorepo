import { expect } from "chai";
import { HeliaLibp2p } from "helia";
import { IProcessCommand, IProcessCommandArgInput, IProcessContainer, IProcessExecuteCommand, Process, ProcessCommands, ProcessType, createProcessContainer, createProcessOption, runCommand } from "../src/process-interface/index.js";
import { dagJson } from "@helia/dag-json";
import { CID } from "multiformats";
import { Libp2p } from "libp2p";
import { JobId, MoonbaseId, PodBayId, PodId, PodProcessId, SystemId } from "../src/id-reference-factory/index.js";
import { ipfsCommands } from "../src/process-ipfs-helia/commands.js";
import { create } from "domain";
import { createLibp2pProcess } from "../src/process-libp2p/process.js";
import { createIpfsInstance, createIpfsProcess } from "../src/process-ipfs-helia/process.js";

describe("IPFS Commands", () => {
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

    afterEach(() => {
        instance?.stop();
        instance = null;
    });

    it("should start IPFS", async () => {
        const executeParams: IProcessExecuteCommand = {
            command: 'start',
            params: [],
        };
        const job = await runCommand(jobId, executeParams, commands);

        expect(job.status).to.equal('finished');
        expect(instance?.libp2p.status).to.equal('started');
    })

    it("should stop IPFS", async () => {
        const executeParams: IProcessExecuteCommand = {
            command: 'start',
            params: [],
        };
        const job = await runCommand(jobId, executeParams, commands);

        expect(job.status).to.equal('finished');
        expect(instance?.libp2p.status).to.equal('started');

        const executeParams2: IProcessExecuteCommand = {
            command: 'stop',
            params: [],
        };
        const job2 = await runCommand(jobId, executeParams2, commands);

        expect(job2.status).to.equal('finished');
        expect(instance?.libp2p.status).to.equal('stopped');
    })

    it("should add and get a JSON object to/from IPFS", async () => {
        const executeParams: IProcessExecuteCommand = {
            command: 'start',
            params: [],
        };
        const job = await runCommand(jobId, executeParams, commands);

        expect(job.status).to.equal('finished');
        expect(instance?.libp2p.status).to.equal('started');

        const executeParams2: IProcessExecuteCommand = {
            command: 'addJson',
            params: [{ name: 'json', value: { hello: 'world' } }],
        };
        const job2 = await runCommand(jobId, executeParams2, commands);

        expect(job2.status).to.equal('finished');
        // console.log(`CID: ${job2.result?.output}`)
        expect(job2.result?.output).to.not.be.undefined;

        // should get the cid

        const executeParams3: IProcessExecuteCommand = {
            command: 'getJson',
            params: [{ name: 'cid', value: job2.result?.output }],
        };
        const job3 = await runCommand(jobId, executeParams3, commands);
        // console.log(`job3: ${job3.result?.output}`)
        expect(job3.status).to.equal('finished');
        // console.log(`JSON: ${job3.result?.output}`)
        expect(job3.result?.output).to.not.be.undefined;

    })
});
