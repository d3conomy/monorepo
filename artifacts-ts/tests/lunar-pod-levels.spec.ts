import { expect } from 'chai';

import { Libp2pLevel, IpfsLevel, OrbitDbLevel, DatabaseLevel, GossipSubLevel, IpfsFileSystemLevel } from '../src/lunar-pod/levels.js';
import { createId } from './helpers.js';
import { ContainerId, JobId } from '../src/id-reference-factory/index.js';
import { InstanceOption, InstanceOptions } from '../src/container/options.js';
import { OrbitDbContainer } from '../src/container-orbitdb/index.js';
import { CommandArg } from '../src/container/commands.js';
import { OrbitDbTypes } from '../src/container-orbitdb-open/dbTypes.js';

describe('Levels', async () => {
    const containerId = createId("container") as ContainerId;
    const containerId2 = createId("container") as ContainerId;
    const containerId3 = createId("container") as ContainerId;
    const containerId4 = createId("container") as ContainerId;

    it('should create an instance of OrbitDbLevel', async () => {
        const libp2pLevel = new Libp2pLevel({id: containerId});
        await libp2pLevel.init();

        const ipfsLevel = new IpfsLevel({id: containerId2, dependant: libp2pLevel.container});
        await ipfsLevel.init();

        const orbitDbLevel = new OrbitDbLevel({id: containerId3, dependant: ipfsLevel.container});
        await orbitDbLevel.init();

        expect(orbitDbLevel).to.be.an.instanceOf(OrbitDbLevel);
        expect(orbitDbLevel.container).to.be.an.instanceOf(OrbitDbContainer);

        await orbitDbLevel.container?.getInstance().stop();
        await ipfsLevel.container?.getInstance().stop();
        await libp2pLevel.container?.getInstance().stop();
    });

    it('should create an instance of DatabaseLevel', async () => {
        const libp2pLevel = new Libp2pLevel({id: containerId});
        await libp2pLevel.init();

        const ipfsLevel = new IpfsLevel({id: containerId2, dependant: libp2pLevel.container});
        await ipfsLevel.init();

        const orbitdbOptions = new InstanceOptions({options: [
            {
                name: 'directory',
                value: './orbitdb/test1'
            } as InstanceOption<string>
        ]});

        const orbitDbLevel = new OrbitDbLevel({id: containerId3, options: orbitdbOptions, dependant: ipfsLevel.container});
        await orbitDbLevel.init();

        const dboptions: InstanceOptions = new InstanceOptions({options: [
            {
                name: 'databaseName',
                value: 'test1-db'
            } as InstanceOption<string>,
            {
                name: 'databaseType',
                value: OrbitDbTypes.KEYVALUE
            } as InstanceOption<string>
        ]});
        const databaseLevel = new DatabaseLevel({id: containerId4, options: dboptions, dependant: orbitDbLevel.container});
        await databaseLevel.init();

        expect(databaseLevel).to.be.an.instanceOf(DatabaseLevel);

        databaseLevel.container?.jobs.enqueue({
            id: createId('job') as JobId,
            command: databaseLevel.container?.commands.get('put'),
            params: [
                {
                    name: 'key',
                    value: 'test-key'
                } as CommandArg<string>,
                {
                    name: 'value',
                    value: 'test-value'
                } as CommandArg<string>
            ]
        });

        databaseLevel.container?.jobs.enqueue({
            id: createId('job') as JobId,
            command: databaseLevel.container?.commands.get('all')
        });

        await databaseLevel.container?.jobs.run();
        console.log(databaseLevel);

        await databaseLevel.container?.getInstance().close();
        await ipfsLevel.container?.getInstance().stop();
        await libp2pLevel.container?.getInstance().stop();
    });
});