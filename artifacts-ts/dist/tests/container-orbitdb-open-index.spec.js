import { expect } from 'chai';
import { OrbitDbContainer } from '../src/container-orbitdb/index.js';
import { createId } from './helpers.js';
import { InstanceOptions } from '../src/container/options.js';
import { Libp2pContainer } from '../src/container-libp2p/index.js';
import { IpfsContainer } from '../src/container-ipfs-helia/index.js';
import { OrbitDbTypes } from '../src/container-orbitdb-open/dbTypes.js';
import { DatabaseContainer } from '../src/container-orbitdb-open/index.js';
describe('DatabaseContainer', async () => {
    const containerId = createId("container");
    const containerId2 = createId("container");
    const containerId3 = createId("container");
    const containerId4 = createId("container");
    it('should create an instance of OrbitDbContainer', async () => {
        const libp2pContainer = new Libp2pContainer(containerId);
        await libp2pContainer.init();
        const heliaOptions = new InstanceOptions({ options: [
                {
                    name: "start",
                    value: true,
                },
                {
                    name: "libp2p",
                    value: libp2pContainer,
                }
            ] });
        const ipfsContainer = new IpfsContainer(containerId2, heliaOptions);
        await ipfsContainer.init();
        const orbitDbOptions = new InstanceOptions({ options: [
                {
                    name: "ipfs",
                    value: ipfsContainer,
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
        const orbitDbContainer = new OrbitDbContainer(containerId3, orbitDbOptions);
        await orbitDbContainer.init();
        expect(orbitDbContainer).to.be.an.instanceOf(OrbitDbContainer);
        const openDatabaseOptions = new InstanceOptions({ options: [
                {
                    name: "orbitDb",
                    value: orbitDbContainer,
                },
                {
                    name: "databaseName",
                    value: "test-keyvalue-db",
                },
                {
                    name: "databaseType",
                    value: OrbitDbTypes.KEYVALUE,
                }
            ] });
        const database = new DatabaseContainer(containerId4, openDatabaseOptions);
        await database.init();
        expect(database).to.be.an.instanceOf(DatabaseContainer);
        database.jobs.enqueue({
            id: createId('job'),
            command: database.commands.get('address')
        });
        database.jobs.enqueue({
            id: createId('job'),
            command: database.commands.get('close')
        });
        const jobs = await database.jobs.run();
        console.log(jobs);
        expect(database.jobs.completed.length).to.equal(2);
        // await orbitDbContainer.getInstance().stop();
        await ipfsContainer.getInstance().stop();
        await libp2pContainer.getInstance().stop();
    });
});