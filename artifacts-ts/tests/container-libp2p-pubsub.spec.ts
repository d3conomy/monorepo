import { expect } from 'chai';
import { Libp2pContainer } from '../src/container-libp2p/index.js';
import { createId } from './helpers.js';
import { ContainerId, JobId } from '../src/id-reference-factory/index.js';
import { InstanceOptions } from '../src/container/options.js';
import { GossipSubContainer } from '../src/container-libp2p-pubsub/index.js';


describe('Libp2pGossipSubContainer', async () => {
    const containerId = createId("container") as ContainerId;
    const containerId2 = createId("container") as ContainerId;

    it('should create an instance of PubSubContainer using Libp2pContainer', async () => {
        const libp2pContainer = new Libp2pContainer(containerId);
        await libp2pContainer.init();

        const gossipSubOptions = new InstanceOptions({ options: [
            {
                name: "libp2p",
                value: libp2pContainer,
            }
        ]})

        const gossipSubContainer = new GossipSubContainer(containerId2, gossipSubOptions);
        await gossipSubContainer.init();

        expect(gossipSubContainer).to.be.an.instanceOf(GossipSubContainer);

        gossipSubContainer.jobs.enqueue({
            id: createId('job') as JobId,
            command: gossipSubContainer.commands.get('start')
        });

        gossipSubContainer.jobs.enqueue({
            id: createId('job') as JobId,
            command: gossipSubContainer.commands.get('subscribe'),
            params: [{
                name: 'topic',
                value: 'test'
            }]
        });

        gossipSubContainer.jobs.enqueue({
            id: createId('job') as JobId,
            command: gossipSubContainer.commands.get('publish'),
            params: [
                {
                    name: 'topic',
                    value: 'test'
                },
                {
                    name: 'message',
                    value: new TextEncoder().encode('hello world')
                }
            ]
        });

        gossipSubContainer.jobs.enqueue({
            id: createId('job') as JobId,
            command: gossipSubContainer.commands.get('stop')
        });

        await gossipSubContainer.jobs.run();

        await gossipSubContainer.getInstance().stop();
        await libp2pContainer.getInstance().stop();

        expect(gossipSubContainer.jobs.completed.length).to.equal(4);
    });
});