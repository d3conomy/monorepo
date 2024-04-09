import { MemoryDatastore } from "datastore-core";
import { MemoryBlockstore } from "blockstore-core";
import { LevelBlockstore } from "blockstore-level";
import { Libp2pProcess } from "../libp2p-process/index.js";

enum BlockStores {
    MEMORY = "MemoryBlockstore",
    LEVEL = "LevelBlockstore"
}

type BlockStore = MemoryBlockstore | LevelBlockstore

const createBlockStore = (blockstore: BlockStores, path: string) => {
    switch (blockstore) {
        case BlockStores.MEMORY:
            return new MemoryBlockstore()
        case BlockStores.LEVEL:
        default:
            return new LevelBlockstore(path)
    }
}

/**
 * The options for creating an Ipfs process
 * @category IPFS
 */
class IpfsOptions {
    libp2p: Libp2pProcess
    datastore: any
    blockstore: BlockStore
    start: boolean


    constructor({
        libp2p,
        datastore,
        blockstore,
        blockstorePath,
        start,
    }: {
        libp2p?: Libp2pProcess,
        datastore?: any,
        blockstore?: any,
        blockstorePath?: string,
        start?: boolean
    }) {
        if (!libp2p) {
            throw new Error(`No Libp2p process found`)
        }
        this.libp2p = libp2p 
        this.datastore = datastore ? datastore : new MemoryDatastore()
        this.blockstore = createBlockStore(blockstore, blockstorePath ? blockstorePath : `./ipfs/${libp2p.id.podId.toString()}`)
        this.start = start ? start : false
    }
}

export {
    IpfsOptions
}