import { Libp2p } from 'libp2p';
import { GossipSubContainer } from '../container-libp2p-pubsub/index.js';
import { Libp2pContainer } from '../container-libp2p/index.js';
import { Commands } from '../container/commands.js';
import { Container } from '../container/index.js';
import { InstanceTypes } from '../container/instance.js';
import { InstanceOptions } from '../container/options.js';
import { ContainerId } from '../id-reference-factory/IdReferenceClasses.js';



// Define the Pod class
class Pod {
    private containers: Array<Container<InstanceTypes>>;
    // private manifest: PodManifest;

    constructor() {
        this.containers = new Array<Container<InstanceTypes>>();

    }

    
}

// Export the Pod class
export { Pod };