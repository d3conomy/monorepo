
/**
 * Enum for pod process types
 * @category Process
 */
enum PodProcessType {
    IPFS = 'ipfs',
    ORBITDB = 'orbitdb',
    DB = 'db',
    LIBP2P = 'libp2p',
}

/**
 * Enum for moonbase components
 * @category Moonbase
 */
enum MoonbaseComponents {
    Moonbase = 'moonbase',
    ApiServer = 'apiServer',
    PodBay = 'podBay',
    Pod = 'pod',
    IpfsProcess = PodProcessType.IPFS,
    OrbitDBProcess = PodProcessType.ORBITDB,
    OpenDBProcess = PodProcessType.DB,
    LibP2PProcess = PodProcessType.LIBP2P,
}

enum MoonbaseIdComponents {
    MoonbaseId = 'moonbaseId',
    PodBayId = 'podBayId',
    PodId = 'podId',
    PodProcessId = 'podProcessId',
}

const isComponentId = (id: string): boolean => {
    return Object.values(MoonbaseComponentIds).includes(id as MoonbaseComponentIds)
}


export {
    MoonbaseComponents,
    MoonbaseIdComponents,
    PodProcessType
}