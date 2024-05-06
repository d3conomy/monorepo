import { InstanceOptions } from "../container/options.js";
declare const ipfsOptions: () => InstanceOptions;
/**
 * The options for creating an Ipfs process
 * @category IPFS
 */
declare class IpfsOptions extends InstanceOptions {
    constructor(options: InstanceOptions, defaults?: boolean);
    init(): void;
}
export { ipfsOptions, IpfsOptions };
//# sourceMappingURL=options.d.ts.map