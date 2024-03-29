import { IpfsProcess } from '../ipfs-process/index.js';
/**
* The options for creating an OrbitDb process
* @category OrbitDb
*/
declare class OrbitDbOptions {
    ipfs: IpfsProcess;
    enableDID: boolean;
    identitySeed?: Uint8Array;
    identityProvider?: any;
    directory?: string;
    constructor({ ipfs, enableDID, identitySeed, identityProvider, directory }: {
        ipfs?: IpfsProcess;
        enableDID?: boolean;
        identitySeed?: Uint8Array;
        identityProvider?: any;
        directory?: string;
    });
}
export { OrbitDbOptions };
//# sourceMappingURL=OrbitDbOptions.d.ts.map