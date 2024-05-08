import { expect } from 'chai';
import { StackFactory, StackTypes, DatabaseStack} from '../src/lunar-pod/stack.js';
import { createId } from './helpers.js';
import { IdReferenceFactory, MoonbaseId, PodBayId, PodId } from '../src/id-reference-factory/index.js';
import { LunarPodOptions } from '../src/lunar-pod/options.js';
import { InstanceOption, InstanceOptions } from '../src/container/options.js';
import { OrbitDbTypes } from '../src/container-orbitdb-open/dbTypes.js';

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
                } as InstanceOption<string>
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
        });
    });
});