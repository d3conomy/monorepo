var ProcessType;
(function (ProcessType) {
    ProcessType["LIBP2P"] = "libp2p";
    ProcessType["IPFS"] = "ipfs";
    ProcessType["ORBITDB"] = "orbitdb";
    ProcessType["OPEN_DB"] = "open-db";
})(ProcessType || (ProcessType = {}));
const isProcessType = (value) => {
    if (Object.values(ProcessType).includes(value)) {
        return value;
    }
    throw new Error('Invalid process type');
};
export { ProcessType, isProcessType };
export * from './ProcessResponses.js';
export * from './ProcessStages.js';
