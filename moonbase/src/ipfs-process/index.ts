
import { Helia, createHelia} from "helia";
import { dagJson } from "@helia/dag-json";
import { dagCbor } from "@helia/dag-cbor";
import { CID } from "multiformats";

import { IpfsOptions } from "./IpfsOptions.js";
import { IProcess, IdReference, LogLevel, ProcessStage, logger } from "d3-artifacts";


/**
 * Create an IPFS process
 * @category IPFS
 */
const createIpfsProcess = async ({
    libp2p,
    datastore,
    blockstore,
    start
}: IpfsOptions): Promise<Helia> => {
    return await createHelia({
        libp2p: libp2p.process,
        datastore: datastore,
        blockstore: blockstore,
        start: start
    })
}


/**
 * The process container for the IPFS process
 * 
 * Helia is used as the IPFS process
 * @category IPFS
 */
class IpfsProcess
    implements IProcess
{
    public declare id: IdReference
    public declare process?: Helia
    public declare options?: IpfsOptions

    /**
     * Constructor for the Ipfs process
     */
    constructor({
        id,
        process,
        options
    }: {
        id: IdReference,
        process?: Helia
        options?: IpfsOptions
    }) {
        this.id = id
        this.process = process
        this.options = options
    }

    /**
     * Check if the IPFS process exists
     */
    public checkProcess(): boolean {
        if (this.process) {
            return true
        }
        logger({
            level: LogLevel.ERROR,
            processId: this.id,
            message: `No Ipfs process found`
        })
        return false
    }

    /**
     * Initialize the IPFS Process
     */
    public async init(): Promise<void> {
        if (this.process !== undefined) {
            logger({
                level: LogLevel.WARN,
                processId: this.id,
                message: `Ipfs process already exists`
            })
            return;
        }

        if (!this.options) {
            logger({
                level: LogLevel.ERROR,
                processId: this.id,
                message: `No Ipfs options found`
            })
            throw new Error(`No Ipfs options found`)
        }
        
        if (!this.options.libp2p) {
            logger({
                level: LogLevel.ERROR,
                processId: this.id,
                message: `No Libp2p process found`
            })
            throw new Error(`No Libp2p process found`)
        }

        try {
            this.process = await createIpfsProcess(this.options)
        }
        catch (error: any) {
            logger({
                level: LogLevel.ERROR,
                processId: this.id,
                message: `Error creating Ipfs process: ${error.message}`,
                error: error
            })
            throw error
        }
        logger({
            level: LogLevel.INFO,
            processId: this.id,
            message: `Ipfs process created and initialized`,
            stage: ProcessStage.INIT
        })
    }

    /**
     * Get the status of the IPFS process
     */
    public status(): ProcessStage {
        throw new Error("Method not implemented.");
    }

    /**
     * Start the IPFS process
     */
    public async start(): Promise<void> {
        if (this.checkProcess()) {
            try {
                await this.process?.start()
                logger({
                    level: LogLevel.INFO,
                    processId: this.id,
                    message: `Ipfs process started`,
                    stage: ProcessStage.STARTED
                })
            }
            catch (error: any) {
                logger({
                    level: LogLevel.ERROR,
                    processId: this.id,
                    message: `Error starting Ipfs process: ${error.message}`,
                    error: error
                })
                throw error
            }
        }
    }

    /**
     * Stop the IPFS process
     */
    public async stop(): Promise<void> {
        if (this.checkProcess()) {
            try {
                await this.process?.stop()
                logger({
                    level: LogLevel.INFO,
                    processId: this.id,
                    message: `Ipfs process stopped`,
                    stage: ProcessStage.STOPPED
                })
            }
            catch (error: any) {
                logger({
                    level: LogLevel.ERROR,
                    processId: this.id,
                    message: `Error stopping Ipfs process: ${error.message}`,
                    error: error
                })
                throw error
            }
        }
    }

    /**
     * Restart the IPFS process
     */
    public async restart(): Promise<void> {
        if (this.checkProcess()) {
            try {
                await this.process?.stop()
                await this.process?.start()
                logger({
                    level: LogLevel.INFO,
                    processId: this.id,
                    message: `Ipfs process restarted`,
                    stage: ProcessStage.RESTARTING
                })
            }
            catch (error: any) {
                logger({
                    level: LogLevel.ERROR,
                    processId: this.id,
                    message: `Error restarting Ipfs process: ${error.message}`,
                    error: error
                })
                throw error
            }
        }
    }

    /**
     * Add a JSON object to IPFS
     */
    public async addJson(data: any): Promise<CID | undefined> {
        let cid: CID | undefined = undefined
        if (this.checkProcess()) {
            try {
                const dj = dagJson(this.process as Helia)
                cid = await dj.add(data);
            }
            catch (error: any) {
                logger({
                    level: LogLevel.ERROR,
                    processId: this.id,
                    message: `Error adding JSON to Ipfs: ${error.message}`,
                    error: error
                })
                throw error
            }
        }
        logger({
            level: LogLevel.INFO,
            processId: this.id,
            message: `Added JSON to Ipfs: ${cid}`
        })
        return cid
    }

    /**
     * Get a JSON object from IPFS
     */
    public async getJson(cid: string): Promise<any | undefined> {
        let result: any
        if (this.process) {
            try {
                const dj = dagJson(this.process)
                result = await dj.get(CID.parse(cid));
            }
            catch (error: any) {
                logger({
                    level: LogLevel.ERROR,
                    processId: this.id,
                    message: `Error getting JSON from Ipfs: ${error.message}`,
                    error: error
                })
                throw error
            }
        }
        logger({
            level: LogLevel.INFO,
            processId: this.id,
            message: `Got JSON from Ipfs: ${JSON.stringify(result)}`
        })
        return result
    }
}

export {
    createIpfsProcess,
    IpfsProcess
}
