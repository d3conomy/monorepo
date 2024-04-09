import { createIdentityProvider } from './OrbitDbIdentityProvider.js';
/**
* The options for creating an OrbitDb process
* @category OrbitDb
*/
class OrbitDbOptions {
    ipfs;
    enableDID;
    identitySeed;
    identityProvider;
    directory;
    constructor({ ipfs, enableDID, identitySeed, identityProvider, directory }) {
        if (!ipfs) {
            throw new Error(`No Ipfs process found`);
        }
        this.ipfs = ipfs;
        this.enableDID = enableDID ? enableDID : false;
        this.identitySeed = identitySeed;
        this.identityProvider = identityProvider;
        this.directory = directory ? directory : `./data/pods/${this.ipfs.id.podId.toString()}/orbitdb`;
        if (this.enableDID) {
            this.identityProvider = createIdentityProvider({
                identitySeed: this.identitySeed,
                identityProvider: this.identityProvider
            });
        }
    }
}
export { OrbitDbOptions };
