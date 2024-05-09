import { InstanceOptions } from "../container/options.js"
import { Libp2pContainer } from "../container-libp2p/index.js"
import { IpfsContainer } from "../container-ipfs-helia/index.js"
import { OrbitDbContainer } from "../container-orbitdb/index.js"
import { DatabaseContainer } from "../container-orbitdb-open/index.js"
import { GossipSubContainer } from "../container-libp2p-pubsub/index.js"
import { IpfsFileSystemContainer } from "../container-ipfs-helia-filesystem/index.js"
import { ContainerId } from "../id-reference-factory/IdReferenceClasses.js"

import { InstanceTypes } from "../container/instance.js";


type StackContainers = Libp2pContainer | IpfsContainer | OrbitDbContainer | DatabaseContainer | GossipSubContainer | IpfsFileSystemContainer;

class StackLevel<T = StackContainers, U = StackContainers > {
    id: ContainerId;
    type: InstanceTypes;
    options?: InstanceOptions | undefined;
    dependant: U | undefined;
    container?: T;
    builder: (id: ContainerId, options: InstanceOptions, dependant?: U | undefined) => Promise<T>;

    constructor({
        id,
        type,
        options,
        builder,
        dependant,
    
    }:{
        id: ContainerId,
        type: InstanceTypes,
        options?: InstanceOptions,
        builder: (id: ContainerId, options: InstanceOptions, dependant?: U | undefined) => Promise<T>,
        dependant?: U,
    }) {
        this.id = id;
        this.type = type;
        this.options = options;
        this.dependant = dependant;
        this.builder = builder !== undefined ? builder : async (id: ContainerId, options: InstanceOptions, dependant?: U): Promise<T> => {
            throw new Error('Builder not implemented');
        }
    }

    async init(dependant?: U): Promise<void> {
        if (dependant) {
           this.dependant = dependant;
        }
        if (!this.options) {
            this.options = new InstanceOptions();
        }
        this.container = await this.builder(this.id, this.options, this.dependant);
    }

}

class Libp2pLevel extends StackLevel<Libp2pContainer, undefined> {
    constructor({id, options}: {id: ContainerId, options?: InstanceOptions}) {
        super({
            id,
            type: InstanceTypes.libp2p,
            options,
            builder: async (id: ContainerId, options?: InstanceOptions, dependant?: undefined): Promise<Libp2pContainer> => {
                const container = new Libp2pContainer(id, options);
                await container.init();
                return container;
            },
            dependant: undefined,
        });
    }
}

class IpfsLevel extends StackLevel<IpfsContainer, Libp2pContainer> {
    constructor({id, options, dependant}: {id: ContainerId, options?: InstanceOptions, dependant?: Libp2pContainer}) {
        super({
            id,
            type: InstanceTypes.ipfs,
            options,
            builder: async (id: ContainerId, options: InstanceOptions, dependant?: Libp2pContainer): Promise<IpfsContainer> => {
                options.set('libp2p', dependant);
                const container = new IpfsContainer(id, options);
                await container.init();
                return container;
            },
            dependant: dependant,
        });
    }
}

class OrbitDbLevel extends StackLevel<OrbitDbContainer, IpfsContainer> {
    constructor({id, options, dependant}: {id: ContainerId, options?: InstanceOptions, dependant?: IpfsContainer}) {
        super({
            id,
            type: InstanceTypes.orbitdb,
            options,
            builder: async (id: ContainerId, options: InstanceOptions, dependant?: IpfsContainer): Promise<OrbitDbContainer> => {
                options.set('ipfs', dependant);
                
                const container = new OrbitDbContainer(id, options);
                await container.init();
                return container;
            },
            dependant: dependant,
        });
    }
}

class DatabaseLevel extends StackLevel<DatabaseContainer, OrbitDbContainer> {
    constructor({id, options, dependant}: {id: ContainerId, options?: InstanceOptions, dependant?: OrbitDbContainer}) {
        super({
            id,
            type: InstanceTypes.database,
            options,
            builder: async (id: ContainerId, options: InstanceOptions, dependant?: OrbitDbContainer): Promise<DatabaseContainer> => {
                options.set('orbitdb', dependant);
                
                const container = new DatabaseContainer(id, options);
                await container.init();
                return container;
            },
            dependant: dependant,
        });
    }
}

class GossipSubLevel extends StackLevel<GossipSubContainer, Libp2pContainer> {
    constructor({id, options, dependant}: {id: ContainerId, options?: InstanceOptions, dependant?: Libp2pContainer}) {
        super({
            id,
            type: InstanceTypes.pubsub,
            options,
            builder: async (id: ContainerId, options: InstanceOptions, dependant?: Libp2pContainer): Promise<GossipSubContainer> => {
                options.set('libp2p', dependant);
                
                const container = new GossipSubContainer(id, options);
                await container.init();
                return container;
            },
            dependant: dependant,
        });
    }
}

class IpfsFileSystemLevel extends StackLevel<IpfsFileSystemContainer, IpfsContainer> {
    constructor({id, options, dependant}: {id: ContainerId, options?: InstanceOptions, dependant?: IpfsContainer}) {
        super({
            id,
            type: InstanceTypes.filesystem,
            options,
            builder: async (id: ContainerId, options: InstanceOptions, dependant?: IpfsContainer): Promise<IpfsFileSystemContainer> => {
                options.set('ipfs', dependant);
                
                const container = new IpfsFileSystemContainer(id, options);
                await container.init();
                return container;
            },
            dependant: dependant,
        });
    }
}

type StackLevels = Libp2pLevel | IpfsLevel | OrbitDbLevel | DatabaseLevel | GossipSubLevel | IpfsFileSystemLevel;

export {
    Libp2pLevel,
    IpfsLevel,
    OrbitDbLevel,
    DatabaseLevel,
    GossipSubLevel,
    IpfsFileSystemLevel,
    StackContainers,
    StackLevels
}