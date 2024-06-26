import { PeerId, Connection, Stream } from '@libp2p/interface';
import { Libp2p } from 'libp2p';
import { Multiaddr } from '@multiformats/multiaddr';
import { IProcess, PodProcessId, ProcessStage } from 'd3-artifacts';
import { Libp2pProcessOptions } from './processOptions.js';
import { GossipSubProcess } from './pubsub.js';
/**
 * Create a libp2p process
 * @category Libp2p
 */
declare const createLibp2pProcess: (options?: Libp2pProcessOptions) => Promise<Libp2p>;
/**
 * A class for managing a libp2p process
 * @category Libp2p
 */
declare class Libp2pProcess implements IProcess {
    id: PodProcessId;
    process?: Libp2p;
    options?: Libp2pProcessOptions;
    gossipSub?: GossipSubProcess;
    private processStatus;
    /**
     * Create a new libp2p process
     */
    constructor({ id, process, options }: {
        id: PodProcessId;
        process?: Libp2p;
        options?: Libp2pProcessOptions;
    });
    /**
     * Check if a process exists
     */
    checkProcess(): boolean;
    /**
     * Initialize the libp2p process
     */
    init(): Promise<void>;
    initPubSub(id: PodProcessId): Promise<void>;
    status(): ProcessStage;
    /**
     * Start the libp2p process
     */
    start(): Promise<void>;
    /**
     * Stop the libp2p process
     */
    stop(): Promise<void>;
    /**
     * Restart the libp2p process
     */
    restart(): Promise<void>;
    /**
     * Get the PeerId for the libp2p process
     */
    peerId(): PeerId;
    /**
     * Get the multiaddresses for the libp2p process
     */
    getMultiaddrs(): Multiaddr[];
    /**
     * Get the peers for the libp2p process
     */
    peers(): PeerId[];
    /**
     * Get the connections for the libp2p process
     */
    connections(peerId?: string, max?: number): Connection[];
    /**
     * Get the protocols for the libp2p process
     */
    getProtocols(): string[];
    /**
     * Get a peers public Key
     */
    getPublicKey(peerId: PeerId): Promise<Uint8Array | undefined>;
    /**
     * Get the listenerCount for the libp2p process
     */
    listenerCount(type: string): number;
    /**
     * dial a libp2p address
     */
    dial(address: string): Promise<Connection | undefined>;
    /**
     * Dial a libp2p address and protocol
     */
    dialProtocol(address: string, protocol: string): Promise<Stream | undefined>;
    /**
     * Hang Up a connection
     */
    hangUpConnection(peerId: PeerId): Promise<void>;
}
export { createLibp2pProcess, Libp2pProcess };
//# sourceMappingURL=process.d.ts.map