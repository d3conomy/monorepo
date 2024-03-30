import { expect } from 'chai';
import { LunarPod } from '../src/lunar-pod/index.js';
import { IdReferenceFactory } from 'd3-artifacts';
describe('LunarPod', async () => {
    let lunarPod;
    beforeEach(() => {
        lunarPod = new LunarPod({
            idReferenceFactory: new IdReferenceFactory()
        });
    });
    afterEach(async () => {
        await lunarPod.stop();
    });
    it('should initialize all components and databases', async () => {
        await lunarPod.init();
        const components = lunarPod.getProcesses();
        expect(components.length).to.equal(3);
    });
    it('should initialize Libp2p', async () => {
        await lunarPod.init('libp2p');
        const components = lunarPod.getProcesses();
        expect(components.length).to.equal(1);
        expect(components[0].id).to.equal(lunarPod.libp2p?.id);
    });
    it('should initialize IPFS', async () => {
        await lunarPod.init('ipfs');
        const components = lunarPod.getProcesses();
        console.log(components);
        expect(components.length).to.equal(2);
        expect(components[1].id).to.equal(lunarPod.ipfs?.id);
    });
    it('should initialize OrbitDb', async () => {
        await lunarPod.init('orbitdb');
        const components = lunarPod.getProcesses();
        expect(components.length).to.equal(3);
        expect(components[2].id).to.equal(lunarPod.orbitDb?.id);
    });
    it('should initialize OpenDb', async () => {
        await lunarPod.init('open_db');
        await lunarPod.start();
        const components = lunarPod.getProcesses();
        expect(components.length).to.equal(4);
        expect(components[3].id).to.equal(lunarPod.db.values().next().value.id);
    });
    it('should start all components and databases', async () => {
        await lunarPod.init();
        await lunarPod.start();
        await lunarPod.initOpenDb();
        const components = lunarPod.getProcesses();
        console.log(components);
        expect(components.length).to.equal(4);
    });
    it('should start Libp2p', async () => {
        await lunarPod.init('libp2p');
        await lunarPod.start('libp2p');
        const components = lunarPod.getProcesses();
        expect(components.length).to.equal(1);
        // expect(components[0].id).to.equal(lunarPod.libp2p?.id);
    });
    it('should start IPFS', async () => {
        await lunarPod.init('ipfs');
        await lunarPod.start('ipfs');
        const components = lunarPod.getProcesses();
        expect(components.length).to.equal(2);
        // expect(components[0].id).to.equal(lunarPod.ipfs?.id);
    });
    it('should start OrbitDb', async () => {
        await lunarPod.init('orbitdb');
        await lunarPod.start('orbitdb');
        const components = lunarPod.getProcesses();
        expect(components.length).to.equal(3);
        expect(components[2].id).to.equal(lunarPod.orbitDb?.id);
    });
    it('should stop all components and databases', async () => {
        await lunarPod.init();
        await lunarPod.start();
        await lunarPod.stop();
        const components = lunarPod.getProcesses();
        expect(components.length).to.equal(3);
    });
    it('should stop Libp2p', async () => {
        await lunarPod.init('libp2p');
        await lunarPod.start('libp2p');
        await lunarPod.stop('libp2p');
        const components = lunarPod.getProcesses();
        expect(components.length).to.equal(1);
        expect(components[0].id).to.equal(lunarPod.libp2p?.id);
    });
    it('should stop IPFS', async () => {
        await lunarPod.init('ipfs');
        await lunarPod.start('ipfs');
        await lunarPod.stop('ipfs');
        const components = lunarPod.getProcesses();
        expect(components.length).to.equal(2);
        expect(components[1].id).to.equal(lunarPod.ipfs?.id);
    });
    it('should stop OrbitDb', async () => {
        await lunarPod.init('orbitdb');
        await lunarPod.start('orbitdb');
        await lunarPod.stop('orbitdb');
        const components = lunarPod.getProcesses();
        expect(components.length).to.equal(3);
        expect(components[2].id).to.equal(lunarPod.orbitDb?.id);
    });
    it('should restart all components and databases', async () => {
        await lunarPod.init();
        await lunarPod.start();
        await lunarPod.restart();
        const components = lunarPod.getProcesses();
        expect(components.length).to.equal(3);
    });
    it('should restart Libp2p', async () => {
        await lunarPod.init('libp2p');
        await lunarPod.start('libp2p');
        await lunarPod.restart('libp2p');
        const components = lunarPod.getProcesses();
        expect(components.length).to.equal(1);
        expect(components[0].id).to.equal(lunarPod.libp2p?.id);
    });
    it('should restart IPFS', async () => {
        await lunarPod.init('ipfs');
        await lunarPod.start('ipfs');
        await lunarPod.restart('ipfs');
        const components = lunarPod.getProcesses();
        expect(components.length).to.equal(2);
        expect(components[1].id).to.equal(lunarPod.ipfs?.id);
    });
    it('should restart OrbitDb', async () => {
        await lunarPod.init('orbitdb');
        await lunarPod.start('orbitdb');
        await lunarPod.restart('orbitdb');
        const components = lunarPod.getProcesses();
        expect(components.length).to.equal(3);
        expect(components[2].id).to.equal(lunarPod.orbitDb?.id);
    });
    it('should get the status of all components and databases', async () => {
        await lunarPod.init();
        await lunarPod.start();
        const status = lunarPod.status();
        expect(status.libp2p).to.equal(lunarPod.libp2p?.status());
        expect(status.ipfs).to.equal(lunarPod.ipfs?.status());
        expect(status.orbitdb).to.equal(lunarPod.orbitDb?.status());
        expect(status.db).to.deep.equal(Array.from(lunarPod.db.values()).map(db => db.status()));
    });
    it('should close all the components and databases', async () => {
        await lunarPod.init();
        await lunarPod.start();
        await lunarPod.stop();
        const components = lunarPod.getProcesses();
        expect(components.length).to.equal(3);
    });
});
