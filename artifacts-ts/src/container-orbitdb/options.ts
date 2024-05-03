
import { createIdentityProvider } from './identityProvider.js';
import { InstanceOption, InstanceOptions } from '../container/options.js';
import { IpfsContainer } from '../container-ipfs-helia/index.js';


const orbitDbOptions = (): InstanceOptions => {
    return new InstanceOptions({options: [
        {
            name: 'ipfs',
            description: 'The IPFS process',
            required: true
        } as InstanceOption<IpfsContainer['instance']>,
        {
            name: 'enableDID',
            description: 'Enable DID',
            required: false,
            defaultValue: false
        } as InstanceOption<boolean>,
        {
            name: 'identitySeed',
            description: 'Identity seed',
            required: false
        } as InstanceOption<Uint8Array>,
        {
            name: 'identityProvider',
            description: 'Identity provider',
            required: false
        } as InstanceOption<any>,
        {
            name: 'directory',
            description: 'Directory',
            required: false
        } as InstanceOption<string>    
    ]})
};

/**
* The options for creating an OrbitDb process
* @category OrbitDb
*/
class OrbitDbOptions 
    extends InstanceOptions
{
    constructor(options: InstanceOptions = orbitDbOptions()) {
        super({options: options.toArray()})
        this.init()
    }

    init(): void {
        if (this.get('identityProvider') === undefined) {
            this.set('identityProvider', createIdentityProvider({
                identitySeed: this.get('identitySeed'),
                identityProvider: this.get('identityProvider')
            }))
        }
    }
}

export {
    orbitDbOptions,
    OrbitDbOptions
};