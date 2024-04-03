
import { PubSubRPC, PublishResult, PubSubRPCMessage } from '@libp2p/interface'
import { Uint8ArrayList } from 'uint8arraylist'
import { LogLevel, PodProcessId, ProcessStage, logger } from 'd3-artifacts';
import { Libp2pProcess } from './process';
import { GossipSub } from '@chainsafe/libp2p-gossipsub';

class GossipSubProcess {
    id: PodProcessId;
    // pubsub: GossipSub;
    topic: string;
    process: GossipSub;

    constructor({
        id,
        topic,
        libp2pProcess
    }: {
        id: PodProcessId,
        topic?: string,
        libp2pProcess: Libp2pProcess
    }) {
        this.id = id;
        this.topic = topic ? topic : 'moonbase-pubsub';
        this.process = libp2pProcess.process?.services?.pubsub as GossipSub;

    }

    checkProcess(): boolean {
        return true;
    }

    status(): ProcessStage {
        return ProcessStage.STARTED;
    }

    async init(): Promise<void> {
        await this.process.start()
    }

    async start(): Promise<void> {
        await this.process.start();
    }

    async stop(): Promise<void> {
        await this.process.stop();
    }

    async restart(): Promise<void> {
        await this.process.stop();
        await this.process.start();
    }

    decodeRpc(bytes: Uint8ArrayList | Uint8Array): PubSubRPC {
        // take the bytes and decode them into a PubSubRPC object

        const decoder = new TextDecoder();
        const buffer = new ArrayBuffer(bytes.length);;
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

    encodeRpc(rpc: PubSubRPC): Uint8Array{
        // take the rpc object and encode it into a Uint8Array

        const encoder = new TextEncoder();
        const rpcString = JSON.stringify(rpc);
        return encoder.encode(rpcString);
    }

    encodeMessage(message: PubSubRPCMessage): Uint8Array {
        // take the message object and encode it into a Uint8Array

        const encoder = new TextEncoder();
        const messageString = JSON.stringify(message);
        return encoder.encode(messageString);
    }

    subscribe(topic: string): void {
        // this.process.addEventListener('gossipsub:heartbeat', (msg: any) => {
        //     console.log(msg)
        // })
        this.process.addEventListener('message', (msg: any) => {
            if (msg.detail.topic !== topic) {
                return;
            }
            logger({
                message: `[${msg.detail.topic}] ${new TextDecoder().decode(msg.detail.data)}`,
                level: LogLevel.INFO
            })
        });
        this.process.subscribe(topic);
    }

    async publishMessage(message: Uint8Array): Promise<PublishResult> {

        const result = await this.process.publish(this.topic, message);

        return result;
    }
}


export {
    GossipSubProcess
};


