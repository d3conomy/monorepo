import { Libp2pContainer } from "../container-libp2p/index.js";
import { IpfsContainer } from "../container-ipfs-helia/index.js";
import { OrbitDbContainer } from "../container-orbitdb/index.js";
import { DatabaseContainer } from "../container-orbitdb-open/index.js";
import { GossipSubContainer } from "../container-libp2p-pubsub/index.js";
import { IpfsFileSystemContainer } from "../container-ipfs-helia-filesystem/index.js";
import { InstanceTypes } from "../container/instance.js";
class Libp2pLevel {
    id;
    type = InstanceTypes.Libp2p;
    container;
    options;
    builder = async (id, options, dependant) => {
        const container = new Libp2pContainer(id, options);
        await container.init();
        return container;
    };
    constructor(id, options) {
        this.id = id;
        this.options = options;
    }
    async init() {
        this.container = await this.builder(this.id, this.options, undefined);
    }
}
class IpfsLevel {
    id;
    type = InstanceTypes.IPFS;
    container;
    options;
    builder = async (id, options, dependant) => {
        options.set('libp2p', dependant);
        const container = new IpfsContainer(id, options);
        await container.init();
        return container;
    };
    constructor(id, options) {
        this.id = id;
        this.options = options;
    }
    async init(dependant) {
        if (dependant) {
            this.container = await this.builder(this.id, this.options, dependant);
        }
        else {
            throw new Error('Dependant is not defined');
        }
    }
}
class OrbitDbLevel {
    id;
    type = InstanceTypes.OrbitDb;
    container;
    options;
    builder = async (id, options, dependant) => {
        options.set('ipfs', dependant);
        const container = new OrbitDbContainer(id, options);
        await container.init();
        return container;
    };
    constructor(id, options) {
        this.id = id;
        this.options = options;
    }
    async init(dependant) {
        if (dependant) {
            this.container = await this.builder(this.id, this.options, dependant);
        }
    }
}
class DatabaseLevel {
    id;
    type = InstanceTypes.Database;
    container = [];
    options;
    builder = async (id, options, dependant) => {
        console.log('DatabaseLevel builder', id, options, dependant);
        options.set('databaseName', id.name);
        options.set('orbitdb', dependant);
        console.log('DatabaseLevel builder options', options);
        const container = new DatabaseContainer(id, options);
        await container.init();
        return container;
    };
    constructor(id, options) {
        this.id = id;
        this.options = options;
    }
    async init(dependant) {
        if (dependant) {
            for (let i = 0; i < this.id.length; i++) {
                const container = await this.builder(this.id[i], this.options[i], dependant);
                this.container.push(container);
            }
        }
    }
    getContainers() {
        return this.container;
    }
}
class GossipSubLevel {
    id;
    type = InstanceTypes.Pub_Sub;
    container;
    options;
    builder = async (id, options, dependant) => {
        options.set('libp2p', dependant);
        const container = new GossipSubContainer(id, options);
        await container.init();
        return container;
    };
    constructor(id, options) {
        this.id = id;
        this.options = options;
    }
    async init(dependant) {
        if (dependant) {
            this.container = await this.builder(this.id, this.options, dependant);
        }
    }
}
class IpfsFileSystemLevel {
    id;
    type = InstanceTypes.File_System;
    container;
    options;
    builder = async (id, options, dependant) => {
        options.set('ipfs', dependant);
        const container = new IpfsFileSystemContainer(id, options);
        await container.init();
        return container;
    };
    constructor(id, options) {
        this.id = id;
        this.options = options;
    }
    async init(dependant) {
        if (dependant) {
            this.container = await this.builder(this.id, this.options, dependant);
        }
    }
}
export { Libp2pLevel, IpfsLevel, OrbitDbLevel, DatabaseLevel, GossipSubLevel, IpfsFileSystemLevel };
