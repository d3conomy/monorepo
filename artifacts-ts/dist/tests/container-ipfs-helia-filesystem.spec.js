import { expect } from "chai";
import { IpfsContainer } from "../src/container-ipfs-helia/index.js";
import { createId } from "./helpers.js";
import { InstanceOptions } from "../src/container/options.js";
import { Libp2pContainer } from "../src/container-libp2p/index.js";
import { IpfsFileSystemContainer } from "../src/container-ipfs-helia-filesystem/index.js";
describe("IpfsFileSystemContainer", () => {
    const containerId = createId("container");
    const containerId2 = createId("container");
    const containerId3 = createId("container");
    it("should create an instance of IpfsContainer", () => {
        const libp2pContainer = new Libp2pContainer(containerId);
        const heliaOptions = new InstanceOptions({ options: [
                {
                    name: "libp2p",
                    value: libp2pContainer,
                }
            ] });
        const container = new IpfsContainer(containerId2, heliaOptions);
        expect(container).to.be.an.instanceOf(IpfsContainer);
    });
    it('should create a container and run a command', async () => {
        const libp2pContainer = new Libp2pContainer(containerId);
        const heliaOptions = new InstanceOptions({ options: [
                {
                    name: "libp2p",
                    value: libp2pContainer,
                }
            ] });
        const container = new IpfsContainer(containerId2, heliaOptions);
        await container.init();
        // container.jobs.enqueue({
        //     id: createId('job') as JobId,
        //     command: container.commands.get('start')
        // });
        container.jobs.enqueue({
            id: createId('job'),
            command: container.commands.get('addJson'),
            params: [{
                    name: 'data',
                    value: { hello: 'world' }
                }]
        });
        container.jobs.enqueue({
            id: createId('job'),
            command: container.commands.get('stop')
        });
        await container.jobs.run();
        const fsOptions = new InstanceOptions({ options: [
                {
                    name: "type",
                    value: "unixfs"
                },
                {
                    name: "ipfs",
                    value: container
                }
            ] });
        const fsContainer = new IpfsFileSystemContainer(containerId3, fsOptions);
        await fsContainer.init();
        fsContainer.jobs.enqueue({
            id: createId('job'),
            command: fsContainer.commands.get('makeDirectory'),
            params: [{
                    name: 'path',
                    value: '/test'
                }]
        });
        fsContainer.jobs.enqueue({
            id: createId('job'),
            command: fsContainer.commands.get('addFile'),
            params: [{
                    name: 'path',
                    value: '/test/file.txt'
                }, {
                    name: 'data',
                    value: 'hello world'
                }]
        });
        fsContainer.jobs.enqueue({
            id: createId('job'),
            command: fsContainer.commands.get('listDirectory'),
            params: [{
                    name: 'path',
                    value: '/test/file.txt'
                }]
        });
        await fsContainer.jobs.run();
        expect(container.jobs.completed.length).to.equal(3);
        expect(fsContainer.jobs.completed.length).to.equal(3);
    });
});
