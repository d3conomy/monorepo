import { ProcessStage } from 'd3-artifacts';
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
class GossipSubProcess {
    id;
    // pubsub: GossipSub;
    topic;
    process;
    constructor({ id, topic, libp2pProcess }) {
        this.id = id;
        this.topic = topic ? topic : 'moonbase-pubsub';
        this.process = libp2pProcess.process?.services?.pubsub;
    }
    checkProcess() {
        return true;
    }
    status() {
        return ProcessStage.STARTED;
    }
    async init() {
        await this.process.start();
    }
    async start() {
        await this.process.start();
    }
    async stop() {
        await this.process.stop();
    }
    async restart() {
        await this.process.stop();
        await this.process.start();
    }
    decodeRpc(bytes) {
        // take the bytes and decode them into a PubSubRPC object
        const decoder = new TextDecoder();
        const buffer = new ArrayBuffer(bytes.length);
        ;
        const view = new Uint8Array(buffer);
        if (bytes instanceof Uint8Array) {
            view.set(bytes);
        }
        // if (bytes instanceof Uint8ArrayList) {
        //     const bytesArray = new Array(bytes);
        //     view.set(bytesArra);
        // }
        const rpcString = decoder.decode(view);
        return JSON.parse(rpcString);
    }
    encodeRpc(rpc) {
        // take the rpc object and encode it into a Uint8Array
        const encoder = new TextEncoder();
        const rpcString = JSON.stringify(rpc);
        return encoder.encode(rpcString);
    }
    encodeMessage(message) {
        // take the message object and encode it into a Uint8Array
        const encoder = new TextEncoder();
        const messageString = JSON.stringify(message);
        return encoder.encode(messageString);
    }
    subscribe(topic) {
        // this.process.addEventListener('gossipsub:heartbeat', (msg: any) => {
        //     console.log(msg)
        // })
        this.process.addEventListener('message', (msg) => {
            console.log(`${this.id.podId} ${new Date()} : ${msg}`);
        });
        this.process.subscribe(topic);
    }
    async publishMessage(sender, message) {
        // publish a message to the network
        // const rpcMessage: PubSubRPCMessage = {
        //     from: sender.toCID().bytes,
        //     topic: message.topic,
        //     data: message.data,
        // };
        // const encodedRpc = this.encodeMessage(rpcMessage);
        // const rpc: PubSubRPC = {
        //     subscriptions: [this.process.getTopicPeers(message.topic)],
        //     messages: [rpcMessage]
        // };
        // const encodedRpc = this.encodeRpc(rpc);
        const result = await this.process.publish(this.topic, message);
        return result;
    }
}
export { 
// PubSubProcess,
// PubSubProcessInit,
// PubSubProcessComponents
GossipSubProcess };
