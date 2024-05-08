import { InstanceOptions } from "../container/options.js";
import { Libp2pContainer } from "../container-libp2p/index.js";
import { IpfsContainer } from "../container-ipfs-helia/index.js";
import { OrbitDbContainer } from "../container-orbitdb/index.js";
import { DatabaseContainer } from "../container-orbitdb-open/index.js";
import { GossipSubContainer } from "../container-libp2p-pubsub/index.js";
import { IpfsFileSystemContainer } from "../container-ipfs-helia-filesystem/index.js";
import { InstanceTypes } from "../container/instance.js";
class StackLevel {
    id;
    type;
    options;
    dependant;
    container;
    builder;
    constructor({ id, type, options, builder, dependant, }) {
        this.id = id;
        this.type = type;
        this.options = options;
        this.dependant = dependant;
        this.builder = builder !== undefined ? builder : async (id, options, dependant) => {
            throw new Error('Builder not implemented');
        };
    }
    async init(dependant) {
        if (dependant) {
            this.dependant = dependant;
        }
        if (!this.options) {
            this.options = new InstanceOptions();
        }
        this.container = await this.builder(this.id, this.options, this.dependant);
    }
}
class Libp2pLevel extends StackLevel {
    constructor({ id, options }) {
        super({
            id,
            type: InstanceTypes.libp2p,
            options,
            builder: async (id, options, dependant) => {
                const container = new Libp2pContainer(id, options);
                await container.init();
                return container;
            },
            dependant: undefined,
        });
    }
}
class IpfsLevel extends StackLevel {
    constructor({ id, options, dependant }) {
        super({
            id,
            type: InstanceTypes.ipfs,
            options,
            builder: async (id, options, dependant) => {
                options.set('libp2p', dependant);
                const container = new IpfsContainer(id, options);
                await container.init();
                return container;
            },
            dependant: dependant,
        });
    }
}
class OrbitDbLevel extends StackLevel {
    constructor({ id, options, dependant }) {
        super({
            id,
            type: InstanceTypes.orbitdb,
            options,
            builder: async (id, options, dependant) => {
                options.set('ipfs', dependant);
                const container = new OrbitDbContainer(id, options);
                await container.init();
                return container;
            },
            dependant: dependant,
        });
    }
}
class DatabaseLevel extends StackLevel {
    constructor({ id, options, dependant }) {
        super({
            id,
            type: InstanceTypes.database,
            options,
            builder: async (id, options, dependant) => {
                options.set('orbitdb', dependant);
                const container = new DatabaseContainer(id, options);
                await container.init();
                return container;
            },
            dependant: dependant,
        });
    }
}
class GossipSubLevel extends StackLevel {
    constructor({ id, options, dependant }) {
        super({
            id,
            type: InstanceTypes.pubsub,
            options,
            builder: async (id, options, dependant) => {
                options.set('libp2p', dependant);
                const container = new GossipSubContainer(id, options);
                await container.init();
                return container;
            },
            dependant: dependant,
        });
    }
}
class IpfsFileSystemLevel extends StackLevel {
    constructor({ id, options, dependant }) {
        super({
            id,
            type: InstanceTypes.filesystem,
            options,
            builder: async (id, options, dependant) => {
                options.set('ipfs', dependant);
                const container = new IpfsFileSystemContainer(id, options);
                await container.init();
                return container;
            },
            dependant: dependant,
        });
    }
}
export { Libp2pLevel, IpfsLevel, OrbitDbLevel, DatabaseLevel, GossipSubLevel, IpfsFileSystemLevel };
