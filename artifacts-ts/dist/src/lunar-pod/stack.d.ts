import { PodId } from "../id-reference-factory/IdReferenceClasses.js";
import { IdReferenceFactory } from "../id-reference-factory/IdReferenceFactory.js";
import { Libp2pLevel, IpfsLevel, OrbitDbLevel, DatabaseLevel, GossipSubLevel, IpfsFileSystemLevel, CustomLevel, StackContainers } from "./levels.js";
import { LunarPodOptions } from "./options.js";
interface IStack {
    libp2p?: Libp2pLevel;
    ipfs?: IpfsLevel;
    orbitdb?: OrbitDbLevel;
    databases?: DatabaseLevel[];
    gossipsub?: GossipSubLevel;
    ipfsFileSystem?: IpfsFileSystemLevel;
    custom?: CustomLevel[];
    getContainers(): Array<StackContainers | undefined>;
}
type DatabaseStack = Pick<IStack, 'libp2p' | 'ipfs' | 'orbitdb' | 'databases' | 'getContainers'>;
type GossipSubStack = Pick<IStack, 'libp2p' | 'gossipsub' | 'getContainers'>;
type IpfsFileSystemStack = Pick<IStack, 'libp2p' | 'ipfs' | 'ipfsFileSystem' | 'getContainers'>;
type Stacks = DatabaseStack | GossipSubStack | IpfsFileSystemStack | IStack;
declare enum StackTypes {
    Database = "database",
    GossipSub = "gossipsub",
    IpfsFileSystem = "ipfs-filesystem",
    Custom = "custom"
}
declare class Stack<T = Stacks> implements IStack {
    libp2p?: Libp2pLevel;
    ipfs?: IpfsLevel;
    orbitdb?: OrbitDbLevel;
    databases?: DatabaseLevel[];
    gossipsub?: GossipSubLevel;
    ipfsFileSystem?: IpfsFileSystemLevel;
    custom?: CustomLevel[];
    constructor({ libp2p, ipfs, orbitdb, databases, gossipsub, ipfsFileSystem, custom }: {
        libp2p?: Libp2pLevel;
        ipfs?: IpfsLevel;
        orbitdb?: OrbitDbLevel;
        databases?: DatabaseLevel[];
        gossipsub?: GossipSubLevel;
        ipfsFileSystem?: IpfsFileSystemLevel;
        custom?: CustomLevel[];
    });
    getContainers(): Array<StackContainers | undefined>;
}
declare class StackFactory {
    static createStack<T = Stacks>(type: StackTypes, podId: PodId, idReferenceFactory: IdReferenceFactory, options?: LunarPodOptions): Promise<T>;
}
export { Stack, DatabaseStack, GossipSubStack, IpfsFileSystemStack, Stacks, StackTypes, StackFactory };
//# sourceMappingURL=stack.d.ts.map