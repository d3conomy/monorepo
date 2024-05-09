import { expect } from 'chai';
import { LunarPod } from '../src/lunar-pod/index.js';
import { IdReferenceFactory } from '../src/id-reference-factory/index.js';
import { createId } from './helpers.js';
import { LunarPodOptions } from '../src/lunar-pod/options.js';
import { InstanceOptions, InstanceOptionsList } from '../src/container/options.js';
import { OrbitDbTypes } from '../src/container-orbitdb-open/dbTypes.js';
describe('LunarPod', () => {
    let lunarPod;
    beforeEach(() => {
        const idReferenceFactory = new IdReferenceFactory();
        const podId = createId('pod');
        const options = new LunarPodOptions(new InstanceOptions({ options: new InstanceOptionsList([
                {
                    name: 'directory',
                    value: './orbitdb/test3'
                },
                {
                    name: 'databaseName',
                    value: 'test3-db'
                },
                {
                    name: 'databaseType',
                    value: OrbitDbTypes.EVENTS
                },
                {
                    name: 'start',
                    value: true
                }
            ])
        }));
        lunarPod = new LunarPod({
            id: podId,
            options: options,
            idReferenceFactory: idReferenceFactory,
        });
    });
    afterEach(async () => {
        await lunarPod.stop();
    });
    it('should create a LunarPod', async () => {
        await lunarPod.init();
        expect(lunarPod.id).to.exist;
    });
});
