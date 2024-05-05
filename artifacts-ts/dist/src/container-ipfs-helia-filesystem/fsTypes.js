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
export { IpfsFileSystemType, isIpfsFileSystemType };
