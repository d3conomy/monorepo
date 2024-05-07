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

interface StackLevel<T = StackContainers, U = StackContainers > {
    id: ContainerId | ContainerId[];
    type: InstanceTypes;
    options: InstanceOptions | InstanceOptions[];
    container?: T | T[];
    builder: (id: ContainerId, options: InstanceOptions, dependant: U ) => Promise<T>;
    
    init(dependant: U | undefined): Promise<void>;
}

class Libp2pLevel implements StackLevel<Libp2pContainer, undefined> {
    id: ContainerId;
    type = InstanceTypes.Libp2p;
    container?: Libp2pContainer;
    options: InstanceOptions;
    builder = async (id: ContainerId, options: InstanceOptions, dependant: undefined): Promise<Libp2pContainer> => {
        const container = new Libp2pContainer(id, options);
        await container.init();
        return container;
    };

    constructor(id: ContainerId, options: InstanceOptions) {
        this.id = id;
        this.options = options;
    }

    async init(): Promise<void> {
        this.container = await this.builder(this.id, this.options, undefined);
    }
}

class IpfsLevel implements StackLevel<IpfsContainer, Libp2pContainer> {
    id: ContainerId;
    type = InstanceTypes.IPFS;
    container?: IpfsContainer;
    options: InstanceOptions;
    builder = async (id: ContainerId, options: InstanceOptions, dependant: Libp2pContainer): Promise<IpfsContainer> => {
        options.set('libp2p', dependant);
        const container = new IpfsContainer(id, options);
        await container.init();
        return container;
    };

    constructor(id: ContainerId, options: InstanceOptions) {
        this.id = id;
        this.options = options;
    }

    async init(dependant?: Libp2pContainer): Promise<void> {
        if (dependant) {
            this.container = await this.builder(this.id, this.options, dependant);
        }
        else {
            throw new Error('Dependant is not defined');
        }
    }
}

class OrbitDbLevel implements StackLevel<OrbitDbContainer, IpfsContainer> {
    id: ContainerId;
    type = InstanceTypes.OrbitDb;
    container?: OrbitDbContainer;
    options: InstanceOptions;
    builder = async (id: ContainerId, options: InstanceOptions, dependant: IpfsContainer): Promise<OrbitDbContainer> => {
        options.set('ipfs', dependant);
        const container = new OrbitDbContainer(id, options);
        await container.init();
        return container;
    };

    constructor(id: ContainerId, options: InstanceOptions) {
        this.id = id;
        this.options = options;
    }

    async init(dependant?: IpfsContainer): Promise<void> {
        if (dependant) {
            this.container = await this.builder(this.id, this.options, dependant);
        }
    }
}

class DatabaseLevel implements StackLevel<DatabaseContainer, OrbitDbContainer> {
    id: ContainerId[];
    type = InstanceTypes.Database;
    container: DatabaseContainer[] = [];
    options: InstanceOptions[];
    builder = async (id: ContainerId, options: InstanceOptions, dependant: OrbitDbContainer): Promise<DatabaseContainer> => {
        console.log('DatabaseLevel builder', id, options, dependant)
        options.set('databaseName', id.name)
        options.set('orbitdb', dependant);
        
        console.log('DatabaseLevel builder options', options)
        const container = new DatabaseContainer(id, options);
        await container.init();
        return container;
    };

    constructor(id: ContainerId[], options: InstanceOptions[]) {
        this.id = id;
        this.options = options;
    }

    async init(dependant?: OrbitDbContainer): Promise<void> {
        if (dependant) {
            for (let i = 0; i < this.id.length; i++) {
                const container = await this.builder(this.id[i], this.options[i], dependant);
                this.container.push(container);
            }
        }
    }

    getContainers(): DatabaseContainer[] {
        return this.container;
    }
}

class GossipSubLevel implements StackLevel<GossipSubContainer, Libp2pContainer> {
    id: ContainerId;
    type = InstanceTypes.Pub_Sub;
    container?: GossipSubContainer;
    options: InstanceOptions;
    builder = async (id: ContainerId, options: InstanceOptions, dependant: Libp2pContainer): Promise<GossipSubContainer> => {
        options.set('libp2p', dependant);
        const container = new GossipSubContainer(id, options);
        await container.init();
        return container;
    };

    constructor(id: ContainerId, options: InstanceOptions) {
        this.id = id;
        this.options = options;
    }

    async init(dependant?: Libp2pContainer): Promise<void> {
        if (dependant) {
            this.container = await this.builder(this.id, this.options, dependant);
        }
    }
}

class IpfsFileSystemLevel implements StackLevel<IpfsFileSystemContainer, IpfsContainer> {
    id: ContainerId;
    type = InstanceTypes.File_System;
    container?: IpfsFileSystemContainer;
    options: InstanceOptions;
    builder = async (id: ContainerId, options: InstanceOptions, dependant: IpfsContainer): Promise<IpfsFileSystemContainer> => {
        options.set('ipfs', dependant);
        const container = new IpfsFileSystemContainer(id, options);
        await container.init();
        return container;
    };

    constructor(id: ContainerId, options: InstanceOptions) {
        this.id = id;
        this.options = options;
    }

    async init(dependant?: IpfsContainer): Promise<void> {
        if (dependant) {
            this.container = await this.builder(this.id, this.options, dependant);
        }
    }
}

export {
    Libp2pLevel,
    IpfsLevel,
    OrbitDbLevel,
    DatabaseLevel,
    GossipSubLevel,
    IpfsFileSystemLevel,
    StackContainers
}