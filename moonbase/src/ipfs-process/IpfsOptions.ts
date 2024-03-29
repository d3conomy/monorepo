import { MemoryDatastore } from "datastore-core";
import { MemoryBlockstore } from "blockstore-core";
import { Libp2pProcess } from "../libp2p-process/index.js";

/**
 * The options for creating an Ipfs process
 * @category IPFS
 */
class IpfsOptions {
    libp2p: Libp2pProcess
    datastore: any
    blockstore: any
    start: boolean


    constructor({
        libp2p,
        datastore,
        blockstore,
        start,
    }: {
        libp2p?: Libp2pProcess,
        datastore?: any,
        blockstore?: any,
        start?: boolean
    }) {
        if (!libp2p) {
            throw new Error(`No Libp2p process found`)
        }
        this.libp2p = libp2p 
        this.datastore = datastore ? datastore : new MemoryDatastore()
        this.blockstore = blockstore ? datastore : new MemoryBlockstore()
        this.start = start ? start : false
    }
}

export {
    IpfsOptions
}