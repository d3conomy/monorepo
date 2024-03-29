import { expect } from 'chai';
import { OrbitDbProcess } from '../src/orbitdb-process/index.js';
import { OrbitDbTypes, isOrbitDbType, OpenDbOptions } from '../src/open-db-process/OpenDbOptions.js';
import { Libp2pProcess } from './libp2p-process/process.js';
import { MoonbaseId, PodBayId, PodId, PodProcessId, SystemId } from 'd3-artifacts';
import { createLibp2pProcessOptions } from './libp2p-process/processOptions.js';
import { IpfsOptions } from './ipfs-process/IpfsOptions.js';
import { IpfsProcess } from './ipfs-process/index.js';
import { OrbitDbOptions } from './orbitdb-process/OrbitDbOptions.js';

describe('OpenDbOptions', () => {
    let orbitDb: OrbitDbProcess;

    beforeEach( async () => {
        const systemId = new SystemId()
        const moonbaseId = new MoonbaseId({systemId})
        const podBayId = new PodBayId({moonbaseId})
        const podId = new PodId({podBayId})
        const libp2pId = new PodProcessId({podId});
        const options = await createLibp2pProcessOptions();
        const libp2pProcess = new Libp2pProcess({id: libp2pId, options});
        await libp2pProcess.init();
        const ipfsId = new PodProcessId({podId});
        const ipfsProcess = new IpfsProcess({
            id: ipfsId,
            options: new IpfsOptions({
                libp2p: libp2pProcess,
                start: false
            })
        });
        const orbitDbProcessId = new PodProcessId({podId});
        orbitDb = new OrbitDbProcess({
            id: orbitDbProcessId,
            options: new OrbitDbOptions({
                ipfs: ipfsProcess,
                enableDID: false
            })

        });
    });

    it('should create an instance of OpenDbOptions with default values', () => {
        const openDbOptions = new OpenDbOptions({
            orbitDb,
            databaseName: 'myDatabase'
        });

        expect(openDbOptions.orbitDb).to.equal(orbitDb);
        expect(openDbOptions.databaseName).to.equal('myDatabase');
        expect(openDbOptions.databaseType).to.equal(OrbitDbTypes.EVENTS);
        expect(openDbOptions.options).to.be.an.instanceOf(Map);
        expect(openDbOptions.options?.size).to.equal(0);
    });

    it('should create an instance of OpenDbOptions with provided values', () => {
        const options = new Map<string, string>();
        options.set('option1', 'value1');
        options.set('option2', 'value2');

        const openDbOptions = new OpenDbOptions({
            orbitDb,
            databaseName: 'myDatabase',
            databaseType: OrbitDbTypes.KEYVALUE,
            options
        });

        expect(openDbOptions.orbitDb).to.equal(orbitDb);
        expect(openDbOptions.databaseName).to.equal('myDatabase');
        expect(openDbOptions.databaseType).to.equal(OrbitDbTypes.KEYVALUE);
        expect(openDbOptions.options).to.equal(options);
    });

    it('should throw an error for invalid OrbitDb type', () => {
        expect(() => {
            new OpenDbOptions({
                orbitDb,
                databaseName: 'myDatabase',
                databaseType: 'invalidType'
            });
        }).to.throw('Invalid OrbitDb type');
    });
});
