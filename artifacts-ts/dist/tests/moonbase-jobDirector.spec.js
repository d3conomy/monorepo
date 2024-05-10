import { expect } from 'chai';
import { PodBay } from '../src/pod-bay/index.js';
import { IdReferenceFactory } from '../src/id-reference-factory/index.js';
import { Moonbase } from '../src/moonbase/index.js';
import { InstanceOptions } from '../src/container/options.js';
import { StackTypes } from '../src/lunar-pod/stack.js';
import { MoonbaseOptions } from '../src/moonbase/options.js';
import { InstanceTypes } from '../src/container/instance.js';
describe('JobDirector', () => {
    let moonbase;
    let jobDirector;
    let pod;
    beforeEach(async () => {
        // Initialize the JobDirector instance with mock dependencies
        const idReferenceFactory = new IdReferenceFactory();
        const systemId = idReferenceFactory.createIdReference({ type: 'system' });
        const moonbaseId = idReferenceFactory.createIdReference({ type: 'moonbase', dependsOn: systemId });
        const podBayId = idReferenceFactory.createIdReference({ type: 'pod-bay', dependsOn: moonbaseId });
        const podBay = new PodBay({ id: podBayId, idReferenceFactory: idReferenceFactory });
        const moonbaseOptions = new MoonbaseOptions(new InstanceOptions({ options: [
                {
                    name: "createPodBay",
                    value: true
                }
            ] }));
        moonbase = new Moonbase({ id: moonbaseId, systemId: systemId, options: moonbaseOptions, idReferenceFactory: idReferenceFactory });
        pod = await moonbase.createPod({
            options: new InstanceOptions({ options: [
                    {
                        name: "stack",
                        value: StackTypes.Database
                    },
                    {
                        name: "databaseName",
                        value: "test8"
                    },
                    {
                        name: "directory",
                        value: "./pods/test/moonbase"
                    },
                    {
                        name: "start",
                        value: true
                    }
                ] })
        });
        // await pod.init();
        jobDirector = moonbase.jobDirector;
    });
    describe('enqueue', () => {
        it('should add a job to the queue', () => {
            const containers = pod.getContainers();
            console.log(containers);
            let databaseContainerId;
            for (const container of containers) {
                if (container?.type === InstanceTypes.database) {
                    databaseContainerId = container.id;
                    break;
                }
            }
            moonbase.createJob({
                command: 'address',
                containerId: databaseContainerId,
            });
            expect(jobDirector.queue.length).to.equal(1);
        });
    });
});
