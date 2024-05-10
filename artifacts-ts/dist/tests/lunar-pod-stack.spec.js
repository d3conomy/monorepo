import { expect } from 'chai';
import { StackFactory, StackTypes } from '../src/lunar-pod/stack.js';
import { createId } from './helpers.js';
import { IdReferenceFactory } from '../src/id-reference-factory/index.js';
import { LunarPodOptions } from '../src/lunar-pod/options.js';
import { InstanceOptions } from '../src/container/options.js';
import { OrbitDbTypes } from '../src/container-orbitdb-open/dbTypes.js';
import fs from 'fs/promises';
describe('StackFactory', () => {
    describe('createStack', () => {
        it('should create a DatabaseStack', async () => {
            const options = new LunarPodOptions(new InstanceOptions({ options: [
                    {
                        name: 'directory',
                        value: './orbitdb/test2'
                    },
                    {
                        name: 'databaseName',
                        value: 'test2-db'
                    },
                    {
                        name: 'databaseType',
                        value: OrbitDbTypes.EVENTS
                    },
                    {
                        name: 'start',
                        value: true
                    }
                ] }));
            const idReferenceFactory = new IdReferenceFactory();
            const moonbaseId = idReferenceFactory.createIdReference({ type: 'moonbase' });
            const podBayId = idReferenceFactory.createIdReference({ type: 'pod-bay', dependsOn: moonbaseId });
            const podId = idReferenceFactory.createIdReference({ type: 'pod', dependsOn: podBayId });
            const stack = await StackFactory.createStack(StackTypes.Database, podId, idReferenceFactory, options);
            expect(stack.libp2p).to.exist;
            expect(stack.ipfs).to.exist;
            expect(stack.orbitdb).to.exist;
            expect(stack.databases).to.exist;
            if (stack.databases) {
                stack.databases[0].container?.jobs.enqueue({
                    id: createId('job'),
                    command: stack.databases[0].container?.commands.get('put'),
                    params: [
                        {
                            name: 'key',
                            value: 'test-key'
                        },
                        {
                            name: 'value',
                            value: 'test-value'
                        },
                    ]
                });
                for (let i = 0; i < 100; i++) {
                    stack.databases[0].container?.jobs.enqueue({
                        id: createId('job'),
                        command: stack.databases[0].container?.commands.get('put'),
                        params: [
                            {
                                name: 'key',
                                value: `test-key-${i}`
                            },
                            {
                                name: 'value',
                                value: `test-value-${i}`
                            },
                        ]
                    });
                }
                await stack.databases[0].container?.jobs.run();
                const address = await stack.databases[0].container?.jobs.execute({
                    id: createId('job'),
                    command: stack.databases[0].container?.commands.get('address')
                });
                await stack.databases[0].container?.getInstance().close();
                await stack.ipfs?.container?.getInstance().stop();
                await stack.libp2p?.container?.getInstance().stop();
                await fs.rm('./orbitdb/test2', { recursive: true, force: true });
            }
            // await stack.orbitdb.container?.getInstance().stop();
            // await stack.databases[0].container?.getInstance().close();
        });
    });
});
