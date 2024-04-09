import { expect } from 'chai';
import { MoonbaseId, PodBayId, PodId, PodProcessId, ProcessStage, SystemId } from 'd3-artifacts';
import { connectionProtector, createSwarmKey } from '../src/libp2p-process/connectionProtector.js';
import { createLibp2pProcessOptions } from '../src/libp2p-process/processOptions.js';
import { Libp2pProcess } from '../src/libp2p-process/process.js';
import { Libp2pProcessConfig } from '../src/libp2p-process/processConfig.js';
describe('connectionProtector', () => {
    it('should create a connection protector pskey', () => {
        const swarmKeyEncoded = createSwarmKey();
        expect(swarmKeyEncoded).to.be.a('Uint8Array');
    });
    it('should create a connection protector', () => {
        const protector = connectionProtector();
        expect(protector).to.be.a('function');
    });
});
describe('connectionProtectorLibp2pPrivateSwarm', () => {
    let process;
    beforeEach(async () => {
        const systemId = new SystemId();
        const moonbaseId = new MoonbaseId({ systemId });
        const podBayId = new PodBayId({ moonbaseId });
        const podId = new PodId({ podBayId });
        const id = new PodProcessId({ podId });
        const libp2pConfig = new Libp2pProcessConfig({
            enablePrivateSwarm: true
        });
        const options = await createLibp2pProcessOptions({
            processConfig: libp2pConfig
        });
        process = new Libp2pProcess({ id, options });
        console.log(process);
        expect(process).to.be.an.instanceOf(Libp2pProcess);
    });
    afterEach(async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (process && process.status() === ProcessStage.STARTED) {
            await process.stop();
        }
    });
    it('should create a libp2p private swarm', async () => {
        await process.init();
        await process.start();
        expect(process.status()).to.equal('started');
    });
});
