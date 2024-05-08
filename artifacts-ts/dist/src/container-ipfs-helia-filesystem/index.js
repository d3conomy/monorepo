import { unixfs } from '@helia/unixfs';
import { ipfsFileSystemOptions } from './options.js';
import { InstanceTypes } from '../container/instance.js';
import { Container } from '../container/index.js';
import { ipfsFileSystemCommands } from './commands.js';
/**
 * Create an IPFS file system
 * @category IPFS
 */
const ipfsFileSystemInitializer = async (options) => {
    options.injectDefaults(ipfsFileSystemOptions());
    const { type, ipfs } = options.toParams();
    switch (type) {
        case 'unixfs':
            return unixfs(ipfs.getInstance());
        default:
            throw new Error(`Unsupported file system type: ${type}`);
    }
};
/**
 * The IPFS file system
 * @category IPFS
 */
class IpfsFileSystemContainer extends Container {
    /**
     * Constructor for the IPFS file system
     */
    constructor(id, options) {
        super({
            id,
            type: InstanceTypes.filesystem,
            options,
            initializer: ipfsFileSystemInitializer,
            commands: ipfsFileSystemCommands
        });
    }
}
export { IpfsFileSystemContainer };
