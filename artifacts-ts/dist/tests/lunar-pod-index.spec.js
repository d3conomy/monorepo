"use strict";
// import { expect } from 'chai';
// import { describe, it } from 'mocha';
// import { Pod } from '../src/lunar-pod/index.js';
// import { IdReferenceFactory } from '../src//id-reference-factory/index.js';
// import { LunarPodOptions } from '../src/lunar-pod/options.js';
// import { OpenDbOptions } from '../src/container-orbitdb-open/options.js';
// import { InstanceOption, InstanceOptions } from '../src/container/options.js';
// describe('Pod', () => {
//     describe('constructor', () => {
//         it('should create a Pod instance with the specified id, idReferenceFactory, and options', () => {
//             // Arrange
//             const idReferenceFactory = new IdReferenceFactory();
//             const systemId = idReferenceFactory.createIdReference({ type: 'system' });
//             const moonbaseId = idReferenceFactory.createIdReference({ type: 'moonbase', dependsOn: systemId });
//             const podBayId = idReferenceFactory.createIdReference({ type: 'pod-bay', dependsOn: moonbaseId });
//             const podid = idReferenceFactory.createIdReference({ type: 'pod', dependsOn: podBayId });
//             const options = new LunarPodOptions();
//             // Act
//             const pod = new Pod(podid, idReferenceFactory, options);
//             // Assert
//             expect(pod.id).to.equal(podid);
//             // expect(pod.idReferenceFactory).to.equal(idReferenceFactory);
//             // expect(pod.options).to.equal(options);
//         });
//     });
//     describe('init', async () => {
//         it('should initialize the containers', async () => {
//              // Arrange
//              const idReferenceFactory = new IdReferenceFactory();
//              const systemId = idReferenceFactory.createIdReference({ type: 'system' });
//             const moonbaseId = idReferenceFactory.createIdReference({ type: 'moonbase', dependsOn: systemId });
//             const podBayId = idReferenceFactory.createIdReference({ type: 'pod-bay', dependsOn: moonbaseId });
//             const id = idReferenceFactory.createIdReference({ type: 'pod', dependsOn: podBayId });
//              const dbOptions = new OpenDbOptions(new InstanceOptions({
//                     options: [
//                         {
//                             name: "databaseName",
//                             value: "test",
//                         } as InstanceOption<string>,
//                     ]
//              }));
//              const dbOptions2 = new OpenDbOptions(new InstanceOptions({
//                     options: [
//                         {
//                             name: "databaseName",
//                             value: "test2",
//                         } as InstanceOption<string>,
//                     ]
//              }));
//              const options = new LunarPodOptions(new InstanceOptions({ options: [
//                     {
//                         name: 'openDbOptions',
//                         value: [dbOptions, dbOptions2]
//                     } as InstanceOption<OpenDbOptions[]>
//                 ]})
//              );
//              const pod = new Pod(id, idReferenceFactory, options);
//             // Act
//             await pod.init();
//             // Assert
//             // Add your assertions here
//         });
//     });
// });
