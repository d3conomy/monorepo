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

export {
    gossipSubOptions
}