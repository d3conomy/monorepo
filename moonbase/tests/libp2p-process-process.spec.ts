import { expect } from 'chai';
import { Libp2pProcess, createLibp2pProcess } from '../src/libp2p-process/process.js';
import { createLibp2pProcessOptions } from '../src/libp2p-process/processOptions.js';
import { LogLevel, MoonbaseId, PodBayId, PodId, PodProcessId, ProcessStage, SystemId, logger } from 'd3-artifacts';
import { TextEncoderStream } from 'stream/web';
import { peerIdFromString } from '@libp2p/peer-id';
import { listenerCount } from 'process';
import { GossipSub } from '@chainsafe/libp2p-gossipsub';

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
        const options = await createLibp2pProcessOptions();
        process = new Libp2pProcess({id, options});
        console.log(process)
        expect(process).to.be.an.instanceOf(Libp2pProcess);
    });

    it('should init the Libp2pProcess with the provided options', async () => {
        const systemId = new SystemId()
        const moonbaseId = new MoonbaseId({systemId})
        const podBayId = new PodBayId({moonbaseId})
        const podId = new PodId({podBayId})
        const id = new PodProcessId({podId});
        const options = await createLibp2pProcessOptions();
        process = new Libp2pProcess({id, options});
        process.init();
        expect(process.status()).to.equal('initializing');
    });

    it('should start the Libp2pProcess with the provided options', async () => {
        const systemId = new SystemId()
        const moonbaseId = new MoonbaseId({systemId})
        const podBayId = new PodBayId({moonbaseId})
        const podId = new PodId({podBayId})
        const id = new PodProcessId({podId});
        const options = await createLibp2pProcessOptions();
        process = new Libp2pProcess({id, options});
        await process.init();
        await process.start();
        expect(process.status()).to.equal('started');
    });

    it('should stop the Libp2pProcess with the provided options', async () => {
        const systemId = new SystemId()
        const moonbaseId = new MoonbaseId({systemId})
        const podBayId = new PodBayId({moonbaseId})
        const podId = new PodId({podBayId})
        const id = new PodProcessId({podId});
        const options = await createLibp2pProcessOptions();
        process = new Libp2pProcess({id, options});
        await process.init();
        await process.start();
        console.log(process.process?.getProtocols())
        console.log(process.process?.peerId)
        console.log(process.process?.getMultiaddrs())
        await process.stop();
        expect(process.status()).to.equal('stopped');
    });

    it('should get the info of the Libp2pProcess with the provided options', async () => {
        const systemId = new SystemId()
        const moonbaseId = new MoonbaseId({systemId})
        const podBayId = new PodBayId({moonbaseId})
        const podId = new PodId({podBayId})
        const id = new PodProcessId({podId});
        const options = await createLibp2pProcessOptions();
        process = new Libp2pProcess({id, options});
        await process.init();
        await process.start();
        const protocols = process.process?.getProtocols()
        const peerId = process.process?.peerId
        const multiaddrs = process.process?.getMultiaddrs()
        expect(protocols).to.be.an('array');
        expect(peerId?.toString()).to.be.an('string');
        expect(multiaddrs).to.be.an('array');
        await process.stop();
    });

    it('should get the public key of an example peerid', async function () {
        this.timeout(10000);
        const systemId = new SystemId()
        const moonbaseId = new MoonbaseId({systemId})
        const podBayId = new PodBayId({moonbaseId})
        const podId = new PodId({podBayId})
        const id = new PodProcessId({podId});
        const options = await createLibp2pProcessOptions();
        process = new Libp2pProcess({id, options});
        await process.init();
        await process.start();
        const publickey = await process.getPublicKey(process.peerId());
        console.log(publickey)
        await process.stop();
    });

    it('should get the listenerCount of the Libp2pProcess with the provided options', async () => {
        const systemId = new SystemId()
        const moonbaseId = new MoonbaseId({systemId})
        const podBayId = new PodBayId({moonbaseId})
        const podId = new PodId({podBayId})
        const id = new PodProcessId({podId});
        const options = await createLibp2pProcessOptions();
        process = new Libp2pProcess({id, options});
        await process.init();
        await process.start();
        const listenerCount = process.listenerCount('peer:connect')
        console.log(listenerCount)
        await process.stop();
    });

    it('should dial a multiaddr', async () => {
        const systemId = new SystemId()
        const moonbaseId = new MoonbaseId({systemId})
        const podBayId = new PodBayId({moonbaseId})
        const podId = new PodId({podBayId})
        const id = new PodProcessId({podId});
        const options = await createLibp2pProcessOptions();
        process = new Libp2pProcess({id, options});
        await process.init();
        await process.start();
        const connection = await process.dial('/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ')
        console.log(connection)
        expect(connection?.remotePeer).to.not.be.null;
        await process.stop();
    });

    it('should dial a peerId with protocol', async () =>{
        const systemId = new SystemId()
        const moonbaseId = new MoonbaseId({systemId})
        const podBayId = new PodBayId({moonbaseId})
        const podId = new PodId({podBayId})
        const id = new PodProcessId({podId});
        const options = await createLibp2pProcessOptions();
        process = new Libp2pProcess({id, options});
        await process.init();
        await process.start();
        const connection = await process.dialProtocol('/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ', '/libp2p/circuit/relay/0.2.0/hop')
        console.log(connection)
        expect(connection?.protocol).to.not.be.null;
        await process.stop();
    })

    it('should subscribe to a pubsub topic', async () => {
        const systemId = new SystemId()
        const moonbaseId = new MoonbaseId({systemId})
        const podBayId = new PodBayId({moonbaseId})
        const podId = new PodId({podBayId})
        const id = new PodProcessId({podId});
        const options = await createLibp2pProcessOptions();
        process = new Libp2pProcess({id, options});
        await process.init();
        await process.start();
        const topic = 'moonbase';
        const handler = (msg: any) => {
            console.log(msg)
        }

        process.subscribe(topic);
    });

    it('should publish to a pubsub topic', async () => {
        const systemId = new SystemId()
        const moonbaseId = new MoonbaseId({systemId})
        const podBayId = new PodBayId({moonbaseId})
        const podId = new PodId({podBayId})
        const id = new PodProcessId({podId});
        const options = await createLibp2pProcessOptions();
        process = new Libp2pProcess({id, options});
        await process.init();
        await process.start();
        const peerId1 = process.peerId();
        const multiaddrs1 = process.getMultiaddrs();
        const topic = 'moonbase-pubsub';

        let buffer = (msg: string): Buffer => {
            return Buffer.from(msg);
        }

        const pubSub1: GossipSub = process.process?.services?.pubsub as GossipSub;

        pubSub1.addEventListener('message', (msg: any) => {
            console.log(msg.data.toString());
        })

        pubSub1.subscribe(topic);

        const systemId2 = new SystemId()
        const moonbaseId2 = new MoonbaseId({systemId: systemId2})
        const podBayId2 = new PodBayId({moonbaseId: moonbaseId2})
        const podId2 = new PodId({podBayId: podBayId2})
        const id2 = new PodProcessId({podId: podId2});
        const options2 = await createLibp2pProcessOptions();
        const process2 = new Libp2pProcess({id: id2, options: options2});

        await process2.init();
        await process2.start();
        const processPubSub: GossipSub = process2.process?.services?.pubsub as GossipSub;
        const connection = await process2.dial(multiaddrs1[0].toString());
        logger({
            level: LogLevel.INFO,
            message: JSON.stringify(connection)
        });
        const peerId2 = process2.peerId();
        const multiaddrs2 = process2.getMultiaddrs();

        processPubSub.addEventListener('message', (msg: any) => {
            console.log(msg.data);
        })
        processPubSub.subscribe(topic)

        // console.log(await process.dialProtocol(multiaddrs2[0].toString(), '/libp2p/pubsub/1.0.0'))

        // console.log(await process)
        // @ts-ignore
        const output = await process2.publish(topic, 'hello world');
        logger({
            level: LogLevel.INFO,
            message: JSON.stringify(output)
        });

        await process.stop();

        await process2.stop();
    });
});
