import { MemoryDatastore } from "datastore-core";
import { MemoryBlockstore } from "blockstore-core";
import { LevelBlockstore } from "blockstore-level";
import { InstanceOption, InstanceOptions } from "../container/options.js";
import { Libp2pContainer } from "../container-libp2p/index.js";

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

const ipfsOptions = (): InstanceOptions => {
    return new InstanceOptions({options: [
        {
            name: 'libp2p',
            description: 'Libp2p container',
            required: true
        } as InstanceOption<Libp2pContainer>,    
        {
            name: 'datastore',
            description: 'Datastore',
            required: false,
            defaultValue: new MemoryDatastore()
        } as InstanceOption<any>,    
        {
            name: 'blockstore',
            description: 'Blockstore',
            required: false,
            defaultValue: new MemoryBlockstore()
        } as InstanceOption<any>,    
        {
            name: 'blockstorePath',
            description: 'Blockstore path',
            required: false,
        } as InstanceOption<string>,    
        {
            name: 'start',
            description: 'Start the instance',
            required: false,
            defaultValue: false
        } as InstanceOption<boolean>
    ]})
}

/**
 * The options for creating an Ipfs process
 * @category IPFS
 */
class IpfsOptions
    extends InstanceOptions
{
    constructor(options: InstanceOptions, defaults: boolean = true) {
        super({options: options.toArray(), injectDefaults: defaults, defaults: ipfsOptions()});
        this.init()
    }

    init(): void {
        if (this.get('blockstorePath') !== undefined) {
            this.set('blockstore', createBlockStore(
                BlockStores.LEVEL,
                this.get('blockstorePath')
            ))
        }
    }
}

export {
    ipfsOptions,
    IpfsOptions
}