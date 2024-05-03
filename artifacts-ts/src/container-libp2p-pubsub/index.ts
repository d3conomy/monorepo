
import { GossipSub } from '@chainsafe/libp2p-gossipsub';
import { InstanceTypes } from '../container/instance';
import { Container } from '../container';
import { ContainerId } from '../id-reference-factory';
import { InstanceOptions } from '../container/options';
import { gossipSubCommands } from './commands.js';
import { Libp2pContainer } from '../container-libp2p';


const gossipSubInitializer = async (
    options: InstanceOptions
): Promise<GossipSub> => {
    const libp2pContainer: Libp2pContainer = options.get('libp2p');
    return libp2pContainer.getInstance().services?.pubsub
}


class GossipSubContainer
    extends Container<InstanceTypes.Pub_Sub>
{
    constructor(
        id: ContainerId,
        options: InstanceOptions
    ) {
        super({
            id,
            type: InstanceTypes.Pub_Sub,
            options,
            initializer: gossipSubInitializer,
            commands: gossipSubCommands
        })
    }
}

export {
    GossipSubContainer
};


