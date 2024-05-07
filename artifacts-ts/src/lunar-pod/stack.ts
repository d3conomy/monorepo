import { IpfsFileSystemContainer } from "../container-ipfs-helia-filesystem/index.js";
import { IpfsContainer } from "../container-ipfs-helia/index.js";
import { GossipSubContainer } from "../container-libp2p-pubsub/index.js";
import { Libp2pContainer } from "../container-libp2p/index.js";
import { DatabaseContainer } from "../container-orbitdb-open/index.js";
import { OrbitDbContainer } from "../container-orbitdb/index.js";
import { Container } from "../container/index.js";
import { InstanceTypes } from "../container/instance.js";
import { ContainerId } from "../id-reference-factory/IdReferenceClasses.js"
import { Libp2pLevel, IpfsLevel, OrbitDbLevel, DatabaseLevel, GossipSubLevel, IpfsFileSystemLevel } from "./levels.js";
import { LunarPodOptions } from "./options.js";


interface FullStack {
    libp2p: Libp2pLevel;
    ipfs: IpfsLevel;
    orbitdb: OrbitDbLevel;
    databases: DatabaseLevel;
    gossipsub: GossipSubLevel;
    ipfsFileSystem: IpfsFileSystemLevel;
    custom?: Container<InstanceTypes.Custom>[];
}

class DatabaseStack implements Pick<FullStack, 'libp2p' | 'ipfs' | 'orbitdb' | 'databases'> {
    options: LunarPodOptions;
    libp2p: Libp2pLevel;
    ipfs: IpfsLevel;
    orbitdb: OrbitDbLevel;
    databases: DatabaseLevel;

    constructor(id: ContainerId[], options: LunarPodOptions) {
        this.options = options;
        this.libp2p = new Libp2pLevel(id[0], options.get('libp2pOptions'));
        this.ipfs = new IpfsLevel(id[1], options.get('ipfsOptions'));
        this.orbitdb = new OrbitDbLevel(id[2], options.get('orbitDbOptions'));
        this.databases = new DatabaseLevel(id.slice(3), options.get('openDbOptions'));
    }

    async init(): Promise<void> {
        console.log('DatabaseStack init', this.libp2p, this.ipfs, this.orbitdb, this.databases)

        await this.libp2p.init();
        await this.ipfs.init(this.libp2p.container);
        await this.orbitdb.init(this.ipfs.container);
        await this.databases.init(this.orbitdb.container);
    }

    getContainers():  [Libp2pContainer?, IpfsContainer?, OrbitDbContainer?, ...DatabaseContainer[]] {
        return [
            this.libp2p.container,
            this.ipfs.container,
            this.orbitdb.container,
            ...this.databases.getContainers()
        ];
    }

}

class GossipSubStack implements Pick<FullStack, 'libp2p' | 'gossipsub'> {
    options: LunarPodOptions;
    libp2p: Libp2pLevel;
    gossipsub: GossipSubLevel;

    constructor(id: ContainerId[], options: LunarPodOptions) {
        this.options = options;
        this.libp2p = new Libp2pLevel(id[0], options.get('libp2pOptions'));
        this.gossipsub = new GossipSubLevel(id[1], options.get('gossipSubOptions'));
    }

    async init(): Promise<void> {
        await this.libp2p.init();
        await this.gossipsub.init(this.libp2p?.container);
    }

    getContainers(): [Libp2pContainer?, GossipSubContainer?] {
        return [
            this.libp2p.container,
            this.gossipsub.container
        ];
    }
}

class IpfsFileSystemStack implements Pick<FullStack, 'libp2p' | 'ipfs' | 'ipfsFileSystem'> {
    options: LunarPodOptions;
    libp2p: Libp2pLevel;
    ipfs: IpfsLevel;
    ipfsFileSystem: IpfsFileSystemLevel;

    constructor(id: ContainerId[], options: LunarPodOptions) {
        this.options = options;
        this.libp2p = new Libp2pLevel(id[0], options.get('libp2pOptions'));
        this.ipfs = new IpfsLevel(id[1], options.get('ipfsOptions'));
        this.ipfsFileSystem = new IpfsFileSystemLevel(id[2], options.get('ipfsFileSystemOptions'));
    }

    async init(): Promise<void> {
        await this.libp2p.init();
        await this.ipfs.init(this.libp2p?.container);
        await this.ipfsFileSystem.init(this.ipfs?.container);
    }

    getContainers(): [Libp2pContainer?, IpfsContainer?, IpfsFileSystemContainer?] {
        return [
            this.libp2p.container,
            this.ipfs.container,
            this.ipfsFileSystem.container
        ];
    }
}

type StackType = DatabaseStack | GossipSubStack | IpfsFileSystemStack ; // | FullStack;
 enum StackTypes {
    Database = 'database',
    GossipSub = 'gossipsub',
    IpfsFileSystem = 'ipfsFileSystem',
    Full = 'full'
}

export {
    // Stack,
    StackType,
    StackTypes,
    DatabaseStack,
    GossipSubStack,
    IpfsFileSystemStack,
    FullStack
}