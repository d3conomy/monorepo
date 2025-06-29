/**
 * Types of processes that can be managed in a Pod
 * @category Process
 */
enum ProcessType {
    LIBP2P = "libp2p",
    IPFS = "ipfs", 
    ORBITDB = "orbitdb",
    DATABASE = "database",
    PUBSUB = "pubsub",
    FILESYSTEM = "filesystem"
}

/**
 * Type guard to check if a value is a valid ProcessType
 * @param value - The value to check
 * @returns True if the value is a ProcessType
 */
const isProcessType = (value: any): ProcessType => {
    if (Object.values(ProcessType).includes(value)) {
        return value as ProcessType;
    }
    throw new Error(`Invalid ProcessType: ${value}`);
};

export {
    ProcessType,
    isProcessType
};
