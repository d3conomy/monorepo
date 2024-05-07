import { InstanceOptions } from "../container/options.js";
import { Libp2pContainer } from "../container-libp2p/index.js";
import { IpfsContainer } from "../container-ipfs-helia/index.js";
import { OrbitDbContainer } from "../container-orbitdb/index.js";
import { DatabaseContainer } from "../container-orbitdb-open/index.js";
import { GossipSubContainer } from "../container-libp2p-pubsub/index.js";
import { IpfsFileSystemContainer } from "../container-ipfs-helia-filesystem/index.js";
import { ContainerId } from "../id-reference-factory/IdReferenceClasses.js";
import { InstanceTypes } from "../container/instance.js";
type StackContainers = Libp2pContainer | IpfsContainer | OrbitDbContainer | DatabaseContainer | GossipSubContainer | IpfsFileSystemContainer;
interface StackLevel<T = StackContainers, U = StackContainers> {
    id: ContainerId | ContainerId[];
    type: InstanceTypes;
    options: InstanceOptions | InstanceOptions[];
    container?: T | T[];
    builder: (id: ContainerId, options: InstanceOptions, dependant: U) => Promise<T>;
    init(dependant: U | undefined): Promise<void>;
}
declare class Libp2pLevel implements StackLevel<Libp2pContainer, undefined> {
    id: ContainerId;
    type: InstanceTypes;
    container?: Libp2pContainer;
    options: InstanceOptions;
    builder: (id: ContainerId, options: InstanceOptions, dependant: undefined) => Promise<Libp2pContainer>;
    constructor(id: ContainerId, options: InstanceOptions);
    init(): Promise<void>;
}
declare class IpfsLevel implements StackLevel<IpfsContainer, Libp2pContainer> {
    id: ContainerId;
    type: InstanceTypes;
    container?: IpfsContainer;
    options: InstanceOptions;
    builder: (id: ContainerId, options: InstanceOptions, dependant: Libp2pContainer) => Promise<IpfsContainer>;
    constructor(id: ContainerId, options: InstanceOptions);
    init(dependant?: Libp2pContainer): Promise<void>;
}
declare class OrbitDbLevel implements StackLevel<OrbitDbContainer, IpfsContainer> {
    id: ContainerId;
    type: InstanceTypes;
    container?: OrbitDbContainer;
    options: InstanceOptions;
    builder: (id: ContainerId, options: InstanceOptions, dependant: IpfsContainer) => Promise<OrbitDbContainer>;
    constructor(id: ContainerId, options: InstanceOptions);
    init(dependant?: IpfsContainer): Promise<void>;
}
declare class DatabaseLevel implements StackLevel<DatabaseContainer, OrbitDbContainer> {
    id: ContainerId[];
    type: InstanceTypes;
    container: DatabaseContainer[];
    options: InstanceOptions[];
    builder: (id: ContainerId, options: InstanceOptions, dependant: OrbitDbContainer) => Promise<DatabaseContainer>;
    constructor(id: ContainerId[], options: InstanceOptions[]);
    init(dependant?: OrbitDbContainer): Promise<void>;
    getContainers(): DatabaseContainer[];
}
declare class GossipSubLevel implements StackLevel<GossipSubContainer, Libp2pContainer> {
    id: ContainerId;
    type: InstanceTypes;
    container?: GossipSubContainer;
    options: InstanceOptions;
    builder: (id: ContainerId, options: InstanceOptions, dependant: Libp2pContainer) => Promise<GossipSubContainer>;
    constructor(id: ContainerId, options: InstanceOptions);
    init(dependant?: Libp2pContainer): Promise<void>;
}
declare class IpfsFileSystemLevel implements StackLevel<IpfsFileSystemContainer, IpfsContainer> {
    id: ContainerId;
    type: InstanceTypes;
    container?: IpfsFileSystemContainer;
    options: InstanceOptions;
    builder: (id: ContainerId, options: InstanceOptions, dependant: IpfsContainer) => Promise<IpfsFileSystemContainer>;
    constructor(id: ContainerId, options: InstanceOptions);
    init(dependant?: IpfsContainer): Promise<void>;
}
export { Libp2pLevel, IpfsLevel, OrbitDbLevel, DatabaseLevel, GossipSubLevel, IpfsFileSystemLevel, StackContainers };
//# sourceMappingURL=levels.d.ts.map