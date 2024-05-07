import { createIdentityProvider } from './identityProvider.js';
import { InstanceOptions } from '../container/options.js';
const orbitDbOptions = () => {
    return new InstanceOptions({ options: [
            {
                name: 'ipfs',
                description: 'The IPFS process',
                required: true
            },
            {
                name: 'enableDID',
                description: 'Enable DID',
                required: false,
                defaultValue: false
            },
            {
                name: 'identitySeed',
                description: 'Identity seed',
                required: false
            },
            {
                name: 'identityProvider',
                description: 'Identity provider',
                required: false
            },
            {
                name: 'directory',
                description: 'Directory',
                required: false
            }
        ] });
};
/**
* The options for creating an OrbitDb process
* @category OrbitDb
*/
class OrbitDbOptions extends InstanceOptions {
    constructor(options, defaults = true) {
        super({ options: options?.toArray(), injectDefaults: defaults, defaults: orbitDbOptions() });
        this.init();
    }
    init() {
        if (this.get('identityProvider') === undefined) {
            this.set('identityProvider', createIdentityProvider({
                identitySeed: this.get('identitySeed'),
                identityProvider: this.get('identityProvider')
            }));
        }
    }
}
export { orbitDbOptions, OrbitDbOptions };
