
import path from 'path';
import { IProcessOption, ProcessOptions, createProcessOption, injectDefaultValues, mapProcessOptions } from '../process-interface/processOptions.js';
import { IpfsProcess } from '../process-ipfs-helia/index.js';
import { createIdentityProvider } from './identityProvider.js';


const orbitDbOptions = (): Array<IProcessOption> => [
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
]

/**
* The options for creating an OrbitDb process
* @category OrbitDb
*/
class OrbitDbOptions 
    extends ProcessOptions
{
    ipfs: IpfsProcess;
    enableDID: boolean;
    identitySeed?: Uint8Array;
    identityProvider?: any;
    directory?: string;

    constructor({...values} : {} = {}) {
        super({})
        const injectedDefaultValues = injectDefaultValues({options: orbitDbOptions(), values})

        const {
            ipfs,
            enableDID,
            identitySeed,
            identityProvider,
            directory
        } = mapProcessOptions(injectedDefaultValues);

        if (!ipfs) {
            throw new Error(`No Ipfs process found`)
        }

        this.ipfs = ipfs;
        this.enableDID = enableDID !== undefined ? enableDID : false;
        this.identitySeed = identitySeed;
        this.identityProvider = identityProvider

        const __dirname = path.resolve();
        let orbitDbDataPath = path.join(__dirname, 'data', 'pods', ipfs.id.podId.name, 'orbitdb');
        if (directory && directory !== '') {
            orbitDbDataPath = path.join(directory);
        }   
        this.directory = orbitDbDataPath;

        if (this.enableDID) {
            this.identityProvider = createIdentityProvider({
                identitySeed: this.identitySeed,
                identityProvider: this.identityProvider
            });
        }
    }

    toParams(): { [key: string]: any } {
        return {
            ipfs: this.ipfs,
            enableDID: this.enableDID,
            identitySeed: this.identitySeed,
            identityProvider: this.identityProvider,
            directory: this.directory
        }
    }

    toArray(): Array<IProcessOption> {
        return Object.keys(this.toParams()).map((key: string) => {
            if (this.hasOwnProperty(key)) {
                if (typeof this.get(key) !== 'function') {
                    return createProcessOption({
                        name: key,
                        value: this.toParams()[key]
                    });
                }
            }
            return createProcessOption({
                name: key,
                value: this.toParams()[key]
            });
        });
    }
}

export {
    orbitDbOptions,
    OrbitDbOptions
};