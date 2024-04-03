
import { expect } from 'chai';
import { GossipSubProcess } from '../src/libp2p-process/pubsub.js';

import { LogLevel, MoonbaseId, PodBayId, PodId, PodProcessId, SystemId, logger } from 'd3-artifacts';
import { Libp2pProcess } from '../src/libp2p-process/index.js';
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string';


describe('PubSubProcess', () => {
    let pubSubProcess: GossipSubProcess
    let pubSubProcess2: GossipSubProcess
    let libp2p: Libp2pProcess;
    let libp2p2: Libp2pProcess;

    beforeEach(async () => {
        const systemId = new SystemId();
        const moonbaseId = new MoonbaseId({systemId})
        const podBayId = new PodBayId({moonbaseId});
        const podId = new PodId({podBayId});
        const processId = new PodProcessId({podId});
        libp2p = new Libp2pProcess({id: processId});
        await libp2p.init();

        const pubsubprocessId = new PodProcessId({podId});
        pubSubProcess = new GossipSubProcess({id: pubsubprocessId, topic: 'moonbase-pubsub', libp2pProcess: libp2p});
        await pubSubProcess.init();
        pubSubProcess.subscribe('moonbase-pubsub');

        const systemId2 = new SystemId();
        const moonbaseId2 = new MoonbaseId({systemId: systemId2})
        const podBayId2 = new PodBayId({moonbaseId: moonbaseId2});
        const podId2 = new PodId({podBayId: podBayId2});
        const processId2 = new PodProcessId({podId: podId2});
        libp2p2 = new Libp2pProcess({id: processId2});
        await libp2p2.init();

        const pubsubprocessId2 = new PodProcessId({podId: podId2});
        pubSubProcess2 = new GossipSubProcess({id: pubsubprocessId2, topic: 'moonbase-pubsub', libp2pProcess: libp2p2});
        await pubSubProcess2.init();

        pubSubProcess2.subscribe('moonbase-pubsub');
    });

    afterEach( async () => {
        await pubSubProcess.stop();
        await pubSubProcess2.stop();
        await libp2p.stop();
        await libp2p2.stop();
    })

    it('should check process', () => {
        const result = pubSubProcess.checkProcess();
        expect(result).to.be.true;
    });

    it('should return process status', () => {
        const status = pubSubProcess.status();
        expect(status).to.equal('started');
    });

    it('should initialize the process', async () => {
        await pubSubProcess.init();
        // Add your assertions here
    });

    it('should start the process', async () => {
        await pubSubProcess.start();
        // Add your assertions here
    });

    it('should stop the process', async () => {
        await pubSubProcess.stop();
        // Add your assertions here
    });

    it('should restart the process', async () => {
        await pubSubProcess.restart();
        // Add your assertions here
    });

    it('should publish a message to the network', async () => {
        
        await pubSubProcess.start()
        const result = await pubSubProcess.publish(uint8ArrayFromString('hello')); 
        logger({
            level: LogLevel.INFO,
            message: JSON.stringify(result)
        })

        console.log(pubSubProcess.process.getTopics())

        await pubSubProcess.publish(uint8ArrayFromString('hello world'));
        await pubSubProcess.publish(uint8ArrayFromString('hola mundo'));
        // Add your assertions here
    });
});
