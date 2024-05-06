import { InstanceOption, InstanceOptions } from "../container/options.js";

import { IpfsOptions } from "../container-ipfs-helia/options.js";
import { defaultLibp2pOptions } from "../container-libp2p/options.js";
import { OrbitDbOptions } from "../container-orbitdb/options.js";
import { OpenDbOptions } from "../container-orbitdb-open/options.js";
import { Container } from "../container/index.js";
import { PodBayId } from "../id-reference-factory/IdReferenceClasses.js";
import { Libp2pDefaultsOptions } from "helia/dist/src/utils/libp2p.js";



const lunarPodOptions = (): InstanceOptions => {
    return new InstanceOptions({ options: [
        {
            name: "name",
            description: "Lunar Pod Name",
            required: false
        } as InstanceOption<string>,
        {
            name: 'containers',
            description: 'Containers in the Pod',
            required: false
        } as InstanceOption<Array<Container>>,
        {
            name: 'podbayId',
            description: 'PodBay ID',
            required: true
        } as InstanceOption<PodBayId>,
        {
            name: 'ipfsOptions',
            description: 'IPFS Options',
            required: false,
            // defaultValue: 
        } as InstanceOption<IpfsOptions>,
        {
            name: 'libp2pOptions',
            description: 'Libp2p Options',
            required: false,
            defaultValue: defaultLibp2pOptions()
        } as InstanceOption<Libp2pDefaultsOptions>,
        {
            name: 'orbitDbOptions',
            description: 'OrbitDB Options',
            required: false,
            // defaultValue: 
        } as InstanceOption<Partial<OrbitDbOptions>>,
        {
            name: 'openDbOptions',
            description: 'OpenDB Options',
            required: false,
            defaultValue: new OpenDbOptions()
        } as InstanceOption<OpenDbOptions>
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
