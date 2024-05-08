
import { GossipSub } from '@chainsafe/libp2p-gossipsub';
import { InstanceTypes } from '../container/instance.js';
import { Container } from '../container/index.js';
import { ContainerId } from '../id-reference-factory/index.js';
import { InstanceOptions } from '../container/options.js';
import { gossipSubCommands } from './commands.js';
import { Libp2pContainer } from '../container-libp2p/index.js';


const gossipSubInitializer = async (
    options: InstanceOptions
): Promise<GossipSub> => {
    const libp2pContainer: Libp2pContainer = options.get('libp2p');
    return libp2pContainer.getInstance().services?.pubsub
}


class GossipSubContainer
    extends Container<InstanceTypes.pubsub>
{
    constructor(
        id: ContainerId,
        options: InstanceOptions
    ) {
        super({
            id,
            type: InstanceTypes.pubsub,
            options,
            initializer: gossipSubInitializer,
            commands: gossipSubCommands
        })
    }
}

export {
    GossipSubContainer
};


