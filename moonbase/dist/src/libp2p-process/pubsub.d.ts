import { PubSubRPC, PublishResult, PubSubRPCMessage } from '@libp2p/interface';
import { Uint8ArrayList } from 'uint8arraylist';
import { PodProcessId, ProcessStage } from 'd3-artifacts';
import { Libp2pProcess } from './process';
import { GossipSub } from '@chainsafe/libp2p-gossipsub';
declare class GossipSubProcess {
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
    decodeRpc(bytes: Uint8ArrayList | Uint8Array): PubSubRPC;
    encodeRpc(rpc: PubSubRPC): Uint8Array;
    encodeMessage(message: PubSubRPCMessage): Uint8Array;
    subscribe(topic: string): void;
    publishMessage(message: Uint8Array): Promise<PublishResult>;
}
export { GossipSubProcess };
//# sourceMappingURL=pubsub.d.ts.map