import { PublishResult } from '@libp2p/interface';
import { IProcess, PodProcessId, ProcessStage } from 'd3-artifacts';
import { Libp2pProcess } from './process';
import { GossipSub } from '@chainsafe/libp2p-gossipsub';
declare class GossipSubProcess implements IProcess {
    id: PodProcessId;
    topic: string;
    process: GossipSub;
    constructor({ id, topic, libp2pProcess }: {
        id: PodProcessId;
        topic?: string;
        libp2pProcess: Libp2pProcess;
    });
    checkProcess(): boolean;
    status(): ProcessStage;
    init(): Promise<void>;
    start(): Promise<void>;
    stop(): Promise<void>;
    restart(): Promise<void>;
    subscribe(topic: string): void;
    getSubscriptions(): string[];
    publish(message: Uint8Array): Promise<PublishResult>;
}
export { GossipSubProcess };
//# sourceMappingURL=pubsub.d.ts.map