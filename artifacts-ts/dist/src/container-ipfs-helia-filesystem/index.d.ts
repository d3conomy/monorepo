import { IpfsFileSystemOptions } from './options.js';
import { InstanceTypes } from '../container/instance.js';
import { Container } from '../container/index.js';
import { ContainerId } from '../id-reference-factory/IdReferenceClasses.js';
/**
 * The IPFS file system
 * @category IPFS
 */
declare class IpfsFileSystemContainer extends Container<InstanceTypes.filesystem> {
    /**
     * Constructor for the IPFS file system
     */
    constructor(id: ContainerId, options: IpfsFileSystemOptions);
}
export { IpfsFileSystemContainer };
//# sourceMappingURL=index.d.ts.map