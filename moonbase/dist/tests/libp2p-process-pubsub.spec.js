import { expect } from 'chai';
import { GossipSubProcess } from '../src/libp2p-process/pubsub.js';
import { LogLevel, MoonbaseId, PodBayId, PodId, PodProcessId, SystemId, logger } from 'd3-artifacts';
import { Libp2pProcess } from '../src/libp2p-process/index.js';
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string';
// import { defaultComponents } from 'libp2p/dist/src/components.js';
describe('PubSubProcess', () => {
    let pubSubProcess;
    let pubSubProcess2;
    let libp2p;
    let libp2p2;
    beforeEach(async () => {
        const systemId = new SystemId();
        const moonbaseId = new MoonbaseId({ systemId });
        const podBayId = new PodBayId({ moonbaseId });
        const podId = new PodId({ podBayId });
        const processId = new PodProcessId({ podId });
        libp2p = new Libp2pProcess({ id: processId });
        await libp2p.init();
        // const components = new PubSubProcessComponents({peerId: libp2p.peerId()}, libp2p);
        // const components = defaultComponents();
        // const options = new PubSubProcessInit({
        //     topic: 'moonbase-pubsub',
        //     enabled: true,
        //     multicodecs: ['/libp2p/pubsub/1.0.0'],
        //     canRelayMessage: true,
        //     emitSelf: true,
        //     messageProcessingConcurrency: 16,
        //     maxInboundStreams: 100,
        //     maxOutboundStreams: 100
        // });
        const pubsubprocessId = new PodProcessId({ podId });
        pubSubProcess = new GossipSubProcess({ id: pubsubprocessId, topic: 'moonbase-pubsub', libp2pProcess: libp2p });
        // pubSubProcess = new PubSubProcess({id: pubsubprocessId, peerId: libp2p.peerId(), options, libp2pProcess: libp2p});
        await pubSubProcess.init();
        // pubSubProcess.process.addEventListener('message', (msg: any) => {
        //     console.log(`${msg.detail.topic} : ${new TextDecoder().decode(msg.detail.data)}`)
        // });
        // pubSubProcess.subscribe('moonbase-pubsub');
        pubSubProcess.subscribe('moonbase-pubsub');
        // pubSubProcess.process.addEventListener('subscription-change', (msg: Message) => {
        //     console.log(msg.data)
        // });
        const systemId2 = new SystemId();
        const moonbaseId2 = new MoonbaseId({ systemId: systemId2 });
        const podBayId2 = new PodBayId({ moonbaseId: moonbaseId2 });
        const podId2 = new PodId({ podBayId: podBayId2 });
        const processId2 = new PodProcessId({ podId: podId2 });
        libp2p2 = new Libp2pProcess({ id: processId2 });
        await libp2p2.init();
        const peerId = libp2p.peerId();
        const multiaddrs = libp2p2.getMultiaddrs();
        console.log(multiaddrs);
        // await libp2p.dialProtocol(multiaddrs[0].toString(), '/libp2p/meshsub/1.0.0');
        const pubsubprocessId2 = new PodProcessId({ podId: podId2 });
        pubSubProcess2 = new GossipSubProcess({ id: pubsubprocessId2, topic: 'moonbase-pubsub', libp2pProcess: libp2p2 });
        // pubSubProcess2.init()
        await pubSubProcess2.init();
        pubSubProcess2.subscribe('moonbase-pubsub');
        // console.log(pubSubProcess.process.getSubscribers('moonbase-pubsub'))
    });
    afterEach(async () => {
        await pubSubProcess.stop();
        await pubSubProcess2.stop();
        await libp2p.stop();
        await libp2p2.stop();
    });
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
    // it('should decode RPC bytes into a PubSubRPC object', () => {
    //     const bytes = new Uint8Array(32);
    //     const rpc = pubSubProcess.decodeRpc(bytes);
    //     // Add your assertions here
    // });
    // it('should encode a PubSubRPC object into Uint8Array', () => {
    //     const rpc = {} as PubSubRPC;
    //     const encodedRpc = pubSubProcess.encodeRpc(rpc);
    //     // Add your assertions here
    // });
    // it('should encode a PubSubRPCMessage object into Uint8Array', () => {
    //     const message = "hello" as PubSubRPCMessage;
    //     const encodedMessage = pubSubProcess.encodeMessage(message);
    //     // Add your assertions here
    // });
    it('should publish a message to the network', async () => {
        const sender = libp2p.peerId();
        const message = {
            // from: sender,
            data: new Uint8Array(32),
            topic: 'moonbase-pubsub',
            type: 'unsigned',
            // sequenceNumber: BigInt(1),
            // signature: new Uint8Array(32),
            // key: new Uint8Array(32),
        };
        await pubSubProcess.start();
        const result = await pubSubProcess.publishMessage(uint8ArrayFromString('hello'));
        logger({
            level: LogLevel.INFO,
            message: JSON.stringify(result)
        });
        console.log(pubSubProcess.process.getTopics());
        await pubSubProcess.process.publish('moonbase-pubsub', uint8ArrayFromString('hello world'));
        await pubSubProcess.process.publish('moonbase-pubsub', uint8ArrayFromString('hola mundo'));
        // Add your assertions here
    });
});
