import { InstanceOptions } from "../container/options.js";
import { Libp2pContainer } from "../container-libp2p/index.js";
import { IpfsContainer } from "../container-ipfs-helia/index.js";
import { OrbitDbContainer } from "../container-orbitdb/index.js";
import { DatabaseContainer } from "../container-orbitdb-open/index.js";
import { GossipSubContainer } from "../container-libp2p-pubsub/index.js";
import { IpfsFileSystemContainer } from "../container-ipfs-helia-filesystem/index.js";
import { ContainerId } from "../id-reference-factory/IdReferenceClasses.js";
import { InstanceTypes } from "../container/instance.js";
import { Container } from "../container/index.js";
type StackContainers = Libp2pContainer | IpfsContainer | OrbitDbContainer | DatabaseContainer | GossipSubContainer | IpfsFileSystemContainer | Container<InstanceTypes.custom>;
declare class StackLevel<T = StackContainers, U = StackContainers> {
    id: ContainerId;
    type: InstanceTypes;
    options?: InstanceOptions | undefined;
    dependant: U | undefined;
    container?: T;
    builder: (id: ContainerId, options: InstanceOptions, dependant?: U | undefined) => Promise<T>;
    constructor({ id, type, options, builder, dependant, }: {
        id: ContainerId;
        type: InstanceTypes;
        options?: InstanceOptions;
        builder: (id: ContainerId, options: InstanceOptions, dependant?: U | undefined) => Promise<T>;
        dependant?: U;
    });
    init(dependant?: U): Promise<void>;
}
declare class Libp2pLevel extends StackLevel<Libp2pContainer, undefined> {
    constructor({ id, options }: {
        id: ContainerId;
        options?: InstanceOptions;
    });
}
declare class IpfsLevel extends StackLevel<IpfsContainer, Libp2pContainer> {
    constructor({ id, options, dependant }: {
        id: ContainerId;
        options?: InstanceOptions;
        dependant?: Libp2pContainer;
    });
}
declare class OrbitDbLevel extends StackLevel<OrbitDbContainer, IpfsContainer> {
    constructor({ id, options, dependant }: {
        id: ContainerId;
        options?: InstanceOptions;
        dependant?: IpfsContainer;
    });
}
declare class DatabaseLevel extends StackLevel<DatabaseContainer, OrbitDbContainer> {
    constructor({ id, options, dependant }: {
        id: ContainerId;
        options?: InstanceOptions;
        dependant?: OrbitDbContainer;
    });
}
declare class GossipSubLevel extends StackLevel<GossipSubContainer, Libp2pContainer> {
    constructor({ id, options, dependant }: {
        id: ContainerId;
        options?: InstanceOptions;
        dependant?: Libp2pContainer;
    });
}
declare class IpfsFileSystemLevel extends StackLevel<IpfsFileSystemContainer, IpfsContainer> {
    constructor({ id, options, dependant }: {
        id: ContainerId;
        options?: InstanceOptions;
        dependant?: IpfsContainer;
    });
}
declare class CustomLevel extends StackLevel<Container<InstanceTypes.custom>, undefined | StackContainers> {
    constructor({ id, options, builder, dependant }: {
        id: ContainerId;
        options?: InstanceOptions;
        builder: (id: ContainerId, options: InstanceOptions, dependant?: undefined | StackContainers) => Promise<Container<InstanceTypes.custom>>;
        dependant?: undefined | StackContainers;
    });
}
type StackLevels = Libp2pLevel | IpfsLevel | OrbitDbLevel | DatabaseLevel | GossipSubLevel | IpfsFileSystemLevel | CustomLevel;
export { Libp2pLevel, IpfsLevel, OrbitDbLevel, DatabaseLevel, GossipSubLevel, IpfsFileSystemLevel, CustomLevel, StackContainers, StackLevels };
//# sourceMappingURL=levels.d.ts.map