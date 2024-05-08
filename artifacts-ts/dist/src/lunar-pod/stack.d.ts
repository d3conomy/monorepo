import { Container } from "../container/index.js";
import { InstanceTypes } from "../container/instance.js";
import { Libp2pLevel, IpfsLevel, OrbitDbLevel, DatabaseLevel, GossipSubLevel, IpfsFileSystemLevel } from "./levels.js";
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
export { Stack, DatabaseStack, GossipSubStack, IpfsFileSystemStack };
//# sourceMappingURL=stack.d.ts.map