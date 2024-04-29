import { expect } from 'chai';
import { Database } from '@orbitdb/core';
import { IProcessCommand, IProcessCommandArgInput, IProcessOption, IProcessOptionsList, Process, ProcessType, createProcessOption } from '../src/process-interface/index.js';
import { JobId, MoonbaseId, PodBayId, PodId, PodProcessId, SystemId } from "../src/id-reference-factory/index.js";
import { openDbCommands } from '../src/process-orbitdb-open/commands.js';
import { Libp2pProcess, createLibp2pProcess } from '../src/process-libp2p/process.js';
import { IpfsProcess, createIpfsProcess } from '../src/process-ipfs-helia/process.js';
import { OrbitDbProcess, createOrbitDbProcess } from '../src/process-orbitdb/process.js';
import { OpenDbProcess, createOpenDbProcess } from '../src/process-orbitdb-open/process.js';
import { OpenDbOptions, OrbitDbTypes } from '../src/process-orbitdb-open/options.js';

const podProcessIdFn = () => { return new PodProcessId({
    podId: new PodId({ podBayId: new PodBayId({ name: 'podBay1', moonbaseId: new MoonbaseId({ name: 'moonbase1', systemId: new SystemId()}) }) })
});}

describe('Open DB Commands', () => {
    let instance: typeof Database;
    let libp2pProcess: Libp2pProcess;
    let ipfsProcess: IpfsProcess;
    let orbitDbProcess: OrbitDbProcess;
    let openDbProcess: OpenDbProcess;

    beforeEach( async() => {
        libp2pProcess = await createLibp2pProcess(podProcessIdFn());
        ipfsProcess = await createIpfsProcess(podProcessIdFn(), [createProcessOption({ name: "libp2p", value: libp2pProcess })]);
    });

    afterEach( async() => {
        await openDbProcess?.stop()
        await ipfsProcess.stop()
        await libp2pProcess.stop()
    });

    it('should open a database', async () => {
        orbitDbProcess = await createOrbitDbProcess(podProcessIdFn(), [createProcessOption({ name: "ipfs", value: ipfsProcess })]);

        const openDbOptionsList = { orbitDb: orbitDbProcess , databaseName: 'testDatabase1', databaseType: OrbitDbTypes.EVENTS, options: new Map() }

        const openDbOptions: OpenDbOptions = new OpenDbOptions(openDbOptionsList);
        console.log(`openDbOptions: ${JSON.stringify(openDbOptions.toParams())}`)

        openDbProcess = await createOpenDbProcess(podProcessIdFn(), openDbOptions);
        console.log(`openDbProcess: ${openDbProcess.container?.instance?.address()}`)

        expect (openDbProcess).to.be.an.instanceOf(OpenDbProcess);
        // expect(openDbProcess.container).to.not.be.undefined;
    });

});
