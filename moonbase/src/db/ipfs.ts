import { MemoryDatastore } from "datastore-core";
import { MemoryBlockstore } from "blockstore-core";
import { Helia, createHelia} from "helia";
import { Component } from "../utils/index.js";
import { Libp2pProcess } from "./libp2p.js";
import { IdReference } from "../utils/id.js";
import { _BaseProcess, _Status, _IBaseProcess } from "./base.js";

class _IpfsOptions {
    libp2p: Libp2pProcess
    datastore: any
    blockstore: any
    start: boolean


    constructor({
        libp2p,
        datastore,
        blockstore,
        start,
    }: {
        libp2p: Libp2pProcess,
        datastore?: any,
        blockstore?: any,
        start?: boolean
    }) {
        this.libp2p = libp2p
        this.datastore = datastore ? datastore : new MemoryDatastore()
        this.blockstore = blockstore ? datastore : new MemoryBlockstore()
        this.start = start ? start : false
    }
}

const createIpfsProcess = async (options: _IpfsOptions): Promise<Helia> => {
    return await createHelia({
        libp2p: options.libp2p.process,
        datastore: options.datastore,
        blockstore: options.blockstore,
        start: options.start
    })
}


class IpfsProcess 
    extends _BaseProcess
    implements _IBaseProcess
{
    public process?: Helia
    public options?: _IpfsOptions

    constructor({
        id,
        process,
        options
    }: {
        id?: IdReference,
        process?: Helia
        options?: _IpfsOptions
    }) {
        super({})
        this.id = id ? id : new IdReference({ component: Component.IPFS });
        this.process = process
        this.options = options
    }

    public async init(): Promise<void> {
        if (this.process !== undefined) {
            this.status = new _Status({stage: this.process.libp2p.status, message: `Ipfs process already initialized`})
            return;
        }

        if (!this.options) {
            this.options = new _IpfsOptions({
                libp2p: new Libp2pProcess({})
            })
        }
        this.process = await createIpfsProcess(this.options);
        this.status = new _Status({stage: this.process.libp2p.status, message: `Ipfs process initialized`})
        
    }

    public async start(): Promise<void> {
        if (this.process) {
            // await this.process.libp2p.start()
            await this.process.start()
            this.status?.update({stage: this.process.libp2p.status})
        }
    }

    public async stop(): Promise<void> {
        if (this.process) {
            // await this.process.libp2p.stop()
            await this.process.stop()
            this.status?.update({stage: this.process.libp2p.status})
        }
    }
}

export {
    createIpfsProcess,
    _IpfsOptions,
    IpfsProcess
}