import { expect } from 'chai';
import { OrbitDbContainer } from '../src/container-orbitdb/index.js';
import { createId } from './helpers.js';
import { InstanceOptions } from '../src/container/options.js';
import { Libp2pContainer } from '../src/container-libp2p/index.js';
import { IpfsContainer } from '../src/container-ipfs-helia/index.js';
describe('OrbitDbContainer', async () => {
    const containerId = createId("container");
    const containerId2 = createId("container");
    it('should create an instance of OrbitDbContainer', async () => {
        const libp2pContainer = new Libp2pContainer(containerId);
        await libp2pContainer.init();
        const heliaOptions = new InstanceOptions({ options: [
                {
                    name: "libp2p",
                    value: libp2pContainer.getInstance(),
                }
            ] });
        const ipfsContainer = new IpfsContainer(containerId2, heliaOptions);
        await ipfsContainer.init();
        const orbitDbOptions = new InstanceOptions({ options: [
                {
                    name: "ipfs",
                    value: ipfsContainer.getInstance(),
                },
                {
                    name: "enableDID",
                    value: true,
                },
                {
                    name: "identitySeed",
                    value: new Uint8Array(32),
                },
                {
                    name: "directory",
                    value: "./pods/test/orbitdb",
                },
            ] });
        const orbitDbContainer = new OrbitDbContainer(containerId, orbitDbOptions);
        await orbitDbContainer.init();
        expect(orbitDbContainer).to.be.an.instanceOf(OrbitDbContainer);
        await orbitDbContainer.getInstance().stop();
        await ipfsContainer.getInstance().stop();
        await libp2pContainer.getInstance().stop();
        // orbitDbContainer.jobs.enqueue({
        //     id: createId('job') as JobId,
        //     command: orbitDbContainer.commands.get('address')
        // });
        // orbitDbContainer.jobs.enqueue({
        //     id: createId('job') as JobId,
        //     command: orbitDbContainer.commands.get('close')
        // });
        // await orbitDbContainer.jobs.run();
        // expect(orbitDbContainer.jobs.completed.length).to.equal(2);
    });
});
