
import { IpfsProcess } from '../ipfs-process/index.js';
import { IdReference } from 'd3-artifacts';
import { createIdentityProvider } from './OrbitDbIdentityProvider.js';


/**
* The options for creating an OrbitDb process
* @category OrbitDb
*/
class OrbitDbOptions {
    ipfs: IpfsProcess;
    enableDID: boolean;
    identitySeed?: Uint8Array;
    identityProvider?: any;
    directory?: string;

    constructor({
        ipfs,
        enableDID,
        identitySeed,
        identityProvider,
        directory
    }: {
        ipfs?: IpfsProcess;
        enableDID?: boolean;
        identitySeed?: Uint8Array;
        identityProvider?: any;
        directory?: string;
    }) {
        if (!ipfs) {
            throw new Error(`No Ipfs process found`)
        }
        this.ipfs = ipfs;
        this.enableDID = enableDID ? enableDID : false;
        this.identitySeed = identitySeed;
        this.identityProvider = identityProvider;
        this.directory = directory ? directory : `./orbitdb/${new IdReference().name}`;

        if (this.enableDID) {
            this.identityProvider = createIdentityProvider({
                identitySeed: this.identitySeed,
                identityProvider: this.identityProvider
            });
        }
    }
}

export {
    OrbitDbOptions
};