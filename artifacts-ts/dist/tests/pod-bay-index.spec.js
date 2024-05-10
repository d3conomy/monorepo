import { expect } from 'chai';
import { PodBay } from '../src/pod-bay/index.js';
import { IdReferenceFactory } from '../src/id-reference-factory/index.js';
import { LunarPodOptions } from '../src/lunar-pod/options.js';
import { InstanceOptions } from '../src/container/options.js';
import { OrbitDbTypes } from '../src/container-orbitdb-open/dbTypes.js';
import fs from 'fs/promises';
describe('PodBay', () => {
    let podBay;
    let idReferenceFactory = new IdReferenceFactory();
    beforeEach(() => {
        const systemId = idReferenceFactory.createIdReference({ type: 'system' });
        const moonbaseId = idReferenceFactory.createIdReference({ type: 'moonbase', dependsOn: systemId });
        const podBayId = idReferenceFactory.createIdReference({ type: 'pod-bay', dependsOn: moonbaseId });
        podBay = new PodBay({
            id: podBayId,
            idReferenceFactory: idReferenceFactory
        });
    });
    afterEach(async () => {
        podBay.pods?.forEach(async (pod) => {
            await pod.stop();
        });
        await fs.rm('./orbitdb', { recursive: true, force: true });
    });
    it('should create a PodBay', async () => {
        expect(podBay.id).to.exist;
    });
    it('should add a pod', async () => {
        const podId = idReferenceFactory.createIdReference({ type: 'pod', dependsOn: podBay.id });
        const pod = await podBay.createPod({
            id: podId,
            options: new LunarPodOptions(new InstanceOptions({ options: [
                    {
                        name: 'directory',
                        value: './orbitdb/test4'
                    },
                    {
                        name: 'databaseName',
                        value: 'test4-db'
                    },
                    {
                        name: 'databaseType',
                        value: OrbitDbTypes.EVENTS
                    },
                    {
                        name: 'start',
                        value: true
                    }
                ] })),
            initialize: true
        });
        expect(pod).to.exist;
    });
    it('should run a job on a pod', async () => {
        const podId = idReferenceFactory.createIdReference({ type: 'pod', dependsOn: podBay.id });
        const pod = await podBay.createPod({
            id: podId,
            options: new LunarPodOptions(new InstanceOptions({ options: [
                    {
                        name: 'directory',
                        value: './orbitdb/test5'
                    },
                    {
                        name: 'databaseName',
                        value: 'test5-db'
                    },
                    {
                        name: 'databaseType',
                        value: OrbitDbTypes.EVENTS
                    },
                    {
                        name: 'start',
                        value: true
                    }
                ] })),
            initialize: true
        });
        const databasePodId = pod.getContainers().find((container) => container?.type === 'database')?.id;
        // console.log(`databasePodId: ${databasePodId}`);
        pod.createJob({
            command: 'add',
            containerId: databasePodId,
            params: [
                {
                    name: 'data',
                    value: 'test-key'
                }
            ]
        });
        for (let i = 0; i < 100; i++) {
            pod.createJob({
                command: 'add',
                containerId: databasePodId,
                params: [
                    {
                        name: 'data',
                        value: `test-key-${i}`
                    }
                ]
            });
        }
        // console.log(`Job: ${job.containerId}`);
        const jobs = await pod.runJobs();
        // for (const job of jobs) {
        //     console.log(`Job: ${job.result?.output}`);
        // }
        expect(pod.getContainers().find((container) => container?.type === 'database')?.jobs.isEmpty()).to.be.true;
    });
    it('should not add more than 10 pods', async () => {
        const podId = () => idReferenceFactory.createIdReference({ type: 'pod', dependsOn: podBay.id });
        for (let i = 0; i < 10; i++) {
            await podBay.createPod({
                id: podId(),
                options: new LunarPodOptions(new InstanceOptions({ options: [
                        {
                            name: 'directory',
                            value: `./orbitdb/test4-${i}`
                        },
                        {
                            name: 'databaseName',
                            value: `test4-db-${i}`
                        },
                        {
                            name: 'databaseType',
                            value: OrbitDbTypes.EVENTS
                        },
                        {
                            name: 'start',
                            value: true
                        }
                    ] })),
                initialize: true
            });
        }
    });
});
