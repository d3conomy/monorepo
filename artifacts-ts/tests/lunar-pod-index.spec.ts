import { expect } from 'chai';
import { LunarPod } from '../src/lunar-pod/index.js';
import { IdReferenceFactory, PodId } from '../src/id-reference-factory/index.js';
import { createId } from './helpers.js';
import { LunarPodOptions } from '../src/lunar-pod/options.js';
import { InstanceOption, InstanceOptions, InstanceOptionsList } from '../src/container/options.js';
import { OrbitDbTypes } from '../src/container-orbitdb-open/dbTypes.js';
import fs from 'fs/promises';

describe('LunarPod', () => {
    let lunarPod: LunarPod;

    beforeEach(() => {
        const idReferenceFactory = new IdReferenceFactory();
        const podId: PodId = createId('pod') as PodId;
        const options: LunarPodOptions = new LunarPodOptions(
            new InstanceOptions({ options:
                new InstanceOptionsList([
                    {
                        name: 'directory',
                        value: './orbitdb/test3'
                    } as InstanceOption<string>,
                    {
                        name: 'databaseName',
                        value: 'test3-db'
                    } as InstanceOption<string>,
                    {
                        name: 'databaseType',
                        value: OrbitDbTypes.EVENTS
                    } as InstanceOption<OrbitDbTypes>,
                    {
                        name: 'start',
                        value: true
                    } as InstanceOption<boolean>
                ])
            })
        )

        lunarPod = new LunarPod({
            id: podId,
            options: options,
            idReferenceFactory: idReferenceFactory,
        });
    });

    afterEach(async () => {
        await lunarPod.stop();
        await fs.rm('./orbitdb/test3', {recursive: true, force: true});
    })


    it('should create a LunarPod', async () => {
        await lunarPod.init();

        expect(lunarPod.id).to.exist;
    });

});