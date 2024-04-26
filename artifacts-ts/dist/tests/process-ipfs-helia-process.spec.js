import { expect } from "chai";
import { createIpfsProcess, IpfsProcess } from "../src/process-ipfs-helia/process.js";
import { createLibp2pProcess } from "../src/process-libp2p/process.js";
import { createProcessOption } from "../src/process-interface/index.js";
import { MoonbaseId, PodBayId, PodId, PodProcessId, SystemId } from "../src/id-reference-factory/index.js";
describe("IPFS Process", () => {
    let ipfsProcess = null;
    before(async () => {
        const podProcessIdFn = () => {
            return new PodProcessId({
                name: 'process1',
                podId: new PodId({ name: 'pod1', podBayId: new PodBayId({ name: 'podBay1', moonbaseId: new MoonbaseId({ name: 'moonbase1', systemId: new SystemId() }) }) })
            });
        };
        // create a Libp2p process
        const libp2pProcess = await createLibp2pProcess(podProcessIdFn());
        // Create an IPFS process
        ipfsProcess = await createIpfsProcess(podProcessIdFn(), [createProcessOption({ name: "libp2p", value: libp2pProcess?.container?.instance })]);
    });
    after(async () => {
        // Stop the IPFS process
        await ipfsProcess?.stop();
        ipfsProcess = null;
    });
    it("should create an IPFS process instance", async () => {
        expect(ipfsProcess).to.be.an.instanceOf(IpfsProcess);
    });
    it("should initialize the IPFS process", async () => {
        // await ipfsProcess?.init();
        expect(ipfsProcess?.container?.instance).to.be.not.undefined;
    });
    it("should stop the IPFS process", async () => {
        await ipfsProcess?.stop();
        await new Promise(resolve => setTimeout(resolve, 1000));
        expect(ipfsProcess?.container?.instance.libp2p.status).to.be.equal('stopped');
    });
});
