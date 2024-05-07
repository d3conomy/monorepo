import { IpfsFileSystemContainer } from "../container-ipfs-helia-filesystem/index.js";
import { IpfsContainer } from "../container-ipfs-helia/index.js";
import { GossipSubContainer } from "../container-libp2p-pubsub/index.js";
import { Libp2pContainer } from "../container-libp2p/index.js";
import { DatabaseContainer } from "../container-orbitdb-open/index.js";
import { OrbitDbContainer } from "../container-orbitdb/index.js";
import { Container } from "../container/index.js";
import { InstanceTypes } from "../container/instance.js";
import { ContainerId } from "../id-reference-factory/IdReferenceClasses.js";
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
declare class DatabaseStack implements Pick<FullStack, 'libp2p' | 'ipfs' | 'orbitdb' | 'databases'> {
    options: LunarPodOptions;
    libp2p: Libp2pLevel;
    ipfs: IpfsLevel;
    orbitdb: OrbitDbLevel;
    databases: DatabaseLevel;
    constructor(id: ContainerId[], options: LunarPodOptions);
    init(): Promise<void>;
    getContainers(): [Libp2pContainer?, IpfsContainer?, OrbitDbContainer?, ...DatabaseContainer[]];
}
declare class GossipSubStack implements Pick<FullStack, 'libp2p' | 'gossipsub'> {
    options: LunarPodOptions;
    libp2p: Libp2pLevel;
    gossipsub: GossipSubLevel;
    constructor(id: ContainerId[], options: LunarPodOptions);
    init(): Promise<void>;
    getContainers(): [Libp2pContainer?, GossipSubContainer?];
}
declare class IpfsFileSystemStack implements Pick<FullStack, 'libp2p' | 'ipfs' | 'ipfsFileSystem'> {
    options: LunarPodOptions;
    libp2p: Libp2pLevel;
    ipfs: IpfsLevel;
    ipfsFileSystem: IpfsFileSystemLevel;
    constructor(id: ContainerId[], options: LunarPodOptions);
    init(): Promise<void>;
    getContainers(): [Libp2pContainer?, IpfsContainer?, IpfsFileSystemContainer?];
}
type StackType = DatabaseStack | GossipSubStack | IpfsFileSystemStack;
declare enum StackTypes {
    Database = "database",
    GossipSub = "gossipsub",
    IpfsFileSystem = "ipfsFileSystem",
    Full = "full"
}
export { StackType, StackTypes, DatabaseStack, GossipSubStack, IpfsFileSystemStack, FullStack };
//# sourceMappingURL=stack.d.ts.map