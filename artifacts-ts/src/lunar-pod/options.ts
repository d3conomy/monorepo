import { InstanceOption, InstanceOptions } from "../container/options.js";
import { defaultLibp2pOptions } from "../container-libp2p/options.js";
import { orbitDbOptions } from "../container-orbitdb/options.js";
import { openDbOptions } from "../container-orbitdb-open/options.js";
import { PodBayId } from "../id-reference-factory/IdReferenceClasses.js";
import { gossipSubOptions } from "../container-libp2p-pubsub/options.js";
import { ipfsFileSystemOptions } from "../container-ipfs-helia-filesystem/options.js";
import { StackTypes } from "./stack.js";


const lunarPodOptions = (): InstanceOptions => {
    return new InstanceOptions({ options: [
        {
            name: "name",
            description: "Lunar Pod Name",
            required: false
        } as InstanceOption<string>,
        {
            name: 'podbayId',
            description: 'PodBay ID',
            required: true
        } as InstanceOption<PodBayId>,
        {
            name: 'stack',
            description: 'Stack to run on the pod',
            required: false,
            defaultValue: StackTypes.Database
        } as InstanceOption<StackTypes>,
        ...defaultLibp2pOptions().toArray(),
        ...ipfsFileSystemOptions().toArray(),
        ...orbitDbOptions().toArray(),
        ...openDbOptions().toArray(),
        ...gossipSubOptions().toArray(),
        ...ipfsFileSystemOptions().toArray()
    ]})
}


class LunarPodOptions
    extends InstanceOptions
{

    constructor(options?: InstanceOptions, defaults: boolean = true) {
        super({
            options: options?.toArray(),
            injectDefaults: defaults,
            defaults: lunarPodOptions()

        })
    }
}

export {
    lunarPodOptions,
    LunarPodOptions
}
