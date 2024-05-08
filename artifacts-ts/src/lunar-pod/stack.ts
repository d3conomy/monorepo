import { IpfsFileSystemContainer } from "../container-ipfs-helia-filesystem/index.js";
import { IpfsContainer } from "../container-ipfs-helia/index.js";
import { GossipSubContainer } from "../container-libp2p-pubsub/index.js";
import { Libp2pContainer } from "../container-libp2p/index.js";
import { DatabaseContainer } from "../container-orbitdb-open/index.js";
import { OrbitDbContainer } from "../container-orbitdb/index.js";
import { Container } from "../container/index.js";
import { InstanceTypes } from "../container/instance.js";
import { ContainerId, IdReference, PodId } from "../id-reference-factory/IdReferenceClasses.js"
import { IdReferenceFactory } from "../id-reference-factory/IdReferenceFactory.js";
import { Libp2pLevel, IpfsLevel, OrbitDbLevel, DatabaseLevel, GossipSubLevel, IpfsFileSystemLevel } from "./levels.js";
import { LunarPodOptions } from "./options.js";

interface Stack {
    libp2p: Libp2pLevel;
    ipfs: IpfsLevel;
    orbitdb: OrbitDbLevel;
    databases: DatabaseLevel[];
    gossipsub: GossipSubLevel;
    ipfsFileSystem: IpfsFileSystemLevel;
    custom?: Container<InstanceTypes.Custom>[];
}

type DatabaseStack = Pick<Stack, 'libp2p' | 'ipfs' | 'orbitdb' | 'databases'>;
type GossipSubStack = Pick<Stack, 'libp2p' | 'gossipsub'>;
type IpfsFileSystemStack = Pick<Stack, 'libp2p' | 'ipfs' | 'ipfsFileSystem'>;

type Stacks = DatabaseStack | GossipSubStack | IpfsFileSystemStack;
enum StackTypes {
    Database = 'database',
    GossipSub = 'gossipsub',
    IpfsFileSystem = 'ipfs-filesystem'
}



export {
    Stack,
    DatabaseStack,
    GossipSubStack,
    IpfsFileSystemStack
}
