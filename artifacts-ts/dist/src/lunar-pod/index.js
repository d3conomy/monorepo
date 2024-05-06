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
// // Define the Pod class
// class Pod
// {
//     private containers: Array<Container<InstanceType>> = [];
//     private options: LunarPodOptions;
//     private readonly idReferenceFactory: IdReferenceFactory; 
//     public readonly id: PodId;
//     public readonly template?: PodTemplate;
//     constructor({
//         id,
//         idReferenceFactory,
//         template,
//         options,
//         containers
//     }: {
//         id: PodId,
//         idReferenceFactory: IdReferenceFactory,
//         template?: PodTemplate,
//         options?: InstanceOptions,
//         containers?: Array<Container<InstanceType>>
//     }) {
//         this.id = id;
//         this.idReferenceFactory = idReferenceFactory;
//         this.template = template;
//         this.options = new LunarPodOptions(options);
//         if (containers) {
//             this.containers = containers;
//         }
//     }
//     async createContainer<T = InstanceType, U = InstanceOptions>(options: U): Promise<Container<T>> {
//         this.containers.push(container);
//         return container;
//     }
//     // async createContainer<T extends InstanceType>(template: ContainerTemplate<T>, options?: InstanceOptions): Promise<Container<T>> {
//     //     const container = new Container<T>({
//     //         id: this.idReferenceFactory.createIdReference({
//     //             name: template.name,
//     //             type: template.type,
//     //             format: template.format
//     //         }),
//     //         template: template,
//     //         options: options
//     //     });
//     //     this.containers.push(container);
//     //     return container;
//     // }
// }
// // Export the Pod class
// export { Pod };
