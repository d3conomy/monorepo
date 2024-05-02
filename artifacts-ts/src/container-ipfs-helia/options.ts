import { MemoryDatastore } from "datastore-core";
import { MemoryBlockstore } from "blockstore-core";
import { LevelBlockstore } from "blockstore-level";
import { InstanceOption, InstanceOptions } from "../container/options";
import { Libp2pContainer } from "../container-libp2p";

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

const defaultIpfsOptions = (): InstanceOptions => {
    return new InstanceOptions({options: [
        {
            name: 'libp2p',
            description: 'Libp2p process',
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
            description: 'Start the process',
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
    constructor(options: InstanceOptions = defaultIpfsOptions()) {
        super({options: options.toArray()});
    }

    init(): void {
        if (this.get('blockstorePath') !== undefined) {
            this.set('blockstore', createBlockStore(BlockStores.LEVEL, this.get('blockstorePath')))
        }
    }
}

export {
    defaultIpfsOptions,
    IpfsOptions
}