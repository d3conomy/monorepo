import { AddEvents, GetEvents, UnixFS, UnixFSStats, unixfs } from '@helia/unixfs'
import { CID } from 'multiformats'

import { IpfsProcess } from './index.js'
import { LogLevel, PodProcessId, logger } from 'd3-artifacts';


enum IpfsFileSystemType {
    UNIXFS = "unixfs"
}

const isIpfsFileSystemType = (value: any): IpfsFileSystemType => {
    if (Object.values(IpfsFileSystemType).includes(value)) {
        return value as IpfsFileSystemType;
    }
    throw new Error('Invalid IPFS file system type');
}

/**
 * Create an IPFS file system
 * @category IPFS
 */
const createIpfsFileSystem = ({
    type,
    ipfs
}: {
    type: IpfsFileSystemType,
    ipfs: IpfsProcess
}): UnixFS => {
    if (!ipfs.process) {
        throw new Error('IPFS process not available');
    }

    switch (type) {
        case IpfsFileSystemType.UNIXFS:
            return unixfs(ipfs.process)
        default:
            throw new Error('File system type not found');
    }
}

const onEventProgress = (event: AddEvents | GetEvents) => {
    logger({
        level: LogLevel.INFO,
        message: `IPFS file ${event.type} progress ${event.detail.toString()}`
    })
}


/**
 * The IPFS file system
 * @category IPFS
 */
class IpfsFileSystem {
    public id: PodProcessId
    public ipfs: IpfsProcess
    public filesystemType: IpfsFileSystemType
    public filesystem: UnixFS

    /**
     * Constructor for the IPFS file system
     */
    constructor({
        id,
        ipfs,
        filesystem,
        encoder,
        decoder
    }: {
        id: PodProcessId,
        ipfs: IpfsProcess,
        filesystem: IpfsFileSystemType,
        encoder?: any,
        decoder?: any
    }) {
        this.id = id
        this.ipfs = ipfs
        this.filesystemType = isIpfsFileSystemType(filesystem)

        this.filesystem = createIpfsFileSystem({
            type: this.filesystemType,
            ipfs: this.ipfs
        })
    }

    /**
     * Add a file to the IPFS file system
     * @param data The file data
     */
    public async addBytes(data: Uint8Array): Promise<CID> {
        return await this.filesystem.addBytes(data, { onProgress: onEventProgress })
    }

    /**
     * Get a file from the IPFS file system
     * @param cid The content id
     */
    public getBytes(cid: CID): AsyncIterable<Uint8Array> {
        return this.filesystem.cat(cid, { onProgress: onEventProgress})
    }

    /**
     * Add a File to the IPFS file system
     * @param data The File data
     */
    public async addFile({
        data,
        path,
        mode
    }: {
        data: any,
        path: string,
        mode?: number
    }): Promise<CID> {
        return await this.filesystem.addFile({
            content: data,
            path: path,
            mode: mode || 0x755,
            mtime: {
                secs: 10n,
                nsecs: 0
            }
        }, { onProgress: onEventProgress })
    }

    /**
     * Add a directory to the IPFS file system
     * @param path The directory path
     */
    public async addDirectory({
        path,
        mode
    }: {
        path: string,
        mode?: number
    }): Promise<CID> {
        return await this.filesystem.addDirectory({
            path: path,
            mode: mode || 0x755,
            mtime: {
                secs: 10n,
                nsecs: 0
            }
        }, { onProgress: onEventProgress })
    }

    /**
     * Make a new directory in the IPFS file system
     * @param path The directory path
     */
    public async mkdir(cid: CID, path: string): Promise<CID> {
        return await this.filesystem.mkdir(cid, path, { onProgress: onEventProgress })
    }

    /**
     * List the contents of a directory in the IPFS file system
     * @param cid The content id
     */
    public ls(cid: CID, path?: string): AsyncIterable<any> {
        return this.filesystem.ls(
            cid, 
            { 
                path,
                onProgress: onEventProgress 
            }
        )
    }

    /**
     * Remove a file from the IPFS file system
     */
    public async rm(cid: CID, path: string): Promise<CID> {
        return await this.filesystem.rm(cid, path, { onProgress: onEventProgress })
    }

    /**
     * Get the file system stats
     */
    public async stat(cid: CID): Promise<UnixFSStats> {
        return await this.filesystem.stat(cid, { onProgress: onEventProgress })
    }

    /**
     * Create a new Empty file in the IPFS file system
     * @param path The file path
     * @param mode The file mode
     * @param mtime The file modification time
     */
    public async touch({
        cid,
        options: {
            mtime
        }
    }: {
        cid: CID,
        options: {
            mode?: number,
            mtime?: {
                secs: bigint,
                nsecs: number
            }
        }
    }): Promise<CID> {
        return await this.filesystem.touch(
            cid,
            {
                mtime: mtime || {
                    secs: 10n,
                    nsecs: 0
                },
                onProgress: onEventProgress
            }
        )
    }

    /** 
     * Chandge the file mode in the IPFS file system
     */
    public async chmod({
        cid,
        mode
    }: {
        cid: CID,
        mode: number
    }): Promise<CID> {
        return await this.filesystem.chmod(
            cid,
            mode
        )
    }

    /** 
     * Copy a file in the IPFS file system
     */
    public async cp({
        source,
        target,
        name
    }: {
        source: CID,
        target: CID,
        name: string
    }): Promise<CID> {
        return await this.filesystem.cp(
            source,
            target,
            name
        )
    }

}

export {
    IpfsFileSystem,
    IpfsFileSystemType
}