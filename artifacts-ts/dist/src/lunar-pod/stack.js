import { Libp2pLevel, IpfsLevel, OrbitDbLevel, DatabaseLevel, GossipSubLevel, IpfsFileSystemLevel } from "./levels.js";
class DatabaseStack {
    options;
    libp2p;
    ipfs;
    orbitdb;
    databases;
    constructor(id, options) {
        this.options = options;
        this.libp2p = new Libp2pLevel(id[0], options.get('libp2pOptions'));
        this.ipfs = new IpfsLevel(id[1], options.get('ipfsOptions'));
        this.orbitdb = new OrbitDbLevel(id[2], options.get('orbitDbOptions'));
        this.databases = new DatabaseLevel(id.slice(3), options.get('openDbOptions'));
    }
    async init() {
        console.log('DatabaseStack init', this.libp2p, this.ipfs, this.orbitdb, this.databases);
        await this.libp2p.init();
        await this.ipfs.init(this.libp2p.container);
        await this.orbitdb.init(this.ipfs.container);
        await this.databases.init(this.orbitdb.container);
    }
    getContainers() {
        return [
            this.libp2p.container,
            this.ipfs.container,
            this.orbitdb.container,
            ...this.databases.getContainers()
        ];
    }
}
class GossipSubStack {
    options;
    libp2p;
    gossipsub;
    constructor(id, options) {
        this.options = options;
        this.libp2p = new Libp2pLevel(id[0], options.get('libp2pOptions'));
        this.gossipsub = new GossipSubLevel(id[1], options.get('gossipSubOptions'));
    }
    async init() {
        await this.libp2p.init();
        await this.gossipsub.init(this.libp2p?.container);
    }
    getContainers() {
        return [
            this.libp2p.container,
            this.gossipsub.container
        ];
    }
}
class IpfsFileSystemStack {
    options;
    libp2p;
    ipfs;
    ipfsFileSystem;
    constructor(id, options) {
        this.options = options;
        this.libp2p = new Libp2pLevel(id[0], options.get('libp2pOptions'));
        this.ipfs = new IpfsLevel(id[1], options.get('ipfsOptions'));
        this.ipfsFileSystem = new IpfsFileSystemLevel(id[2], options.get('ipfsFileSystemOptions'));
    }
    async init() {
        await this.libp2p.init();
        await this.ipfs.init(this.libp2p?.container);
        await this.ipfsFileSystem.init(this.ipfs?.container);
    }
    getContainers() {
        return [
            this.libp2p.container,
            this.ipfs.container,
            this.ipfsFileSystem.container
        ];
    }
}
var StackTypes;
(function (StackTypes) {
    StackTypes["Database"] = "database";
    StackTypes["GossipSub"] = "gossipsub";
    StackTypes["IpfsFileSystem"] = "ipfsFileSystem";
    StackTypes["Full"] = "full";
})(StackTypes || (StackTypes = {}));
export { StackTypes, DatabaseStack, GossipSubStack, IpfsFileSystemStack };
