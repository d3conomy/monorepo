import { unixfs } from '@helia/unixfs';
import { LogLevel, ProcessStage, logger } from 'd3-artifacts';
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
        message: `IPFS file ${event.type} progress ${event.detail.toString()}`
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
    process;
    activeCid;
    /**
     * Constructor for the IPFS file system
     */
    constructor({ id, ipfs, filesystemType, filesystem, cid }) {
        this.id = id;
        this.ipfs = ipfs;
        this.filesystemType = isIpfsFileSystemType(filesystemType);
        this.process = filesystem;
        this.activeCid = cid;
    }
    async init() {
        if (!this.checkProcess()) {
            this.process = createIpfsFileSystem({
                type: this.filesystemType,
                ipfs: this.ipfs
            });
        }
    }
    checkProcess() {
        if (this.process) {
            return true;
        }
        return false;
    }
    async start() {
        await this.init();
    }
    async stop() {
        if (this.process) {
            this.process = undefined;
        }
    }
    async restart() {
        await this.stop();
        await this.start();
    }
    status() {
        return ProcessStage.STARTED;
    }
    /**
     * Add a file to the IPFS file system
     * @param data The file data
     */
    async addBytes(data) {
        if (this.process) {
            return await this.process.addBytes(data, { onProgress: onEventProgress });
        }
        throw new Error('IPFS file system not found');
    }
    /**
     * Get a file from the IPFS file system
     * @param cid The content id
     */
    getBytes(cid) {
        if (this.process) {
            return this.process.cat(cid, { onProgress: onEventProgress });
        }
        throw new Error('IPFS file system not found');
    }
    /**
     * Add a File to the IPFS file system
     * @param data The File data
     */
    async addFile({ data, path, mode }) {
        if (this.process) {
            return await this.process.addFile({
                content: data,
                path: path,
                mode: mode || 0x755,
                mtime: {
                    secs: 10n,
                    nsecs: 0
                }
            }, { onProgress: onEventProgress });
        }
        throw new Error('IPFS file system not found');
    }
    /**
     * Add a directory to the IPFS file system
     * @param path The directory path
     */
    async addDirectory({ path, mode }) {
        if (!this.process) {
            throw new Error('IPFS file system not found');
        }
        return await this.process.addDirectory({
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
        if (!this.process) {
            throw new Error('IPFS file system not found');
        }
        return await this.process.mkdir(cid, path, { onProgress: onEventProgress });
    }
    /**
     * List the contents of a directory in the IPFS file system
     * @param cid The content id
     */
    ls(cid, path) {
        if (!this.process) {
            throw new Error('IPFS file system not found');
        }
        return this.process.ls(cid ? cid : this.activeCid, {
            path: path ? path : undefined,
            onProgress: onEventProgress
        });
    }
    /**
     * Remove a file from the IPFS file system
     */
    async rm(cid, path) {
        if (!this.process) {
            throw new Error('IPFS file system not found');
        }
        return await this.process.rm(cid, path, { onProgress: onEventProgress });
    }
    /**
     * Get the file system stats
     */
    async stat(cid) {
        if (!this.process) {
            throw new Error('IPFS file system not found');
        }
        return await this.process.stat(cid, { onProgress: onEventProgress });
    }
    /**
     * Create a new Empty file in the IPFS file system
     * @param path The file path
     * @param mode The file mode
     * @param mtime The file modification time
     */
    async touch({ cid, options: { mtime } }) {
        if (!this.process) {
            throw new Error('IPFS file system not found');
        }
        return await this.process.touch(cid, {
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
        if (!this.process) {
            throw new Error('IPFS file system not found');
        }
        return await this.process.chmod(cid, mode);
    }
    /**
     * Copy a file in the IPFS file system
     */
    async cp({ source, target, name }) {
        if (!this.process) {
            throw new Error('IPFS file system not found');
        }
        return await this.process.cp(source, target, name);
    }
}
export { IpfsFileSystem, IpfsFileSystemType, isIpfsFileSystemType };
