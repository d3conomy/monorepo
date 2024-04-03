
// import { expect } from 'chai';
// import { PubSubProcess, PubSubProcessInit } from '../src/libp2p-process/pubsub.js';

// import { PubSubRPC, PublishResult, PubSubRPCMessage, PeerId, Message, ComponentLogger, PubSubInit, Logger, LoggerOptions } from '@libp2p/interface'
// import { Uint8ArrayList } from 'uint8arraylist'
// import { MoonbaseId, PodBayId, PodId, PodProcessId, SystemId } from 'd3-artifacts';
// import { Libp2pProcess } from '../src/libp2p-process/index.js';
// // import { defaultComponents } from 'libp2p/dist/src/components.js';


// describe('PubSubProcess', () => {
//     let pubSubProcess: PubSubProcess;
//     let libp2p: Libp2pProcess;

//     beforeEach(async () => {
//         const systemId = new SystemId();
//         const moonbaseId = new MoonbaseId({systemId})
//         const podBayId = new PodBayId({moonbaseId});
//         const podId = new PodId({podBayId});
//         const processId = new PodProcessId({podId});
//         libp2p = new Libp2pProcess({id: processId});
//         await libp2p.init();
//         // const components = new PubSubProcessComponents({peerId: libp2p.peerId()}, libp2p);
//         const components = defaultComponents();

//         const options = new PubSubProcessInit({
//             topic: 'moonbase-pubsub',
//             enabled: true,
//             multicodecs: ['/libp2p/pubsub/1.0.0'],
//             canRelayMessage: true,
//             emitSelf: true,
//             messageProcessingConcurrency: 16,
//             maxInboundStreams: 100,
//             maxOutboundStreams: 100
//         });
//         const pubsubprocessId = new PodProcessId({podId});
//         pubSubProcess = new PubSubProcess({id: pubsubprocessId, peerId: libp2p.peerId(), components, options, libp2pProcess: libp2p});
//         // await pubSubProcess.init();
//     });

//     afterEach( async () => {
//         // await pubSubProcess.stop();
//         await libp2p.stop();
//     })

//     it('should check process', () => {
//         const result = pubSubProcess.checkProcess();
//         expect(result).to.be.true;
//     });

//     it('should return process status', () => {
//         const status = pubSubProcess.status();
//         expect(status).to.equal('started');
//     });

//     it('should initialize the process', async () => {
//         await pubSubProcess.init();
//         // Add your assertions here
//     });

//     // it('should start the process', async () => {
//     //     await pubSubProcess.start();
//     //     // Add your assertions here
//     // });

//     // it('should stop the process', async () => {
//     //     await pubSubProcess.stop();
//     //     // Add your assertions here
//     // });

//     // it('should restart the process', async () => {
//     //     await pubSubProcess.restart();
//     //     // Add your assertions here
//     // });

//     // it('should decode RPC bytes into a PubSubRPC object', () => {
//     //     const bytes = new Uint8Array(32);
//     //     const rpc = pubSubProcess.decodeRpc(bytes);
//     //     // Add your assertions here
//     // });

//     // it('should encode a PubSubRPC object into Uint8Array', () => {
//     //     const rpc = {} as PubSubRPC;
//     //     const encodedRpc = pubSubProcess.encodeRpc(rpc);
//     //     // Add your assertions here
//     // });

//     // it('should encode a PubSubRPCMessage object into Uint8Array', () => {
//     //     const message = "hello" as PubSubRPCMessage;
//     //     const encodedMessage = pubSubProcess.encodeMessage(message);
//     //     // Add your assertions here
//     // });

//     it('should publish a message to the network', async () => {
//         const sender = libp2p.peerId();
//         const message: Message = {
//             // from: sender,
//             data: new Uint8Array(32),
//             topic: 'moonbase-pubsub',
//             type: 'unsigned',
//             // sequenceNumber: BigInt(1),
//             // signature: new Uint8Array(32),
//             // key: new Uint8Array(32),
//         }
//         await pubSubProcess.start()
//         const result = await pubSubProcess.publishMessage(sender, message);
//         // Add your assertions here
//     });
// });
