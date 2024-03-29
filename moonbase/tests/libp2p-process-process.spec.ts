import { expect } from 'chai';
import { Libp2pProcess, createLibp2pProcess } from '../src/libp2p-process/process.js';
import { createLibp2pProcessOptions } from '../src/libp2p-process/processOptions.js';
import { MoonbaseId, PodBayId, PodId, PodProcessId, ProcessStage, SystemId } from 'd3-artifacts';

describe('createLibp2pProcess', async () => {

    let process: Libp2pProcess;

    afterEach( async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        if(process && process.status() === ProcessStage.STARTED) {
            await process.stop();
        }
    })

    it('should create a new instance of Libp2pProcess', async () => {
        const systemId = new SystemId()
        const moonbaseId = new MoonbaseId({systemId})
        const podBayId = new PodBayId({moonbaseId})
        const podId = new PodId({podBayId})
        const id = new PodProcessId({podId});
        process = new Libp2pProcess({id});
        console.log(process)
        expect(process).to.be.an.instanceOf(Libp2pProcess);
    });

    it('should init the Libp2pProcess with the provided options', async () => {
        const systemId = new SystemId()
        const moonbaseId = new MoonbaseId({systemId})
        const podBayId = new PodBayId({moonbaseId
        })
        const podId = new PodId({podBayId})
        const id = new PodProcessId({podId});
        process = new Libp2pProcess({id});
        process.init();
        expect(process.status()).to.equal('unknown');
    });

    it('should start the Libp2pProcess with the provided options', async () => {
        const systemId = new SystemId()
        const moonbaseId = new MoonbaseId({systemId})
        const podBayId = new PodBayId({moonbaseId
        })
        const podId = new PodId({podBayId})
        const id = new PodProcessId({podId});
        process = new Libp2pProcess({id});
        await process.init();
        await process.start();
        expect(process.status()).to.equal('started');
    });
});
