
enum IpfsFileSystemType {
    UNIXFS = "unixfs"
}

const isIpfsFileSystemType = (value: any): IpfsFileSystemType => {
    if (Object.values(IpfsFileSystemType).includes(value)) {
        return value as IpfsFileSystemType;
    }
    throw new Error('Invalid IPFS file system type');
}

export {
    IpfsFileSystemType,
    isIpfsFileSystemType
}