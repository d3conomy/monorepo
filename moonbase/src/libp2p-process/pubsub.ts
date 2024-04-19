
import { PublishResult } from '@libp2p/interface'
import { IProcess, LogLevel, PodProcessId, ProcessStage, logger } from 'd3-artifacts';
import { Libp2pProcess } from './process.js';
import { GossipSub } from '@chainsafe/libp2p-gossipsub';

class GossipSubProcess implements IProcess {
    id: PodProcessId;
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

        if (this.topic) {
            this.subscribe(this.topic);
        }
    }

    async start(): Promise<void> {
        await this.process.start();
    }

    async stop(): Promise<void> {
        await this.process.stop();
    }

    async restart(): Promise<void> {
        await this.stop();
        await this.start();
    }

    subscribe(topic: string): void {
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

    getSubscriptions(): string[] {
        return this.process.getTopics();
    }

    async publish(message: Uint8Array): Promise<PublishResult> {
        return await this.process.publish(this.topic, message);
    }
}


export {
    GossipSubProcess
};


