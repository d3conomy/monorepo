import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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
    // Increase timeout for slow async operations
    before(function () {
        this.timeout(10000); // 10 seconds
    });
    beforeEach(async () => {
        // Clean up the test database directory to avoid lock errors
        const testDir = path.resolve(__dirname, '../pods/test/moonbase');
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
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
        await pod.init();
        jobDirector = moonbase.jobDirector;
    });
    afterEach(async function () {
        this.timeout(15000); // Extended timeout for cleanup
        // Stop the pod
        if (pod && typeof pod.stop === 'function') {
            try {
                await pod.stop();
            }
            catch (e) {
                console.warn('Error stopping pod:', e);
            }
        }
        // Add delay to ensure resources are released
        await new Promise(resolve => setTimeout(resolve, 2000));
        // Clean up the test database directory
        const testDir = path.resolve(__dirname, '../pods/test/moonbase');
        if (fs.existsSync(testDir)) {
            try {
                fs.rmSync(testDir, { recursive: true, force: true });
            }
            catch (e) {
                console.warn('Error cleaning test directory:', e);
                // If normal cleanup fails, try with a delay and retry
                await new Promise(resolve => setTimeout(resolve, 1000));
                try {
                    fs.rmSync(testDir, { recursive: true, force: true });
                }
                catch (e2) {
                    console.warn('Retry cleanup also failed:', e2);
                }
            }
        }
    });
    describe('enqueue', () => {
        it('should add a job to the queue', async () => {
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
