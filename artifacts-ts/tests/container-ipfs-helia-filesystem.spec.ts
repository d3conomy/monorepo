import { expect } from "chai";
import { IpfsContainer } from "../src/container-ipfs-helia/index.js";
import { createId } from "./helpers.js";
import { ContainerId, JobId } from "../src/id-reference-factory/index.js";
import { InstanceOptions, createOptionsList } from "../src/container/options.js";
import { Libp2pContainer } from "../src/container-libp2p/index.js";
import { CommandArg } from "../src/container/commands.js";
import { IpfsFileSystemContainer } from "../src/container-ipfs-helia-filesystem/index.js";

describe("IpfsFileSystemContainer", () => {
    const containerId = createId("container") as ContainerId;
    const containerId2 = createId("container") as ContainerId;
    const containerId3 = createId("container") as ContainerId;

    it("should create an instance of IpfsContainer", () => {
        const libp2pContainer = new Libp2pContainer(containerId);

        const heliaOptions: InstanceOptions = new InstanceOptions({ options: [
            {
                name: "libp2p",
                value: libp2pContainer,
            }
        ]})
    
        const container = new IpfsContainer(containerId2, heliaOptions);
        expect(container).to.be.an.instanceOf(IpfsContainer);
    });

    it('should create a container and run a command', async () => {
        const libp2pContainer = new Libp2pContainer(containerId);

        const heliaOptions: InstanceOptions = new InstanceOptions({ options: [
            {
                name: "libp2p",
                value: libp2pContainer,
            }
        ]})
    
        const container = new IpfsContainer(containerId2, heliaOptions);
        await container.init();

        // container.jobs.enqueue({
        //     id: createId('job') as JobId,
        //     command: container.commands.get('start')
        // });

        container.jobs.enqueue({
            id: createId('job') as JobId,
            command: container.commands.get('addJson'),
            params: [{
                name: 'data',
                value: { hello: 'world' }
            } as CommandArg<any>]
        });

        container.jobs.enqueue({
            id: createId('job') as JobId,
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
        ]});

        const fsContainer = new IpfsFileSystemContainer(containerId3, fsOptions);
        await fsContainer.init();

        fsContainer.jobs.enqueue({
            id: createId('job') as JobId,
            command: fsContainer.commands.get('makeDirectory'),
            params: [{
                name: 'path',
                value: '/test'
            } as CommandArg<string>]
        });

        fsContainer.jobs.enqueue({
            id: createId('job') as JobId,
            command: fsContainer.commands.get('addFile'),
            params: [{
                name: 'path',
                value: '/test/file.txt'
            } as CommandArg<string>, {
                name: 'data',
                value: 'hello world'
            } as CommandArg<string>]
        });

        fsContainer.jobs.enqueue({
            id: createId('job') as JobId,
            command: fsContainer.commands.get('getBytes'),
            params: [{
                name: 'path',
                value: '/test/file.txt'
            } as CommandArg<string>]
        });

        await fsContainer.jobs.run();

        expect(container.jobs.completed.length).to.equal(2);
        expect(fsContainer.jobs.completed.length).to.equal(3);

    });
});