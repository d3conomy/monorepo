import { UnixFS, unixfs } from '@helia/unixfs'

import { IpfsFileSystemOptions, ipfsFileSystemOptions } from './options.js';
import { InstanceTypes } from '../container/instance.js';
import { Container } from '../container/index.js';
import { ContainerId } from '../id-reference-factory/IdReferenceClasses.js';
import { ipfsFileSystemCommands } from './commands.js';


/**
 * Create an IPFS file system
 * @category IPFS
 */
const ipfsFileSystemInitializer = async (
    options: IpfsFileSystemOptions
): Promise<UnixFS> => {
    options.injectDefaults(ipfsFileSystemOptions())

    const {
        type,
        ipfs
    } = options.toParams()

    switch (type) {
        case 'unixfs':
            return unixfs(ipfs.getInstance())
        default:
            throw new Error(`Unsupported file system type: ${type}`)
    }
}


/**
 * The IPFS file system
 * @category IPFS
 */
class IpfsFileSystemContainer
    extends Container<InstanceTypes.File_System>
{
   
    /**
     * Constructor for the IPFS file system
     */
    constructor(
        id: ContainerId,
        options: IpfsFileSystemOptions
    ) {
        super({
            id,
            type: InstanceTypes.File_System,
            options,
            initializer: ipfsFileSystemInitializer,
            commands: ipfsFileSystemCommands
        })
    }

    
}

export {
    IpfsFileSystemContainer
}