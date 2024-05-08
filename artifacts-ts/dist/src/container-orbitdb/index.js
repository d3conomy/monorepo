import { createOrbitDB } from '@orbitdb/core';
;
import { createIdentityProvider } from './identityProvider.js';
import { Container } from '../container/index.js';
import { InstanceTypes } from '../container/instance.js';
/**
 * Create an OrbitDb process
 * @category OrbitDb
 */
const orbitDbInitializer = async (options) => {
    // options.injectDefaults(orbitDbOptions())
    const { ipfs, enableDID, identitySeed, identityProvider, directory } = options.toParams();
    console.log(`creating orbitdb in directory: ${directory}`);
    if (enableDID === true) {
        return await createOrbitDB({
            ipfs: ipfs.getInstance(),
            identity: {
                provider: createIdentityProvider({ identityProvider, identitySeed })
            },
            directory: directory
        });
    }
    return await createOrbitDB({
        ipfs: ipfs.getInstance(),
        directory: directory
    });
};
/**
 * A class representing an OrbitDb process
 * @category OrbitDb
 */
class OrbitDbContainer extends Container {
    constructor(id, options) {
        super({
            id,
            type: InstanceTypes.orbitdb,
            options,
            initializer: orbitDbInitializer,
            commands: []
        });
    }
}
export { OrbitDbContainer };
