import { InstanceOption, InstanceOptions } from '../container/options.js';
import { IpfsContainer } from '../container-ipfs-helia/index.js';
import { IpfsFileSystemType } from './fsTypes.js';

const ipfsFileSystemOptions = (): InstanceOptions => {
    return new InstanceOptions({ options: [
        {
            name: "type",
            description: "The file system type",
            required: true
        } as InstanceOption<IpfsFileSystemType>,
        {
            name: "ipfs",
            description: "The IPFS container",
            required: true
        } as InstanceOption<IpfsContainer>
    ]})
}


class IpfsFileSystemOptions
    extends InstanceOptions 
{

    constructor(options?: InstanceOptions, defaults: boolean = true) {
        super({options: options?.toArray(), injectDefaults: defaults, defaults: ipfsFileSystemOptions()})
    }
}


export {
    ipfsFileSystemOptions,
    IpfsFileSystemOptions
}