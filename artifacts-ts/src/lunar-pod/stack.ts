import { ContainerId, PodId } from "../id-reference-factory/IdReferenceClasses.js"
import { IdReferenceTypes } from "../id-reference-factory/IdReferenceConstants.js";
import { IdReferenceFactory } from "../id-reference-factory/IdReferenceFactory.js";
import { Libp2pLevel, IpfsLevel, OrbitDbLevel, DatabaseLevel, GossipSubLevel, IpfsFileSystemLevel } from "./levels.js";
import { LunarPodOptions } from "./options.js";

interface Stack {
    libp2p: Libp2pLevel;
    ipfs: IpfsLevel;
    orbitdb: OrbitDbLevel;
    databases: DatabaseLevel[];
    gossipsub: GossipSubLevel;
    ipfsFileSystem: IpfsFileSystemLevel;
    // custom?: Container<InstanceTypes.custom>[];
}

type DatabaseStack = Pick<Stack, 'libp2p' | 'ipfs' | 'orbitdb' | 'databases'>;
type GossipSubStack = Pick<Stack, 'libp2p' | 'gossipsub'>;
type IpfsFileSystemStack = Pick<Stack, 'libp2p' | 'ipfs' | 'ipfsFileSystem'>;

type Stacks = DatabaseStack | GossipSubStack | IpfsFileSystemStack;
enum StackTypes {
    Database = 'database',
    GossipSub = 'gossipsub',
    IpfsFileSystem = 'ipfs-filesystem'
}

class StackFactory{
    databases: DatabaseLevel[] = [];

    static async createStack<T = Stacks>(type: StackTypes, podId: PodId, idReferenceFactory: IdReferenceFactory, options?: LunarPodOptions): Promise<T> {
        const containerId = () => { return idReferenceFactory.createIdReference({type: IdReferenceTypes.CONTAINER, dependsOn: podId}) as ContainerId};
        console.log(containerId())

        const libp2p = async (): Promise<Libp2pLevel> => { const level = new Libp2pLevel({id: containerId(), options}); await level.init(); return level};
        const ipfs = async (d: Libp2pLevel): Promise<IpfsLevel> => { const level = new IpfsLevel({id: containerId(), options, dependant: d.container}); await level.init(); return level};
        const orbitdb = async (d: IpfsLevel): Promise<OrbitDbLevel> => { const level = new OrbitDbLevel({id: containerId(), options, dependant: d.container}); await level.init(); return level};
        const database = async (d: OrbitDbLevel): Promise<DatabaseLevel> => {const level = new DatabaseLevel({id: containerId(), options, dependant: d.container}); await level.init(); return level};
        const gossipsub = async (d: Libp2pLevel): Promise<GossipSubLevel> => { const level = new GossipSubLevel({id: containerId(), options, dependant: d.container}); await level.init(); return level};
        const ipfsFileSystem = async (d: IpfsLevel): Promise<IpfsFileSystemLevel> => { const level = new IpfsFileSystemLevel({id: containerId(), options, dependant: d.container}); await level.init(); return level};

        switch (type) {
            case StackTypes.Database:
                const libp2pLevel = await libp2p();
                const ipfsLevel = await ipfs(libp2pLevel);
                const orbitDbLevel = await orbitdb(ipfsLevel);
                const databaseLevel = await database(orbitDbLevel);
                return {libp2p: libp2pLevel, ipfs: ipfsLevel, orbitdb: orbitDbLevel, databases: [databaseLevel]} as T;

            case StackTypes.GossipSub:
                const libp2pLevel2 = await libp2p();
                const gossipSubLevel = await gossipsub(libp2pLevel2);
                return {libp2p: libp2pLevel2, gossipsub: gossipSubLevel} as T;

            case StackTypes.IpfsFileSystem:
                const libp2pLevel3 = await libp2p();
                const ipfsLevel2 = await ipfs(libp2pLevel3);
                const ipfsFileSystemLevel = await ipfsFileSystem(ipfsLevel2);
                return {libp2p: libp2pLevel3, ipfs: ipfsLevel2, ipfsFileSystem: ipfsFileSystemLevel} as T;
        }
    }
}



export {
    Stack,
    DatabaseStack,
    GossipSubStack,
    IpfsFileSystemStack,
    Stacks,
    StackTypes,
    StackFactory
}
