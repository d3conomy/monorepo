import exp from "constants";
import { Libp2pContainer } from "../container-libp2p";
import { InstanceOption, InstanceOptions } from "../container/options";

const gossipSubOptions = (): InstanceOptions => {
    return new InstanceOptions({options: [
        {
            name: 'libp2p',
            description: 'The libp2p container',
            required: true
        } as InstanceOption<Libp2pContainer>
    ]})
}

class GossipSubOptions
    extends InstanceOptions
{
    constructor(options: InstanceOptions, defaults: boolean = true) {
        super({options: options.toArray(), injectDefaults: defaults, defaults: gossipSubOptions()})
    }
}

export {
    gossipSubOptions,
    GossipSubOptions
}