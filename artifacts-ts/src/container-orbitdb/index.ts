import { OrbitDb, createOrbitDB } from '@orbitdb/core';

import { ContainerId } from '../id-reference-factory/IdReferenceClasses.js';;
import { OrbitDbOptions, orbitDbOptions } from './options.js';
import { createIdentityProvider } from './identityProvider.js';
import { InstanceOptions } from '../container/options.js';
import { Container } from '../container/index.js';
import { InstanceTypes } from '../container/instance.js';


/**
 * Create an OrbitDb process
 * @category OrbitDb
 */
const orbitDbInitializer = async (
    options: OrbitDbOptions
): Promise<typeof OrbitDb> => {

    // options.injectDefaults(orbitDbOptions())

    const {
        ipfs,
        enableDID,
        identitySeed,
        identityProvider,
        directory
    } = options.toParams()

    if (enableDID === true) {
        return await createOrbitDB({
            ipfs: ipfs.getInstance(),
            identity: {
                provider: createIdentityProvider({identityProvider, identitySeed})
            },
            directory: directory
        });
    }
    return await createOrbitDB({
        ipfs: ipfs.getInstance(),
        directory: directory
    });
}

/**
 * A class representing an OrbitDb process
 * @category OrbitDb
 */
class OrbitDbContainer
    extends Container<InstanceTypes.orbitdb>
{
    constructor(
        id: ContainerId,
        options: InstanceOptions,
    ) {
        super({
            id,
            type: InstanceTypes.orbitdb,
            options,
            initializer: orbitDbInitializer,
            commands: []
        })
    }
}

export {
    OrbitDbContainer
}
