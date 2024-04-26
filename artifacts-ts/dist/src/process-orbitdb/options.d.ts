import { IProcessOption } from '../process-interface/processOptions.js';
import { IpfsProcess } from '../process-ipfs-helia/index.js';
declare const orbitDbOptions: () => Array<IProcessOption>;
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
    constructor({ ...values }?: {});
}
export { orbitDbOptions, OrbitDbOptions };
//# sourceMappingURL=options.d.ts.map