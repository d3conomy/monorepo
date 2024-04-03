import { createLibp2p } from 'libp2p';
import { multiaddr } from '@multiformats/multiaddr';
import { peerIdFromString } from '@libp2p/peer-id';
import { LogLevel, ProcessStage, isProcessStage, logger } from 'd3-artifacts';
import { Libp2pProcessOptions } from './processOptions.js';
/**
 * Create a libp2p process
 * @category Libp2p
 */
const createLibp2pProcess = async (options) => {
    if (!options) {
        options = new Libp2pProcessOptions();
    }
    try {
        await options.init();
        return await createLibp2p(options.processOptions);
    }
    catch (error) {
        logger({
            level: LogLevel.ERROR,
            stage: ProcessStage.ERROR,
            message: `Error creating Libp2p process: ${error.message}`,
            error: error
        });
        throw error;
    }
};
/**
 * A class for managing a libp2p process
 * @category Libp2p
 */
class Libp2pProcess {
    processStatus = ProcessStage.NEW;
    /**
     * Create a new libp2p process
     */
    constructor({ id, process, options }) {
        this.id = id;
        this.process = process;
        this.options = options;
    }
    /**
     * Check if a process exists
     */
    checkProcess() {
        if (!this.process) {
            logger({
                level: LogLevel.ERROR,
                stage: ProcessStage.ERROR,
                processId: this.id,
                message: `No process found for ${this.id.podId.name}`
            });
            return false;
        }
        return true;
    }
    /**
     * Initialize the libp2p process
     */
    async init() {
        if (!this.checkProcess()) {
            try {
                this.processStatus = ProcessStage.INITIALIZING;
                this.process = await createLibp2pProcess(this.options);
            }
            catch {
                const message = `Error initializing process for ${this.id.name}`;
                logger({
                    level: LogLevel.ERROR,
                    stage: ProcessStage.ERROR,
                    processId: this.id,
                    message: message
                });
                this.processStatus = ProcessStage.ERROR;
                throw new Error(message);
            }
            logger({
                level: LogLevel.INFO,
                stage: ProcessStage.INITIALIZED,
                processId: this.id,
                message: `Process ${this.id.name} initialized for ${this.id.podId.name}`
            });
            this.processStatus = ProcessStage.INITIALIZED;
        }
    }
    status() {
        const updatedStatus = this.process?.status;
        this.processStatus = updatedStatus ? isProcessStage(updatedStatus) : this.processStatus;
        return this.processStatus;
    }
    /**
     * Start the libp2p process
     */
    async start() {
        if (this.checkProcess() &&
            this.status() !== ProcessStage.STARTED &&
            this.status() !== ProcessStage.STARTING) {
            this.processStatus = ProcessStage.STARTING;
            try {
                await this.process?.start();
            }
            catch {
                const message = `Error starting process for ${this.id.name}`;
                logger({
                    level: LogLevel.ERROR,
                    stage: ProcessStage.ERROR,
                    processId: this.id,
                    message: message
                });
                this.processStatus = ProcessStage.ERROR;
                throw new Error(message);
            }
            this.processStatus = ProcessStage.STARTED;
        }
        if (this.status() === ProcessStage.STARTED) {
            logger({
                level: LogLevel.INFO,
                stage: ProcessStage.STARTED,
                processId: this.id,
                message: `Process already started for ${this.id.podId.name}`
            });
            return;
        }
        logger({
            level: LogLevel.INFO,
            stage: ProcessStage.STARTED,
            processId: this.id,
            message: `Process started for ${this.id.podId.name}`
        });
        this.processStatus = ProcessStage.STARTED;
    }
    /**
     * Stop the libp2p process
     */
    async stop() {
        if (this.checkProcess() &&
            this.status() !== ProcessStage.STOPPED &&
            this.status() !== ProcessStage.STOPPING) {
            try {
                await this.process?.stop();
            }
            catch {
                const message = `Error stopping process for ${this.id.name}`;
                logger({
                    level: LogLevel.ERROR,
                    stage: ProcessStage.ERROR,
                    processId: this.id,
                    message: message
                });
                throw new Error(message);
            }
        }
        logger({
            level: LogLevel.INFO,
            stage: ProcessStage.STOPPING,
            processId: this.id,
            message: `Process stopped for ${this.id.podId.name}`
        });
    }
    /**
     * Restart the libp2p process
     */
    async restart() {
        if (this.checkProcess()) {
            try {
                await this.stop();
                await this.start();
            }
            catch {
                const message = `Error restarting process for ${this.id.name}`;
                logger({
                    level: LogLevel.ERROR,
                    stage: ProcessStage.ERROR,
                    processId: this.id,
                    message: message
                });
                throw new Error(message);
            }
        }
        logger({
            level: LogLevel.INFO,
            stage: ProcessStage.RESTARTING,
            processId: this.id,
            message: `Process restarted for ${this.id.podId.name}`
        });
    }
    /**
     * Get the PeerId for the libp2p process
     */
    peerId() {
        let peerId;
        try {
            if (!this.process) {
                throw new Error(`No process found for ${this.id.podId.name}`);
            }
            peerId = this.process.peerId;
        }
        catch (error) {
            logger({
                level: LogLevel.ERROR,
                stage: ProcessStage.ERROR,
                processId: this.id,
                message: `Error getting PeerId for ${this.id.name}: ${error.message}`,
                error: error
            });
            throw error;
        }
        return peerId;
    }
    /**
     * Get the multiaddresses for the libp2p process
     */
    getMultiaddrs() {
        let multiaddrs;
        try {
            if (!this.process) {
                throw new Error(`No process found for ${this.id.podId.name}`);
            }
            multiaddrs = this.process.getMultiaddrs();
        }
        catch (error) {
            logger({
                level: LogLevel.ERROR,
                stage: ProcessStage.ERROR,
                processId: this.id,
                message: `Error getting multiaddrs for ${this.id.name}: ${error.message}`,
                error: error
            });
            throw error;
        }
        return multiaddrs;
    }
    /**
     * Get the peers for the libp2p process
     */
    peers() {
        let peers;
        try {
            if (!this.process) {
                throw new Error(`No process found for ${this.id.podId.name}`);
            }
            peers = this.process.getPeers();
        }
        catch (error) {
            logger({
                level: LogLevel.ERROR,
                stage: ProcessStage.ERROR,
                processId: this.id,
                message: `Error getting peers for ${this.id.name}: ${error.message}`,
                error: error
            });
            throw error;
        }
        return peers;
    }
    /**
     * Get the connections for the libp2p process
     */
    connections(peerId, max = 10) {
        if (this.process && peerId) {
            const peerIdObject = peerIdFromString(peerId);
            return this.process.getConnections(peerIdObject);
        }
        const peers = this.process?.getPeers();
        const peerConnections = [];
        let counter = 0;
        peers?.forEach((peer) => {
            if (counter >= max) {
                return peerConnections;
            }
            const connections = this.process?.getConnections(peer);
            if (connections) {
                peerConnections.push(...connections);
                counter += 1;
                logger({
                    level: LogLevel.INFO,
                    message: `Peer: ${peer.toString()} has ${connections.length} connections`
                });
            }
            if (counter >= peers.length) {
                return peerConnections;
            }
        });
        return peerConnections;
    }
    /**
     * Get the protocols for the libp2p process
     */
    getProtocols() {
        let protocols;
        if (!this.process) {
            throw new Error(`No process found for ${this.id.podId.name}`);
        }
        try {
            protocols = this.process.getProtocols();
        }
        catch (error) {
            logger({
                level: LogLevel.ERROR,
                stage: ProcessStage.ERROR,
                processId: this.id,
                message: `Error getting protocols for ${this.id.name}: ${error.message}`,
                error: error
            });
            throw error;
        }
        return protocols;
    }
    /**
     * Get a peers public Key
     */
    async getPublicKey(peerId) {
        let publicKey = undefined;
        try {
            publicKey = await this.process?.getPublicKey(peerId);
        }
        catch (error) {
            logger({
                level: LogLevel.ERROR,
                stage: ProcessStage.ERROR,
                processId: this.id,
                message: `Error getting public key for ${this.id.name}: ${error.message}`,
                error: error
            });
            throw error;
        }
        return publicKey;
    }
    /**
     * Get the listenerCount for the libp2p process
     */
    listenerCount(type) {
        let count = 0;
        try {
            if (!this.process) {
                throw new Error(`No process found for ${this.id.podId.name}`);
            }
            count = this.process.listenerCount(type);
        }
        catch (error) {
            logger({
                level: LogLevel.ERROR,
                stage: ProcessStage.ERROR,
                processId: this.id,
                message: `Error getting listener count for ${this.id.name}: ${error.message}`,
                error: error
            });
            throw error;
        }
        return count;
    }
    /**
     * dial a libp2p address
     */
    async dial(address) {
        let output = undefined;
        try {
            output = await this.process?.dial(multiaddr(address));
        }
        catch (error) {
            logger({
                level: LogLevel.ERROR,
                stage: ProcessStage.ERROR,
                processId: this.id,
                message: `Error dialing for ${this.id.name}: ${error.message}`,
                error: error
            });
            throw error;
        }
        if (!output) {
            logger({
                level: LogLevel.ERROR,
                stage: ProcessStage.ERROR,
                processId: this.id,
                message: `Dialed but no Connection was return for ${this.id.name}: unknown error`
            });
        }
        return output;
    }
    /**
     * Dial a libp2p address and protocol
     */
    async dialProtocol(address, protocol) {
        let output = undefined;
        try {
            output = await this.process?.dialProtocol(multiaddr(address), protocol);
        }
        catch (error) {
            logger({
                level: LogLevel.ERROR,
                stage: ProcessStage.ERROR,
                processId: this.id,
                message: `Error dialing protocol for ${this.id.name}: ${error.message}`,
                error: error
            });
            throw error;
        }
        if (!output) {
            logger({
                level: LogLevel.ERROR,
                stage: ProcessStage.ERROR,
                processId: this.id,
                message: `Dialed protocol but no Stream was return for ${this.id.name}: unknown error`
            });
        }
        return output;
    }
    /**
     * Hang Up a connection
     */
    async hangUpConnection(peerId) {
        try {
            await this.process?.hangUp(peerId);
        }
        catch (error) {
            logger({
                level: LogLevel.ERROR,
                stage: ProcessStage.ERROR,
                processId: this.id,
                message: `Error closing connection for ${this.id.name}: ${error.message}`,
                error: error
            });
            throw error;
        }
    }
    /**
     *  Subscribe to PubSub topic
     */
    async subscribe(topic, peers) {
        try {
            const pubsubInit = {
                enabled: true,
                canRelayMessage: true,
                emitSelf: true,
                maxInboundStreams: 100,
                maxOutboundStreams: 100
            };
            const pubsub = this.process?.services.pubsub;
            // const pubsub1 = gossipsub({
            //     enabled: true,
            //     multicodecs: ['/libp2p/pubsub/1.0.0'],
            //     canRelayMessage: true,
            //     emitSelf: true,
            //     messageProcessingConcurrency: 16,
            //     maxInboundStreams: 100,
            //     maxOutboundStreams: 100,
            //     doPX: true,
            //     msgIdFn: (msg: any) => {
            //         return msg.from
            //     },
            //     directPeers: peers ? peers : undefined
            // })
            // const newPubsub: PubSub = new Pubsub({
            //     libp2p: this.process,
            //     debugName: 'moonbase-pubsub',
            //     multicodecs: ['/libp2p/pubsub/1.0.0'],
            //     canRelayMessage: true,
            //     emitSelf: true,
            // })
            // @ts-ignore
            // console.log(pubsub1.getPeers())
            console.log(pubsub);
            // if (!isStarted) {
            //     // @ts-ignore
            //     pubsub().start()
            // }
            // @ts-ignore
            pubsub.addEventListener('message', (msg) => {
                if (msg.topic === topic) {
                    logger({
                        level: LogLevel.INFO,
                        stage: ProcessStage.STARTED,
                        processId: this.id,
                        message: `Message received for ${this.id.name}: ${msg}`
                    });
                }
            });
            // @ts-ignore
            pubsub.addEventListener('subscription-change', (msg) => {
                if (msg.topic === topic) {
                    logger({
                        level: LogLevel.INFO,
                        stage: ProcessStage.STARTED,
                        processId: this.id,
                        message: `Subscription change for ${this.id.name}: ${msg}`
                    });
                }
            });
            // @ts-ignore
            await pubsub.publish(topic, Buffer.from('Hello World!'));
        }
        catch (error) {
            logger({
                level: LogLevel.ERROR,
                stage: ProcessStage.ERROR,
                processId: this.id,
                message: `Error subscribing to topic for ${this.id.name}: ${error.message}`,
                error: error
            });
            throw error;
        }
        // @ts-ignore
    }
    /**
     * Publish to PubSub topic
     */
    async publish(topic, message) {
        try {
            const pubsub = this.process?.services.pubsub;
            const data = new Uint8Array(Buffer.from(message));
            // @ts-ignore
            const output = await pubsub.publish(topic, data);
            return output;
        }
        catch (error) {
            logger({
                level: LogLevel.ERROR,
                stage: ProcessStage.ERROR,
                processId: this.id,
                message: `Error publishing to topic for ${this.id.name}: ${error.message}`,
                error: error
            });
            throw error;
        }
    }
}
export { createLibp2pProcess, Libp2pProcess };
