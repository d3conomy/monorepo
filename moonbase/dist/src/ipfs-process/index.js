import { createHelia, } from "helia";
import { dagJson } from "@helia/dag-json";
import { CID } from "multiformats";
import { LogLevel, ProcessStage, logger } from "d3-artifacts";
import { IpfsFileSystem } from "./IpfsFileSystem.js";
// class HeliaLibp2pProcess extends HeliaLibp2p {
// }
/**
 * Create an IPFS process
 * @category IPFS
 */
const createIpfsProcess = async ({ libp2p, datastore, blockstore, start }) => {
    const helia = await createHelia({
        libp2p: libp2p.process,
        datastore: datastore,
        blockstore: blockstore,
        start: start
    });
    return helia;
};
/**
 * The process container for the IPFS process
 *
 * Helia is used as the IPFS process
 * @category IPFS
 */
class IpfsProcess {
    id;
    process;
    options;
    filesystem = new Map();
    processStatus = ProcessStage.NEW;
    /**
     * Constructor for the Ipfs process
     */
    constructor({ id, process, options }) {
        this.id = id;
        this.process = process;
        this.options = options;
    }
    /**
     * Check if the IPFS process exists
     */
    checkProcess() {
        if (this.process) {
            return true;
        }
        logger({
            level: LogLevel.ERROR,
            processId: this.id,
            message: `No Ipfs process found`
        });
        return false;
    }
    /**
     * Initialize the IPFS Process
     */
    async init() {
        this.processStatus = ProcessStage.INITIALIZING;
        if (this.process !== undefined) {
            logger({
                level: LogLevel.WARN,
                processId: this.id,
                message: `Ipfs process already exists`
            });
            this.processStatus = ProcessStage.INITIALIZED;
            return;
        }
        if (!this.options) {
            logger({
                level: LogLevel.ERROR,
                processId: this.id,
                message: `No Ipfs options found`
            });
            this.processStatus = ProcessStage.ERROR;
            throw new Error(`No Ipfs options found`);
        }
        if (!this.options.libp2p) {
            logger({
                level: LogLevel.ERROR,
                processId: this.id,
                message: `No Libp2p process found`
            });
            this.processStatus = ProcessStage.ERROR;
            throw new Error(`No Libp2p process found`);
        }
        try {
            const process = await createIpfsProcess(this.options);
            this.process = process;
        }
        catch (error) {
            this.processStatus = ProcessStage.ERROR;
            logger({
                level: LogLevel.ERROR,
                processId: this.id,
                message: `Error creating Ipfs process: ${error.message}`,
                error: error
            });
            throw error;
        }
        logger({
            level: LogLevel.INFO,
            processId: this.id,
            message: `Ipfs process created and initialized`,
            stage: ProcessStage.INITIALIZED
        });
        this.processStatus = ProcessStage.INITIALIZED;
    }
    addFileSystem({ id, fileSystemType }) {
        if (this.process) {
            this.filesystem.set(id, new IpfsFileSystem({
                id: id,
                ipfs: this,
                filesystemType: fileSystemType
            }));
        }
    }
    /**
     * Get the status of the IPFS process
     */
    status() {
        return this.processStatus;
    }
    /**
     * Start the IPFS process
     */
    async start() {
        if (this.checkProcess()) {
            this.processStatus = ProcessStage.STARTING;
            try {
                await this.process?.start();
                logger({
                    level: LogLevel.INFO,
                    processId: this.id,
                    message: `Ipfs process started`,
                    stage: ProcessStage.STARTED
                });
                this.processStatus = ProcessStage.STARTED;
            }
            catch (error) {
                logger({
                    level: LogLevel.ERROR,
                    processId: this.id,
                    message: `Error starting Ipfs process: ${error.message}`,
                    error: error
                });
                this.processStatus = ProcessStage.ERROR;
                throw error;
            }
        }
    }
    /**
     * Stop the IPFS process
     */
    async stop() {
        if (this.checkProcess()) {
            try {
                this.processStatus = ProcessStage.STOPPING;
                await this.process?.stop();
                logger({
                    level: LogLevel.INFO,
                    processId: this.id,
                    message: `Ipfs process stopped`,
                    stage: ProcessStage.STOPPED
                });
                this.processStatus = ProcessStage.STOPPED;
            }
            catch (error) {
                logger({
                    level: LogLevel.ERROR,
                    processId: this.id,
                    message: `Error stopping Ipfs process: ${error.message}`,
                    error: error
                });
                this.processStatus = ProcessStage.ERROR;
                throw error;
            }
        }
    }
    /**
     * Restart the IPFS process
     */
    async restart() {
        if (this.checkProcess()) {
            try {
                this.processStatus = ProcessStage.RESTARTING;
                await this.process?.stop();
                await this.process?.start();
                logger({
                    level: LogLevel.INFO,
                    processId: this.id,
                    message: `Ipfs process restarted`,
                    stage: ProcessStage.STARTED
                });
                this.processStatus = ProcessStage.STARTED;
            }
            catch (error) {
                logger({
                    level: LogLevel.ERROR,
                    processId: this.id,
                    message: `Error restarting Ipfs process: ${error.message}`,
                    error: error
                });
                this.processStatus = ProcessStage.ERROR;
                throw error;
            }
        }
    }
    /**
     * Add a JSON object to IPFS
     */
    async addJson(data) {
        let cid = undefined;
        if (this.checkProcess()) {
            try {
                const dj = dagJson(this.process);
                cid = await dj.add(data);
            }
            catch (error) {
                logger({
                    level: LogLevel.ERROR,
                    processId: this.id,
                    message: `Error adding JSON to Ipfs: ${error.message}`,
                    error: error
                });
                throw error;
            }
        }
        logger({
            level: LogLevel.INFO,
            processId: this.id,
            message: `Added JSON to Ipfs: ${cid}`
        });
        return cid;
    }
    /**
     * Get a JSON object from IPFS
     */
    async getJson(cid) {
        let result;
        if (this.process) {
            try {
                const dj = dagJson(this.process);
                result = await dj.get(CID.parse(cid));
            }
            catch (error) {
                logger({
                    level: LogLevel.ERROR,
                    processId: this.id,
                    message: `Error getting JSON from Ipfs: ${error.message}`,
                    error: error
                });
                throw error;
            }
        }
        logger({
            level: LogLevel.INFO,
            processId: this.id,
            message: `Got JSON from Ipfs: ${JSON.stringify(result)}`
        });
        return result;
    }
    /**
     * Get Libp2p from IPFS
     */
    getLibp2p() {
        if (this.process) {
            return this.process.libp2p;
        }
        return undefined;
    }
}
export { createIpfsProcess, IpfsProcess };
export * from "./IpfsOptions.js";
export * from "./IpfsFileSystem.js";
