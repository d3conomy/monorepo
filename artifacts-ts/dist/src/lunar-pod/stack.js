import { IdReferenceTypes } from "../id-reference-factory/IdReferenceConstants.js";
import { Libp2pLevel, IpfsLevel, OrbitDbLevel, DatabaseLevel, GossipSubLevel, IpfsFileSystemLevel } from "./levels.js";
var StackTypes;
(function (StackTypes) {
    StackTypes["Database"] = "database";
    StackTypes["GossipSub"] = "gossipsub";
    StackTypes["IpfsFileSystem"] = "ipfs-filesystem";
})(StackTypes || (StackTypes = {}));
class StackFactory {
    databases = [];
    static async createStack(type, podId, idReferenceFactory, options) {
        const containerId = () => { return idReferenceFactory.createIdReference({ type: IdReferenceTypes.CONTAINER, dependsOn: podId }); };
        console.log(containerId());
        const libp2p = async () => { const level = new Libp2pLevel({ id: containerId(), options }); await level.init(); return level; };
        const ipfs = async (d) => { const level = new IpfsLevel({ id: containerId(), options, dependant: d.container }); await level.init(); return level; };
        const orbitdb = async (d) => { const level = new OrbitDbLevel({ id: containerId(), options, dependant: d.container }); await level.init(); return level; };
        const database = async (d) => { const level = new DatabaseLevel({ id: containerId(), options, dependant: d.container }); await level.init(); return level; };
        const gossipsub = async (d) => { const level = new GossipSubLevel({ id: containerId(), options, dependant: d.container }); await level.init(); return level; };
        const ipfsFileSystem = async (d) => { const level = new IpfsFileSystemLevel({ id: containerId(), options, dependant: d.container }); await level.init(); return level; };
        switch (type) {
            case StackTypes.Database:
                const libp2pLevel = await libp2p();
                const ipfsLevel = await ipfs(libp2pLevel);
                const orbitDbLevel = await orbitdb(ipfsLevel);
                const databaseLevel = await database(orbitDbLevel);
                return { libp2p: libp2pLevel, ipfs: ipfsLevel, orbitdb: orbitDbLevel, databases: [databaseLevel] };
            case StackTypes.GossipSub:
                const libp2pLevel2 = await libp2p();
                const gossipSubLevel = await gossipsub(libp2pLevel2);
                return { libp2p: libp2pLevel2, gossipsub: gossipSubLevel };
            case StackTypes.IpfsFileSystem:
                const libp2pLevel3 = await libp2p();
                const ipfsLevel2 = await ipfs(libp2pLevel3);
                const ipfsFileSystemLevel = await ipfsFileSystem(ipfsLevel2);
                return { libp2p: libp2pLevel3, ipfs: ipfsLevel2, ipfsFileSystem: ipfsFileSystemLevel };
        }
    }
}
export { StackTypes, StackFactory };
