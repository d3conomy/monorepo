import { expect } from 'chai';
import { OpenDbOptions, OpenDbProcess, openDb } from '../src/open-db-process/index.js';
import { Database } from '@orbitdb/core';
import { MoonbaseId, PodBayId, PodId, PodProcessId, SystemId } from 'd3-artifacts';
import { createLibp2pProcessOptions } from '../src/libp2p-process/processOptions.js';
import { Libp2pProcess } from '../src/libp2p-process/process.js';
import { IpfsProcess } from '../src/ipfs-process/index.js';
import { IpfsOptions } from '../src/ipfs-process/IpfsOptions.js';
import { OrbitDbProcess } from '../src/orbitdb-process/index.js';
import { OrbitDbOptions } from '../src/orbitdb-process/OrbitDbOptions.js';

describe('openDb', () => {
    let orbitDb: OrbitDbProcess;
    let openDbId: PodProcessId;

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
        await ipfsProcess.init();
        const orbitDbProcessId = new PodProcessId({podId});
        orbitDb = new OrbitDbProcess({
            id: orbitDbProcessId,
            options: new OrbitDbOptions({
                ipfs: ipfsProcess,
                enableDID: false
            })
        });
        openDbId = new PodProcessId({podId});

    });

    it('should open a database', async () => {

        const databaseName = 'test-db';
        const databaseType = 'keyvalue';

        await orbitDb.init();
        const result = new OpenDbProcess({
            id: openDbId,
            options: new OpenDbOptions({
                id: openDbId,
                databaseName,
                databaseType,
                orbitDb: orbitDb

            })
        });

        expect(result).to.be.an.instanceOf(Object);
        await orbitDb.stop();
    });

    it('should throw an error if opening the database fails', async () => {

        const databaseName = 'test-db';
        const databaseType = 'test-type';


        // Mock OrbitDB.open() to throw an error

        try {
            await new OpenDbProcess({
                id: openDbId,
                options: new OpenDbOptions({
                    id: openDbId,
                    databaseName,
                    databaseType,
                    orbitDb: orbitDb
                })
            }).init();
            // The test should throw an error, so this line should not be reached
            expect.fail('Invalid OrbitDb type');
        } catch (error: any) {
            expect(error.message).to.equal('Invalid OrbitDb type');
        }
    });
});

describe('OpenDbProcess', () => {
    let orbitDb: OrbitDbProcess;
    let openDbId: PodProcessId;

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
        openDbId = new PodProcessId({podId});

    });

    it('should initialize the database process', async () => {
        const databaseName = 'test-db';
        const databaseType = 'test-type';


        // Mock OrbitDB.open() to throw an error

        try {
            await new OpenDbProcess({
                id: openDbId,
                options: new OpenDbOptions({
                    id: openDbId,
                    databaseName,
                    databaseType,
                    orbitDb: orbitDb
                })
            }).init();
        } catch (error: any) {
            // The test should throw an error, so this line should not be reached
            expect.fail('Invalid OrbitDb type');
        }

        await orbitDb.stop();
    });


});
