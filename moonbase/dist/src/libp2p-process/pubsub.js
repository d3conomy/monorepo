"use strict";
// import { PubSubBaseProtocol, PubSubComponents } from '@libp2p/pubsub'
// import { PubSubRPC, PublishResult, PubSubRPCMessage, PeerId, Message, PubSubInit, Logger, LoggerOptions } from '@libp2p/interface'
// import { Uint8ArrayList } from 'uint8arraylist'
// import { SignaturePolicy } from '@chainsafe/libp2p-gossipsub/dist/src/types'
// import { IProcess, PodProcessId, ProcessStage, ProcessType } from 'd3-artifacts';
// import { create } from 'domain';
// import { Registrar } from '@libp2p/interface-internal';
// import { createPeerId } from '@libp2p/peer-id';
// import { ComponentLogger, defaultLogger } from '@libp2p/logger'
// import { DefaultRegistrar } from 'libp2p/src/registrar.js'
// import { Libp2pProcess } from './process';
// class PubSubProcessInit implements PubSubInit {
//     topic: string;
//     enabled: boolean;
//     multicodecs: string[];
//     canRelayMessage: boolean;
//     emitSelf: boolean;
//     messageProcessingConcurrency: number;
//     maxInboundStreams: number;
//     maxOutboundStreams: number;
//     constructor({
//         topic = 'moonbase-pubsub',
//         enabled = true,
//         multicodecs = ['/libp2p/pubsub/1.0.0'],
//         canRelayMessage = true,
//         emitSelf = true,
//         messageProcessingConcurrency = 16,
//         maxInboundStreams = 100,
//         maxOutboundStreams = 100
//     }: Partial<PubSubProcessInit> = {}) {
//         this.topic = topic;
//         this.enabled = enabled;
//         this.multicodecs = multicodecs;
//         this.canRelayMessage = canRelayMessage;
//         this.emitSelf = emitSelf;
//         this.messageProcessingConcurrency = messageProcessingConcurrency;
//         this.maxInboundStreams = maxInboundStreams;
//         this.maxOutboundStreams = maxOutboundStreams;
//     }
// }
// class PubSubProcessComponents implements PubSubComponents {
//     logger: ComponentLogger;
//     peerId: PeerId;
//     registrar: Registrar;
//     constructor({
//         logger = defaultLogger() as ComponentLogger,
//         peerId,
//         registrar
//     }: Partial<PubSubComponents>, libp2p: Libp2pProcess) {
//         this.logger = logger;
//         this.peerId = peerId as PeerId;
//         this.registrar = registrar
//     }
// }
// class PubSubProcess extends PubSubBaseProtocol implements IProcess  {
//     id: PodProcessId;
//     topic: string;
//     process: any;
//     constructor({
//         id,
//         peerId,
//         components,
//         options,
//         libp2pProcess
//     }: {
//         id: PodProcessId,
//         peerId: PeerId,
//         components?: PubSubComponents,
//         options?: PubSubProcessInit,
//         libp2pProcess: Libp2pProcess
//     }) {
//         super(
//             components || new PubSubProcessComponents({peerId}, libp2pProcess),
//             options || new PubSubProcessInit()
//         );
//         this.id = id;
//         this.topic = options ? options?.topic : 'moonbase-pubsub';
//     }
//     checkProcess(): boolean {
//         return true;
//     }
//     status(): ProcessStage {
//         return ProcessStage.STARTED;
//     }
//     async init(): Promise<void> {
//         await this.start()
//     }
//     async restart(): Promise<void> {
//         await this.stop();
//         await this.start();
//     }
//     decodeRpc(bytes: Uint8ArrayList | Uint8Array): PubSubRPC {
//         // take the bytes and decode them into a PubSubRPC object
//         const decoder = new TextDecoder();
//         const buffer = new ArrayBuffer(bytes.length);;
//         const view = new Uint8Array(buffer);
//         if (bytes instanceof Uint8Array) {
//             view.set(bytes);
//         }
//         // if (bytes instanceof Uint8ArrayList) {
//         //     const bytesArray = new Array(bytes);
//         //     view.set(bytesArra);
//         // }
//         const rpcString = decoder.decode(view);
//         return JSON.parse(rpcString);
//     }
//     encodeRpc(rpc: PubSubRPC): Uint8Array{
//         // take the rpc object and encode it into a Uint8Array
//         const encoder = new TextEncoder();
//         const rpcString = JSON.stringify(rpc);
//         return encoder.encode(rpcString);
//     }
//     encodeMessage(message: PubSubRPCMessage): Uint8Array {
//         // take the message object and encode it into a Uint8Array
//         const encoder = new TextEncoder();
//         const messageString = JSON.stringify(message);
//         return encoder.encode(messageString);
//     }
//     async publishMessage(sender: PeerId, message: Message): Promise<PublishResult> {
//         // publish a message to the network
//         const rpcMessage: PubSubRPCMessage = {
//             from: sender.toBytes(),
//             topic: message.topic,
//             data: message.data,
//         };
//         const rpc: PubSubRPC = {
//             subscriptions: [],
//             messages: [rpcMessage]
//         };
//         const encodedRpc = this.encodeRpc(rpc);
//         const result = await this.publish(this.topic, encodedRpc);
//         return result;
//     }
// }
// export {
//     PubSubProcess,
//     PubSubProcessInit,
//     PubSubProcessComponents
// };