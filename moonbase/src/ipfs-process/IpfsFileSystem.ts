import { AddEvents, GetEvents, UnixFS, UnixFSStats, unixfs } from '@helia/unixfs'
import { CID } from 'multiformats'

import { IpfsProcess } from './index.js'
import { IProcess, LogLevel, PodProcessId, ProcessStage, logger } from 'd3-artifacts';


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
class IpfsFileSystem
    implements IProcess
{
    public id: PodProcessId
    public ipfs: IpfsProcess
    public filesystemType: IpfsFileSystemType
    public process?: UnixFS
    public activeCid?: CID

    /**
     * Constructor for the IPFS file system
     */
    constructor({
        id,
        ipfs,
        filesystemType,
        filesystem,
        cid
    }: {
        id: PodProcessId,
        ipfs: IpfsProcess,
        filesystemType?: IpfsFileSystemType,
        filesystem?: UnixFS,
        cid?: CID
    }) {
        this.id = id
        this.ipfs = ipfs
        this.filesystemType = isIpfsFileSystemType(filesystemType)
        this.process = filesystem
        this.activeCid = cid
    }

    public async init(): Promise<void> {
        if(!this.checkProcess()) {
            this.process = createIpfsFileSystem({
                type: this.filesystemType,
                ipfs: this.ipfs
            })
        }
        
    }

    public checkProcess(): boolean {
        if (this.process) {
            return true
        }
        return false
    }

    public async start(): Promise<void> {

        await this.init()
    }

    public async stop(): Promise<void> {
        if (this.process) {
            this.process = undefined
        }
    }

    public async restart(): Promise<void> {
        await this.stop()
        await this.start()
    }

    public status(): ProcessStage {
        return ProcessStage.STARTED
    }

    /**
     * Add a file to the IPFS file system
     * @param data The file data
     */
    public async addBytes(data: Uint8Array): Promise<CID> {
        if (this.process) {
            return await this.process.addBytes(data, { onProgress: onEventProgress })
        }
        throw new Error('IPFS file system not found')
    }

    /**
     * Get a file from the IPFS file system
     * @param cid The content id
     */
    public getBytes(cid: CID): AsyncIterable<Uint8Array> {
        if (this.process) {
            return this.process.cat(cid, { onProgress: onEventProgress })
        }
        throw new Error('IPFS file system not found')
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
        if (this.process) {
            return await this.process.addFile({
                content: data,
                path: path,
                mode: mode || 0x755,
                mtime: {
                    secs: 10n,
                    nsecs: 0
                }
            }, { onProgress: onEventProgress })
        }
        throw new Error('IPFS file system not found')
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
        if (!this.process) {
            throw new Error('IPFS file system not found')
        }
        return await this.process.addDirectory({
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
        if (!this.process) {
            throw new Error('IPFS file system not found')
        }
        return await this.process.mkdir(cid, path, { onProgress: onEventProgress })
    }

    /**
     * List the contents of a directory in the IPFS file system
     * @param cid The content id
     */
    public ls(cid?: CID, path?: string): AsyncIterable<any> {
        if (!this.process) {
            throw new Error('IPFS file system not found')
        }
        return this.process.ls(
            cid ? cid : this.activeCid as CID, 
            { 
                path: path ? path : undefined,
                onProgress: onEventProgress 
            }
        )
    }

    /**
     * Remove a file from the IPFS file system
     */
    public async rm(cid: CID, path: string): Promise<CID> {
        if (!this.process) {
            throw new Error('IPFS file system not found')
        }
        return await this.process.rm(cid, path, { onProgress: onEventProgress })
    }

    /**
     * Get the file system stats
     */
    public async stat(cid: CID): Promise<UnixFSStats> {
        if (!this.process) {
            throw new Error('IPFS file system not found')
        }
        return await this.process.stat(cid, { onProgress: onEventProgress })
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
        if (!this.process) {
            throw new Error('IPFS file system not found')
        }
        return await this.process.touch(
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
        if (!this.process) {
            throw new Error('IPFS file system not found')
        }
        return await this.process.chmod(
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
        if (!this.process) {
            throw new Error('IPFS file system not found')
        }
        return await this.process.cp(
            source,
            target,
            name
        )
    }

}

export {
    IpfsFileSystem,
    IpfsFileSystemType,
    isIpfsFileSystemType
}