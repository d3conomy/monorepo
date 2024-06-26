import { InstanceOptions } from '../container/options.js';
const ipfsFileSystemOptions = () => {
    return new InstanceOptions({ options: [
            {
                name: "type",
                description: "The file system type",
                required: true
            },
            {
                name: "ipfs",
                description: "The IPFS container",
                required: true
            }
        ] });
};
class IpfsFileSystemOptions extends InstanceOptions {
    constructor(options, defaults = true) {
        super({ options: options?.toArray(), injectDefaults: defaults, defaults: ipfsFileSystemOptions() });
    }
}
export { ipfsFileSystemOptions, IpfsFileSystemOptions };
