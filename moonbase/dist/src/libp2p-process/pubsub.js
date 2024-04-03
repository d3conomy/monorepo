import { LogLevel, ProcessStage, logger } from 'd3-artifacts';
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
            if (msg.detail.topic !== topic) {
                return;
            }
            logger({
                message: `[${msg.detail.topic}] ${new TextDecoder().decode(msg.detail.data)}`,
                level: LogLevel.INFO
            });
        });
        this.process.subscribe(topic);
    }
    async publishMessage(message) {
        const result = await this.process.publish(this.topic, message);
        return result;
    }
}
export { GossipSubProcess };
