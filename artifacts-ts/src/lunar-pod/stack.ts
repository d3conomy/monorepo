import { ContainerId, PodId } from "../id-reference-factory/IdReferenceClasses.js"
import { IdReferenceTypes } from "../id-reference-factory/IdReferenceConstants.js";
import { IdReferenceFactory } from "../id-reference-factory/IdReferenceFactory.js";
import { Libp2pLevel, IpfsLevel, OrbitDbLevel, DatabaseLevel, GossipSubLevel, IpfsFileSystemLevel, CustomLevel, StackContainers } from "./levels.js";
import { LunarPodOptions } from "./options.js";

interface IStack {
    libp2p?: Libp2pLevel;
    ipfs?: IpfsLevel;
    orbitdb?: OrbitDbLevel;
    databases?: DatabaseLevel[];
    gossipsub?: GossipSubLevel;
    ipfsFileSystem?: IpfsFileSystemLevel;
    custom?: CustomLevel[];

    getContainers(): Array<StackContainers | undefined>;
}

type DatabaseStack = Pick<IStack, 'libp2p' | 'ipfs' | 'orbitdb' | 'databases' | 'getContainers'>;
type GossipSubStack = Pick<IStack, 'libp2p' | 'gossipsub' | 'getContainers'>;
type IpfsFileSystemStack = Pick<IStack, 'libp2p' | 'ipfs' | 'ipfsFileSystem' | 'getContainers'>;

type Stacks = DatabaseStack | GossipSubStack | IpfsFileSystemStack | IStack;
enum StackTypes {
    Database = 'database',
    GossipSub = 'gossipsub',
    IpfsFileSystem = 'ipfs-filesystem',
    Custom = 'custom',
}

class Stack<T = Stacks> implements IStack {
    libp2p?: Libp2pLevel;
    ipfs?: IpfsLevel;
    orbitdb?: OrbitDbLevel;
    databases?: DatabaseLevel[];
    gossipsub?: GossipSubLevel;
    ipfsFileSystem?: IpfsFileSystemLevel;
    custom?: CustomLevel[];

    constructor({
        libp2p,
        ipfs,
        orbitdb,
        databases,
        gossipsub,
        ipfsFileSystem,
        custom
    }: {
        libp2p?: Libp2pLevel,
        ipfs?: IpfsLevel,
        orbitdb?: OrbitDbLevel,
        databases?: DatabaseLevel[],
        gossipsub?: GossipSubLevel,
        ipfsFileSystem?: IpfsFileSystemLevel,
        custom?: CustomLevel[]
    }) {
        this.libp2p = libp2p;
        this.ipfs = ipfs;
        this.orbitdb = orbitdb;
        this.databases = databases;
        this.gossipsub = gossipsub;
        this.ipfsFileSystem = ipfsFileSystem;
        this.custom = custom;                                                                                        
    }

    public getContainers(): Array<StackContainers | undefined> {
        let containers: Array<StackContainers | undefined> = [];
        if (this.libp2p) { containers.push(this.libp2p.container)};
        if (this.ipfs) { containers.push(this.ipfs.container)};
        if (this.orbitdb) { containers.push(this.orbitdb.container)};
        if (this.databases) { this.databases.forEach(database => containers.push(database.container))};
        if (this.gossipsub) { containers.push(this.gossipsub.container)};
        if (this.ipfsFileSystem) { containers.push(this.ipfsFileSystem.container)};
        if (this.custom) { this.custom.forEach(custom => containers.push(custom.container))};

        containers.forEach(container => {
            if (container === undefined) {
                containers = containers.filter(c => c !== undefined);
            }
        });

        return containers;
    
    }
}


class StackFactory{
    // static async createLevel<
    //     T extends keyof Stack,
    //     U extends keyof Stack,
    //     V = Pick<Stack, T>,
    //     W = Pick<Stack, U>
    // >(type: T, containerId: ContainerId, options?: LunarPodOptions, dependant: W | undefined = undefined ): Promise<U> {
    //     let level: V;
    //     switch (type) {
    //         case 'libp2p':
    //             level = new Libp2pLevel({id: containerId, options}) as V;;
    //         case 'ipfs':
    //             level = new IpfsLevel({id: containerId, options, dependant: dependant.container}); await level.init(); return level as U;
    //         case 'orbitdb':
    //             level = new OrbitDbLevel({id: containerId, options, dependant: dependant.container}); await level.init(); return level as U;
    //         case 'database':
    //             level = new DatabaseLevel({id: containerId, options, dependant: dependant.container}); await level.init(); return level as U;
    //         case 'gossipsub':
    //             level = new GossipSubLevel({id: containerId, options, dependant: dependant.container}); await level.init(); return level as U;
    //         case 'ipfsFileSystem':
    //             level = new IpfsFileSystemLevel({id: containerId, options, dependant: dependant.container}); await level.init(); return level as U;
    //     }
    //     await level
    // }

    static async createStack<T = Stacks>(type: StackTypes, podId: PodId, idReferenceFactory: IdReferenceFactory, options?: LunarPodOptions): Promise<T> {
        const containerId = () => { return idReferenceFactory.createIdReference({type: IdReferenceTypes.CONTAINER, dependsOn: podId}) as ContainerId};

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
                return new Stack<T>({libp2p: libp2pLevel, ipfs: ipfsLevel, orbitdb: orbitDbLevel, databases: [databaseLevel]}) as T;

            case StackTypes.GossipSub:
                const libp2pLevel2 = await libp2p();
                const gossipSubLevel = await gossipsub(libp2pLevel2);
                return new Stack<T>({libp2p: libp2pLevel2, gossipsub: gossipSubLevel}) as T;

            case StackTypes.IpfsFileSystem:
                const libp2pLevel3 = await libp2p();
                const ipfsLevel2 = await ipfs(libp2pLevel3);
                const ipfsFileSystemLevel = await ipfsFileSystem(ipfsLevel2);
                return new Stack<T>({libp2p: libp2pLevel3, ipfs: ipfsLevel2, ipfsFileSystem: ipfsFileSystemLevel}) as T;

            case StackTypes.Custom:
                throw new Error ('Custom stack not implemented yet');

            default:
                throw new Error('Invalid stack type');
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
