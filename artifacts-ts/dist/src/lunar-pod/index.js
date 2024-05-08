"use strict";
// import { Libp2p } from 'libp2p';
// import { GossipSubContainer } from '../container-libp2p-pubsub/index.js';
// import { Libp2pContainer } from '../container-libp2p/index.js';
// import { Commands } from '../container/commands.js';
// import { Container } from '../container/index.js';
// import { InstanceType, InstanceTypes } from '../container/instance.js';
// import { InstanceOptions } from '../container/options.js';
// import { ContainerId, PodId } from '../id-reference-factory/IdReferenceClasses.js';
// import { ContainerTemplate, PodTemplate } from '../manifest/templatesV1.js';
// import { LunarPodOptions, lunarPodOptions } from './options.js';
// // import { Stack, StackType } from './stack.js';
// import { IdReferenceFactory } from '../id-reference-factory/IdReferenceFactory.js';
// import { DatabaseStack, GossipSubStack, IpfsFileSystemStack, StackType, StackTypes } from './stack.js';
// import { OpenDbOptions } from '../container-orbitdb-open/options.js';
// import { IpfsContainer } from '../container-ipfs-helia/index.js';
// import { OrbitDbContainer } from '../container-orbitdb/index.js';
// import { DatabaseContainer } from '../container-orbitdb-open/index.js';
// import { Job, JobQueue } from '../container/jobs.js';
// // Define the Pod class
// class Pod
//     implements Pick<Container, 'options' | 'jobs'>
// {
//     private libp2p?: Libp2pContainer;
//     private ipfs?: IpfsContainer;
//     private orbitdb?: OrbitDbContainer;
//     private databases: Array<DatabaseContainer> = [];
//     private gossipsub?: GossipSubContainer;
//     private fileSystem?: IpfsFileSystemStack;
//     private jobs: JobQueue = new JobQueue();
//     // private containers: Map<ContainerId, Container | Container[] | undefined> = new Map<ContainerId, Container | Container[] | undefined>();
//     private options: InstanceOptions;
//     private readonly idReferenceFactory: IdReferenceFactory; 
//     public readonly id: PodId;
//     // public readonly template?: PodTemplate;
//     constructor(id: PodId, idReferenceFactory: IdReferenceFactory, options: InstanceOptions)
//     {
//         this.id = id;
//         this.idReferenceFactory = idReferenceFactory;
//         this.options = new LunarPodOptions(options, true);
//     }
//     private async createContainer<T extends Container>(
//         id: ContainerId,
//         type: InstanceType,
//         options: InstanceOptions,
//         builder: (id: ContainerId, options?: InstanceOptions) => Promise<T>
//     ): Promise<T>
//     {
//         return await builder(id, options);
//     }
// }
// export { Pod };
