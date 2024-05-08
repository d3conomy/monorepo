import { expect } from 'chai';
import { StackFactory, StackTypes } from '../src/lunar-pod/stack.js';
import { IdReferenceFactory } from '../src/id-reference-factory/index.js';
import { LunarPodOptions } from '../src/lunar-pod/options.js';
import { InstanceOptions } from '../src/container/options.js';
import { OrbitDbTypes } from '../src/container-orbitdb-open/dbTypes.js';
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
                    }
                ] }));
            const idReferenceFactory = new IdReferenceFactory();
            const moonbaseId = idReferenceFactory.createIdReference({ type: 'moonbase' });
            const podBayId = idReferenceFactory.createIdReference({ type: 'pod-bay', dependsOn: moonbaseId });
            const podId = idReferenceFactory.createIdReference({ type: 'pod', dependsOn: podBayId });
            console.log(podId);
            const stack = await StackFactory.createStack(StackTypes.Database, podId, idReferenceFactory, options);
            expect(stack.libp2p).to.exist;
            expect(stack.ipfs).to.exist;
            expect(stack.orbitdb).to.exist;
            expect(stack.databases).to.exist;
        });
    });
});
