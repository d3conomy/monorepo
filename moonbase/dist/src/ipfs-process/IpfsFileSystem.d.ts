import { UnixFS, UnixFSStats } from '@helia/unixfs';
import { CID } from 'multiformats';
import { IpfsProcess } from './index.js';
import { IProcess, PodProcessId, ProcessStage } from 'd3-artifacts';
declare enum IpfsFileSystemType {
    UNIXFS = "unixfs"
}
declare const isIpfsFileSystemType: (value: any) => IpfsFileSystemType;
/**
 * The IPFS file system
 * @category IPFS
 */
declare class IpfsFileSystem implements IProcess {
    id: PodProcessId;
    ipfs: IpfsProcess;
    filesystemType: IpfsFileSystemType;
    process?: UnixFS;
    activeCid?: CID;
    /**
     * Constructor for the IPFS file system
     */
    constructor({ id, ipfs, filesystemType, filesystem, cid }: {
        id: PodProcessId;
        ipfs: IpfsProcess;
        filesystemType?: IpfsFileSystemType;
        filesystem?: UnixFS;
        cid?: CID;
    });
    init(): Promise<void>;
    checkProcess(): boolean;
    start(): Promise<void>;
    stop(): Promise<void>;
    restart(): Promise<void>;
    status(): ProcessStage;
    /**
     * Add a file to the IPFS file system
     * @param data The file data
     */
    addBytes(data: Uint8Array): Promise<CID>;
    /**
     * Get a file from the IPFS file system
     * @param cid The content id
     */
    getBytes(cid: CID): AsyncIterable<Uint8Array>;
    /**
     * Add a File to the IPFS file system
     * @param data The File data
     */
    addFile({ data, path, mode }: {
        data: any;
        path: string;
        mode?: number;
    }): Promise<CID>;
    /**
     * Add a directory to the IPFS file system
     * @param path The directory path
     */
    addDirectory({ path, mode }: {
        path: string;
        mode?: number;
    }): Promise<CID>;
    /**
     * Make a new directory in the IPFS file system
     * @param path The directory path
     */
    mkdir(cid: CID, path: string): Promise<CID>;
    /**
     * List the contents of a directory in the IPFS file system
     * @param cid The content id
     */
    ls(cid?: CID, path?: string): AsyncIterable<any>;
    /**
     * Remove a file from the IPFS file system
     */
    rm(cid: CID, path: string): Promise<CID>;
    /**
     * Get the file system stats
     */
    stat(cid: CID): Promise<UnixFSStats>;
    /**
     * Create a new Empty file in the IPFS file system
     * @param path The file path
     * @param mode The file mode
     * @param mtime The file modification time
     */
    touch({ cid, options: { mtime } }: {
        cid: CID;
        options: {
            mode?: number;
            mtime?: {
                secs: bigint;
                nsecs: number;
            };
        };
    }): Promise<CID>;
    /**
     * Chandge the file mode in the IPFS file system
     */
    chmod({ cid, mode }: {
        cid: CID;
        mode: number;
    }): Promise<CID>;
    /**
     * Copy a file in the IPFS file system
     */
    cp({ source, target, name }: {
        source: CID;
        target: CID;
        name: string;
    }): Promise<CID>;
}
export { IpfsFileSystem, IpfsFileSystemType, isIpfsFileSystemType };
//# sourceMappingURL=IpfsFileSystem.d.ts.map