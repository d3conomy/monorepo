"use strict";
// import { IpfsOptions } from "../container-ipfs-helia/options.js"
// import { IpfsFileSystemOptions } from "../container-ipfs-helia-filesystem/options.js"
// import { GossipSubOptions } from "../container-libp2p-pubsub/options.js"
// import { OpenDbOptions } from "../container-orbitdb-open/options.js"
// import { OrbitDbOptions } from "../container-orbitdb/options.js"
// import { InstanceOption, InstanceOptions } from "../container/options.js"
// import { Libp2pContainer } from "../container-libp2p/index.js"
// import { IpfsContainer } from "../container-ipfs-helia/index.js"
// import { OrbitDbContainer } from "../container-orbitdb/index.js"
// import { DatabaseContainer } from "../container-orbitdb-open/index.js"
// import { GossipSubContainer } from "../container-libp2p-pubsub/index.js"
// import { IpfsFileSystemContainer } from "../container-ipfs-helia-filesystem/index.js"
// import { Container } from "../container/index.js"
// import { IdReferenceFactory } from "../id-reference-factory/IdReferenceFactory.js"
// import { ContainerId } from "../id-reference-factory/IdReferenceClasses.js"
// import { InstanceType, InstanceTypes } from "../container/instance.js";
// type ContainerType = Libp2pContainer | IpfsContainer | OrbitDbContainer | DatabaseContainer | GossipSubContainer | IpfsFileSystemContainer | Container<InstanceType>;
// type ContainerOptions = IpfsOptions | IpfsFileSystemOptions | GossipSubOptions | OpenDbOptions | OrbitDbOptions | InstanceOptions;
// interface StackContainers {
//     libp2p: {
//         type: InstanceTypes.Libp2p,
//         container: Libp2pContainer,
//         options: InstanceOptions
//     },
//     ipfs: {
//         type: InstanceTypes.IPFS,
//         container: IpfsContainer,
//         options: InstanceOptions
//     },
//     orbitdb: {
//         type: InstanceTypes.OrbitDb,
//         container: OrbitDbContainer,
//         options: InstanceOptions
//     },
//     databases: [{
//         type: InstanceTypes.Database,
//         container: DatabaseContainer,
//         options: InstanceOptions
//     }],
//     pubsub: {
//         type: InstanceTypes.Pub_Sub,
//         container: GossipSubContainer,
//         options: InstanceOptions
//     },
//     filesystem: {
//         type: InstanceTypes.File_System,
//         container: IpfsFileSystemContainer,
//         options: InstanceOptions
//     },
//     customs: [{
//         type: InstanceTypes.Custom,
//         container: Container<InstanceTypes.Custom>,
//         options: InstanceOptions
//     }]
// }
// type DatabaseStack = Pick<StackContainers, 'libp2p' | 'ipfs' | 'orbitdb' | 'databases'>;
// type GossipSubStack = Pick<StackContainers, 'libp2p' | 'pubsub'>;
// type FileSystemStack = Pick<StackContainers, 'libp2p' | 'ipfs' | 'filesystem'>;
// type StackType = DatabaseStack | GossipSubStack | FileSystemStack;
// class Stack<T extends StackType> {
//     private readonly stackType: keyof T;
//     private containers?: T;
//     private readonly options: Partial<StackContainers>;
//     constructor({
//         stackType,
//         options
//     }: {
//         stackType: keyof T,
//         options: Partial<StackContainers>
//     }) {
//         this.stackType = stackType;
//         this.options = options;
//     }
//     checkForDependencies(type: InstanceTypes) {
//         const container = Object.values(this.options).find((container) => container.type === type);
//     }
//     async createContainer(id: ContainerId, type: InstanceTypes, dependant?: ContainerType): Promise<ContainerType> {
//         let container: ContainerType;
//         switch (type) {
//             case InstanceTypes.Libp2p:
//                 container = new Libp2pContainer(
//                     id,
//                     this.options.Libp2p?.options
//                 );
//                 break;
//             case InstanceTypes.IPFS:
//                 if (!dependant) {
//                     throw new Error(`Dependant container required for IPFS container`);
//                 }
//                 options = this.options.Ipfs?.options;
//                 if (!options || !options.get('libp2p')) {
//                     new IpfsOptions(
//                         new InstanceOptions({
//                             options: [
//                                 {
//                                     name: 'libp2p',
//                                     description: 'Libp2p container',
//                                     required: true
//                                 } as InstanceOption<Libp2pContainer>
//                             ]
//                         })
//                     )
//                 }
//                 options?.set('libp2p', dependant.getInstance());
//                 container = new IpfsContainer(
//                     id,
//                     options
//                 );
//                 break;
//             case InstanceTypes.OrbitDb:
//                 if (!dependant) {
//                     throw new Error(`Dependant container required for OrbitDb container`);
//                 }
//                 options = this.options.OrbitDb?.options;
//                 if (!options || !options.get('ipfs')) {
//                     new OrbitDbOptions(
//                         new InstanceOptions({
//                             options: [
//                                 {
//                                     name: 'ipfs',
//                                     description: 'IPFS container',
//                                     required: true
//                                 } as InstanceOption<IpfsContainer>
//                             ]
//                         })
//                     )
//                 }
//                 options.set('ipfs', dependant.getInstance());
//                 container = new OrbitDbContainer(
//                     id,
//                     options
//                 );
//                 break;
//             case InstanceTypes.Database:
//                 if (!dependant) {
//                     throw new Error(`Dependant container required for Database container`);
//                 }
//                 options = this.options.Databases[0]?.options;
//                 if (!options || !options.get('orbitdb')) {
//                     new OpenDbOptions(
//                         new InstanceOptions({
//                             options: [
//                                 {
//                                     name: 'orbitdb',
//                                     description: 'OrbitDb container',
//                                     required: true
//                                 } as InstanceOption<OrbitDbContainer>
//                             ]
//                         })
//                     )
//                 }
//                 options.set('orbitdb', dependant.getInstance());
//                 container = new DatabaseContainer(
//                     id,
//                     options
//                 );
//                 break;
//             default:
//                 throw new Error(`Invalid instance type: ${type}`);
//         }
// }
// // export {
// //     // Stack,
// //     StackType,
// //     StackOptions
// // }
