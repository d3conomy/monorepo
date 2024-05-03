import { ContainerId } from "../id-reference-factory/IdReferenceClasses.js";
import { Container } from "../container/index.js";
import { InstanceTypes } from "../container/instance.js";
import { InstanceOptions } from "../container/options.js";
/**
 * The process container for the IPFS process
 *
 * Helia is used as the IPFS process
 * @category IPFS
 */
declare class IpfsContainer extends Container<InstanceTypes.IPFS> {
    constructor(id: ContainerId, options?: InstanceOptions);
}
export { IpfsContainer };
export * from './commands.js';
export * from './options.js';
//# sourceMappingURL=index.d.ts.map