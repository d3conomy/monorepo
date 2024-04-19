import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Libp2p, createLibp2p } from 'libp2p';
import { IProcessExecuteCommand, ProcessCommands, createProcessCommand, createProcessCommandArgs, runCommand } from "../src/process-interface/index.js";
import { libp2pCommands } from '../src/process-libp2p/commands.js';
import { JobId, SystemId } from '../src/id-reference-factory/index.js';

describe('ProcessCommands', () => {
    let process: Libp2p;
    let commands: ProcessCommands;

    beforeEach( async () => {
        process = await createLibp2p();
        commands = libp2pCommands;
        if (commands.process) {
            commands.process.process = process;
        }
    });

    afterEach( async () => {
        await process.stop();
    });

    it('should start the process', async () => {

        const jobId = new JobId({
            name: 'start',
            componentId: new SystemId()
        });
        const executeParams: IProcessExecuteCommand = {
            command: 'start',
            params: [],
        }
        const job = await runCommand(jobId, executeParams, commands);
        expect(process.status).to.equal('started');
    });

    it('should stop the process', async () => {
        const jobId = new JobId({
            name: 'start',
            componentId: new SystemId()
        });
        const executeParams: IProcessExecuteCommand = {
            command: 'start',
            params: [],
        }
        const job = await runCommand(jobId, executeParams, commands);
        expect(process.status).to.equal('started')

        const jobId2 = new JobId({
            name: 'stop',
            componentId: new SystemId()
        });
        const executeParams2: IProcessExecuteCommand = {
            command: 'stop',
            params: [],
        }
        const job2 = await runCommand(jobId2, executeParams2, commands);
        expect(process.status).to.equal('stopped');
    });

    it('should return the process status', async () => {
        const jobId = new JobId({
            name: 'status',
            componentId: new SystemId()
        });
        const executeParams: IProcessExecuteCommand = {
            command: 'status',
            params: [],
        }
        const job = await runCommand(jobId, executeParams, commands);
        console.log(job)
        expect(job.result?.output).to.equal('started');
    });

    it('should return the process peerId', async () => {
        const jobId = new JobId({
            name: 'peerId',
            componentId: new SystemId()
        });
        const executeParams: IProcessExecuteCommand = {
            command: 'peerId',
            params: [],
        }
        const job = await runCommand(jobId, executeParams, commands);
        console.log(job)
        expect(job.result?.output.toString()).to.be.a('string');
    });

    it('should return the process multiaddrs', async () => {
        const jobId = new JobId({
            name: 'multiaddrs',
            componentId: new SystemId()
        });
        const executeParams: IProcessExecuteCommand = {
            command: 'multiaddrs',
            params: [],
        }

        const job = await runCommand(jobId, executeParams, commands);
        console.log(job)
        expect(job.result?.output).to.be.an('array');
    });

    it('should return the process peers', async () => {
        const jobId = new JobId({
            name: 'peers',
            componentId: new SystemId()
        });
        const executeParams: IProcessExecuteCommand = {
            command: 'peers',
            params: [],
        }

        const job = await runCommand(jobId, executeParams, commands);
        console.log(job)
        expect(job.result?.output).to.be.an('array');
    });

    it('should return the process protocols', async () => {
        const jobId = new JobId({
            name: 'protocols',
            componentId: new SystemId()
        });
        const executeParams: IProcessExecuteCommand = {
            command: 'protocols',
            params: [],
        }

        const job = await runCommand(jobId, executeParams, commands);
        console.log(job)
        expect(job.result?.output).to.be.an('array');
    });
});
