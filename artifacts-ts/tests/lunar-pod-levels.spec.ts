import { expect } from 'chai';
import fs from 'fs/promises';

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
    const containerId5 = createId("container") as ContainerId;

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

    it('should create an instance of DatabaseLevel', async function (): Promise<void> {
        this.timeout(50000);
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

        for (let i = 0; i < 100; i++) {
            databaseLevel.container?.jobs.enqueue({
                id: createId('job') as JobId,
                command: databaseLevel.container?.commands.get('put'),
                params: [
                    {
                        name: 'key',
                        value: `test-key-${i}`
                    } as CommandArg<string>,
                    {
                        name: 'value',
                        value: `test-value-${i}`
                    } as CommandArg<string>
                ]
            });
        }

        const address = await databaseLevel.container?.jobs.execute({
            id: createId('job') as JobId,
            command: databaseLevel.container?.commands.get('address')
        });
        console.log(address?.result?.output);

        const dboptions2: InstanceOptions = new InstanceOptions({options: [
            {
                name: 'databaseName',
                value: address?.result?.output
            } as InstanceOption<string>,
            {
                name: 'databaseType',
                value: OrbitDbTypes.KEYVALUE
            } as InstanceOption<string>
        ]});
        const databaseLevel2 = new DatabaseLevel({id: containerId5, options: dboptions2, dependant: orbitDbLevel.container});
        await databaseLevel2.init();

        const jobs = await databaseLevel.container?.jobs.run(true);
        // console.log(jobs?.forEach((job) => {
        //     console.log(job.result?.output);
        // }));

        databaseLevel.container?.jobs.execute({
            id: createId('job') as JobId,
            command: databaseLevel.container?.commands.get('all')
        });

        jobs?.forEach((job2) => {
            // console.log(job2.result?.output);
            databaseLevel2.container?.jobs.enqueue({
                id: createId('job') as JobId,
                command: databaseLevel2.container?.commands.get('get'),
                params: [
                    {
                        name: 'hash',
                        value: job2.params ? job2.params[0].value : undefined
                    } as CommandArg<string | undefined>
                ]
            });
        });

        const jobs2 = await databaseLevel2.container?.jobs.run(true);
        // console.log(jobs2?.forEach((job2) => {
        //     console.log(job2.result?.output);
        // }));



        await databaseLevel.container?.getInstance().close();
        await databaseLevel2.container?.getInstance().close();
        await orbitDbLevel.container?.getInstance().stop();
        await ipfsLevel.container?.getInstance().stop();
        await libp2pLevel.container?.getInstance().stop();

        await fs.rm('./orbitdb/test1', {recursive: true, force: true});
    });
});