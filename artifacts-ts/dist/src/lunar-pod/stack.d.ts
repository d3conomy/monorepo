import { PodId } from "../id-reference-factory/IdReferenceClasses.js";
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
}
type DatabaseStack = Pick<Stack, 'libp2p' | 'ipfs' | 'orbitdb' | 'databases'>;
type GossipSubStack = Pick<Stack, 'libp2p' | 'gossipsub'>;
type IpfsFileSystemStack = Pick<Stack, 'libp2p' | 'ipfs' | 'ipfsFileSystem'>;
type Stacks = DatabaseStack | GossipSubStack | IpfsFileSystemStack;
declare enum StackTypes {
    Database = "database",
    GossipSub = "gossipsub",
    IpfsFileSystem = "ipfs-filesystem"
}
declare class StackFactory {
    static createStack<T = Stacks>(type: StackTypes, podId: PodId, idReferenceFactory: IdReferenceFactory, options?: LunarPodOptions): Promise<T>;
}
export { Stack, DatabaseStack, GossipSubStack, IpfsFileSystemStack, Stacks, StackTypes, StackFactory };
//# sourceMappingURL=stack.d.ts.map