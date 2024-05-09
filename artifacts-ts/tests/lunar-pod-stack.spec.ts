import { expect } from 'chai';
import { StackFactory, StackTypes, DatabaseStack} from '../src/lunar-pod/stack.js';
import { createId } from './helpers.js';
import { IdReferenceFactory, JobId, MoonbaseId, PodBayId, PodId } from '../src/id-reference-factory/index.js';
import { LunarPodOptions } from '../src/lunar-pod/options.js';
import { InstanceOption, InstanceOptions } from '../src/container/options.js';
import { OrbitDbTypes } from '../src/container-orbitdb-open/dbTypes.js';
import { CommandArg } from './container/commands.js';

describe('StackFactory', () => {
    describe('createStack', () => {
        it('should create a DatabaseStack', async () => {
            const options = new LunarPodOptions(new InstanceOptions({ options: [
                {
                    name: 'directory',
                    value: './orbitdb/test2'
                } as InstanceOption<string>,
                {
                    name: 'databaseName',
                    value: 'test2-db'
                } as InstanceOption<string>,
                {
                    name: 'databaseType',
                    value: OrbitDbTypes.EVENTS
                } as InstanceOption<string>,
                {
                    name: 'start',
                    value: true
                } as InstanceOption<boolean>
            ]}));
            const idReferenceFactory = new IdReferenceFactory();
            const moonbaseId = idReferenceFactory.createIdReference({type: 'moonbase'}) as MoonbaseId;
            const podBayId = idReferenceFactory.createIdReference({type: 'pod-bay', dependsOn: moonbaseId}) as PodBayId;
            const podId = idReferenceFactory.createIdReference({type: 'pod', dependsOn: podBayId}) as PodId;

            console.log(podId)  

            const stack = await StackFactory.createStack<DatabaseStack>(StackTypes.Database, podId, idReferenceFactory, options);

            expect(stack.libp2p).to.exist;
            expect(stack.ipfs).to.exist;
            expect(stack.orbitdb).to.exist;
            expect(stack.databases).to.exist;

            stack.databases[0].container?.jobs.enqueue({
                id: createId('job') as JobId,
                command: stack.databases[0].container?.commands.get('put'),
                params: [
                    {
                        name: 'key',
                        value: 'test-key'
                    } as CommandArg<string>,
                    {
                        name: 'value',
                        value: 'test-value'
                    } as CommandArg<string>,
                ]
            });

            for (let i = 0; i < 100; i++) {
                stack.databases[0].container?.jobs.enqueue({
                    id: createId('job') as JobId,
                    command: stack.databases[0].container?.commands.get('put'),
                    params: [
                        {
                            name: 'key',
                            value: `test-key-${i}`
                        } as CommandArg<string>,
                        {
                            name: 'value',
                            value: `test-value-${i}`
                        } as CommandArg<string>,
                    ]
                });
            }

            await stack.databases[0].container?.jobs.run();

            const address = await stack.databases[0].container?.jobs.execute({
                id: createId('job') as JobId,
                command: stack.databases[0].container?.commands.get('address')
            });

            console.log(address?.result?.output);

            await stack.databases[0].container?.getInstance().close();
            await stack.ipfs.container?.getInstance().stop();
            await stack.libp2p.container?.getInstance().stop();

            // await stack.orbitdb.container?.getInstance().stop();
            // await stack.databases[0].container?.getInstance().close();
        });
    });
});