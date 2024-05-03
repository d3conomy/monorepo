import { expect } from "chai";
import { IpfsContainer } from "../src/container-ipfs-helia/process.js";
import { createId } from "./helpers.js";
import { ContainerId, JobId } from "../src/id-reference-factory/index.js";
import { InstanceOptions, createOptionsList } from "../src/container/options.js";
import { Libp2pContainer } from "../src/container-libp2p/index.js";
import { CommandArg } from "./container/commands.js";

describe("IpfsContainer", () => {
    const containerId = createId("container") as ContainerId;
    const containerId2 = createId("container") as ContainerId;

    it("should create an instance of IpfsContainer", () => {
        const libp2pContainer = new Libp2pContainer(containerId);

        const heliaOptions: InstanceOptions = new InstanceOptions({ options: [
            {
                name: "libp2p",
                value: libp2pContainer.getInstance(),
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
                value: libp2pContainer.getInstance(),
            }
        ]})
    
        const container = new IpfsContainer(containerId2, heliaOptions);
        await container.init();

        container.jobs.enqueue({
            id: createId('job') as JobId,
            command: container.commands.get('start')
        });

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

        expect(container.jobs.completed.length).to.equal(3);
        await container.getInstance().stop();
    });
});
