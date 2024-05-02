import { expect } from 'chai';
import { createId } from './helpers.js';
import { Libp2pContainer } from '../src/container-libp2p/index.js';
describe('Libp2pJobs', async () => {
    it('should create Jobs using the Libp2pCommands inside a Libp2pContainer', async () => {
        const containerId = createId('container');
        const jobId = createId('job');
        const container = new Libp2pContainer(containerId);
        await container.init();
        const command = container.commands.get('start');
        const job = {
            id: jobId,
            command
        };
        container.jobs.enqueue(job);
        const jobFromQueue = container.jobs.dequeue();
        expect(jobFromQueue).to.equal(job);
        container.jobs.enqueue(job);
        await container.jobs.run();
        expect(container.jobs.completed.length).to.equal(1);
        console.log(container.jobs.completed[0].result);
        await container.getInstance().stop();
    });
    it('should run the peerId command of a container', async () => {
        const containerId = createId('container');
        const jobId = createId('job');
        const container = new Libp2pContainer(containerId);
        await container.init();
        container.jobs.enqueue({
            id: jobId,
            command: container.commands.get('start')
        });
        container.jobs.enqueue({
            id: jobId,
            command: container.commands.get('peerId')
        });
        container.jobs.enqueue({
            id: jobId,
            command: container.commands.get('multiaddrs')
        });
        container.jobs.enqueue({
            id: jobId,
            command: container.commands.get('peers')
        });
        container.jobs.enqueue({
            id: jobId,
            command: container.commands.get('status')
        });
        container.jobs.enqueue({
            id: jobId,
            command: container.commands.get('stop')
        });
        await container.jobs.run();
        expect(container.jobs.completed.length).to.equal(6);
        console.log(container.jobs.completed[0].result);
        await container.getInstance().stop();
    });
});
