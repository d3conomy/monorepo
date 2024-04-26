import { createProcessOption, injectDefaultValues, mapProcessOptions } from '../process-interface/processOptions.js';
import { createIdentityProvider } from './identityProvider.js';
const orbitDbOptions = () => [
    createProcessOption({
        name: 'ipfs',
        description: 'The IPFS process',
        required: true
    }),
    createProcessOption({
        name: 'enableDID',
        description: 'Enable DID',
        required: false,
        defaultValue: false
    }),
    createProcessOption({
        name: 'identitySeed',
        description: 'Identity seed',
        required: false
    }),
    createProcessOption({
        name: 'identityProvider',
        description: 'Identity provider',
        required: false
    }),
    createProcessOption({
        name: 'directory',
        description: 'Directory',
        required: false
    })
];
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
    constructor({ ...values } = {}) {
        const injectedDefaultValues = injectDefaultValues({ options: orbitDbOptions(), values });
        const { ipfs, enableDID, identitySeed, identityProvider, directory } = mapProcessOptions(injectedDefaultValues);
        if (!ipfs) {
            throw new Error(`No Ipfs process found`);
        }
        console.log(`orbitDbOptions: ${injectedDefaultValues}`);
        console.log(`orbitDbOptions: ${ipfs.id}`);
        this.ipfs = ipfs;
        this.enableDID = enableDID !== undefined ? enableDID : false;
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
export { orbitDbOptions, OrbitDbOptions };
