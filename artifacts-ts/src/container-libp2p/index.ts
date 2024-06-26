import { Libp2p, createLibp2p,  } from 'libp2p';

import { Container } from '../container/index.js';
import { InstanceOptions } from '../container/options.js';
import { InstanceTypes } from '../container/instance.js';
import { libp2pCommands } from './commands.js';
import { ContainerId } from '../id-reference-factory/IdReferenceClasses.js';
import { createLibp2pOptions } from './options.js';

const libp2pInitializer = async (options: InstanceOptions): Promise<Libp2p> => {
    return await createLibp2p(await createLibp2pOptions(options));
}

class Libp2pContainer extends Container<InstanceTypes.libp2p> {
    constructor(
        id: ContainerId,
        options?: InstanceOptions,
    ) {
        super({
            id,
            type: InstanceTypes.libp2p,
            options: options,
            initializer: libp2pInitializer,
            commands: libp2pCommands
        })
    }
}

export {
    Libp2pContainer
}