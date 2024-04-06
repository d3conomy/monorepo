import { unixfs } from '@helia/unixfs';
import { LogLevel, logger } from 'd3-artifacts';
var IpfsFileSystemType;
(function (IpfsFileSystemType) {
    IpfsFileSystemType["UNIXFS"] = "unixfs";
})(IpfsFileSystemType || (IpfsFileSystemType = {}));
const isIpfsFileSystemType = (value) => {
    if (Object.values(IpfsFileSystemType).includes(value)) {
        return value;
    }
    throw new Error('Invalid IPFS file system type');
};
/**
 * Create an IPFS file system
 * @category IPFS
 */
const createIpfsFileSystem = ({ type, ipfs }) => {
    if (!ipfs.process) {
        throw new Error('IPFS process not available');
    }
    switch (type) {
        case IpfsFileSystemType.UNIXFS:
            return unixfs(ipfs.process);
        default:
            throw new Error('File system type not found');
    }
};
const onEventProgress = (event) => {
    logger({
        level: LogLevel.INFO,
        message: `IPFS file ${event.type} progress ${event.detail}`
    });
};
/**
 * The IPFS file system
 * @category IPFS
 */
class IpfsFileSystem {
    id;
    ipfs;
    filesystemType;
    filesystem;
    encoder;
    decoder;
    /**
     * Constructor for the IPFS file system
     */
    constructor({ id, ipfs, filesystem, encoder, decoder }) {
        this.id = id;
        this.ipfs = ipfs;
        this.filesystemType = isIpfsFileSystemType(filesystem);
        this.filesystem = createIpfsFileSystem({
            type: this.filesystemType,
            ipfs: this.ipfs
        });
        this.encoder = encoder || new TextEncoder();
        this.decoder = decoder || new TextDecoder();
    }
    /**
     * Add a file to the IPFS file system
     * @param data The file data
     */
    async addBytes(data) {
        return await this.filesystem.addBytes(data, { onProgress: onEventProgress });
    }
    /**
     * Get a file from the IPFS file system
     * @param cid The content id
     */
    getBytes(cid) {
        return this.filesystem.cat(cid, { onProgress: onEventProgress });
    }
    /**
     * Add a File to the IPFS file system
     * @param data The File data
     */
    async addFile({ data, path, mode }) {
        return await this.filesystem.addFile({
            content: data,
            path: path,
            mode: mode || 0x755,
            mtime: {
                secs: 10n,
                nsecs: 0
            }
        }, { onProgress: onEventProgress });
    }
    /**
     * Add a directory to the IPFS file system
     * @param path The directory path
     */
    async addDirectory({ path, mode }) {
        return await this.filesystem.addDirectory({
            path: path,
            mode: mode || 0x755,
            mtime: {
                secs: 10n,
                nsecs: 0
            }
        }, { onProgress: onEventProgress });
    }
    /**
     * Make a new directory in the IPFS file system
     * @param path The directory path
     */
    async mkdir(cid, path) {
        return await this.filesystem.mkdir(cid, path, { onProgress: onEventProgress });
    }
    /**
     * List the contents of a directory in the IPFS file system
     * @param cid The content id
     */
    ls(cid, path) {
        return this.filesystem.ls(cid, {
            path,
            onProgress: onEventProgress
        });
    }
    /**
     * Remove a file from the IPFS file system
     */
    async rm(cid, path) {
        return await this.filesystem.rm(cid, path, { onProgress: onEventProgress });
    }
    /**
     * Get the file system stats
     */
    async stat(cid) {
        return await this.filesystem.stat(cid, { onProgress: onEventProgress });
    }
    /**
     * Create a new Empty file in the IPFS file system
     * @param path The file path
     * @param mode The file mode
     * @param mtime The file modification time
     */
    async touch({ cid, options: { mtime } }) {
        return await this.filesystem.touch(cid, {
            mtime: mtime || {
                secs: 10n,
                nsecs: 0
            },
            onProgress: onEventProgress
        });
    }
    /**
     * Chandge the file mode in the IPFS file system
     */
    async chmod({ cid, mode }) {
        return await this.filesystem.chmod(cid, mode);
    }
    /**
     * Copy a file in the IPFS file system
     */
    async cp({ source, target, name }) {
        return await this.filesystem.cp(source, target, name);
    }
}
export { IpfsFileSystem, IpfsFileSystemType };
