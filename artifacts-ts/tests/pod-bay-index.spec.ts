import { expect } from 'chai';
import { PodBay } from '../src/pod-bay/index.js';
import { createId } from './helpers.js';
import { ContainerId, IdReferenceFactory, MoonbaseId, PodBayId, PodId, SystemId } from '../src/id-reference-factory/index.js';
import { LunarPodOptions } from '../src/lunar-pod/options.js';
import { InstanceOption, InstanceOptions, InstanceOptionsList } from '../src/container/options.js';
import { OrbitDbTypes } from '../src/container-orbitdb-open/dbTypes.js';
import fs from 'fs/promises';
import { Command, CommandArg } from './container/commands.js';


describe('PodBay', () => {
    let podBay: PodBay;
    let idReferenceFactory = new IdReferenceFactory();

    beforeEach(() => {
        const systemId: SystemId = idReferenceFactory.createIdReference({type: 'system'})
        const moonbaseId: MoonbaseId = idReferenceFactory.createIdReference({type: 'moonbase', dependsOn: systemId});
        const podBayId: PodBayId = idReferenceFactory.createIdReference({type: 'pod-bay', dependsOn: moonbaseId});

        podBay = new PodBay({
            id: podBayId,
            idReferenceFactory: idReferenceFactory
        });
    });

    afterEach(async () => {
        podBay.pods?.forEach(async pod => {
            await pod.stop();
        });
        await fs.rm('./orbitdb', {recursive: true, force: true});
    });

    it('should create a PodBay', async () => {
        expect(podBay.id).to.exist;
    });

    it('should add a pod', async () => {
        const podId: PodId = idReferenceFactory.createIdReference({type: 'pod', dependsOn: podBay.id});
        const pod = await podBay.createPod({
            id: podId,
            options: new LunarPodOptions(new InstanceOptions({ options: [
                {
                    name: 'directory',
                    value: './orbitdb/test4'
                } as InstanceOption<string>,
                {
                    name: 'databaseName',
                    value: 'test4-db'
                } as InstanceOption<string>,
                {
                    name: 'databaseType',
                    value: OrbitDbTypes.EVENTS
                } as InstanceOption<OrbitDbTypes>,
                {
                    name: 'start',
                    value: true
                } as InstanceOption<boolean>
            ]})),
            initialize: true
        });

        expect(pod).to.exist;
    });

    it('should run a job on a pod', async () => {
        const podId: PodId = idReferenceFactory.createIdReference({type: 'pod', dependsOn: podBay.id});
        const pod = await podBay.createPod({
            id: podId,
            options: new LunarPodOptions(new InstanceOptions({ options: [
                {
                    name: 'directory',
                    value: './orbitdb/test5'
                } as InstanceOption<string>,
                {
                    name: 'databaseName',
                    value: 'test5-db'
                } as InstanceOption<string>,
                {
                    name: 'databaseType',
                    value: OrbitDbTypes.EVENTS
                } as InstanceOption<OrbitDbTypes>,
                {
                    name: 'start',
                    value: true
                } as InstanceOption<boolean>
            ]})),
            initialize: true
        });

        const databasePodId = pod.getContainers().find((container) => container?.type === 'database' )?.id as ContainerId;

        console.log(`databasePodId: ${databasePodId}`);

        const job = pod.createJob({
            command: 'add',
            containerId: databasePodId,
            params: [
                {
                    name: 'data',
                    value: 'test-key'
                }
            ]
        });

        console.log(`Job: ${job.containerId}`);

        const jobs = await pod.runJobs();
        for (const job of jobs) {
            console.log(`Job: ${job.result?.output}`);
        }

        expect(pod.getContainers().find((container) => container?.type === 'database' )?.jobs.isEmpty()).to.be.true;

    });

    it('should not add more than 10 pods', async () => {
        const podId = () => idReferenceFactory.createIdReference({type: 'pod', dependsOn: podBay.id});
        for (let i = 0; i < 10; i++) {
            await podBay.createPod({
                id: podId(),
                options: new LunarPodOptions(new InstanceOptions({ options: [
                    {
                        name: 'directory',
                        value: `./orbitdb/test4-${i}`
                    } as InstanceOption<string>,
                    {
                        name: 'databaseName',
                        value: `test4-db-${i}`
                    } as InstanceOption<string>,
                    {
                        name: 'databaseType',
                        value: OrbitDbTypes.EVENTS
                    } as InstanceOption<OrbitDbTypes>,
                    {
                        name: 'start',
                        value: true
                    } as InstanceOption<boolean>
                ]})),
                initialize: true
            });
        }
    });


});
