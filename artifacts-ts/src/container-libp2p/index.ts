import { Libp2p, createLibp2p,  } from 'libp2p';

import { Container } from '../container/index.js';
import { InstanceOptionsList } from '../container/options';
import { InstanceTypes } from '../container/instance.js';
import { libp2pCommands } from './commands.js';
import { create } from 'domain';
import { ContainerId } from '../id-reference-factory/IdReferenceClasses.js';

const libp2pInitializer = async (options: InstanceOptionsList): Promise<Libp2p> => {
    // const subProcessesses = await createSubProcesses(options);
    return await createLibp2p();
}

class Libp2pContainer extends Container<InstanceTypes.Libp2p> {
    constructor(
        id: ContainerId,
        options: InstanceOptionsList,
    ) {
        super({
            id,
            type: InstanceTypes.Libp2p,
            options: options,
            initializer: libp2pInitializer,
            commands: libp2pCommands
        })
    }
}

export {
    Libp2pContainer
}