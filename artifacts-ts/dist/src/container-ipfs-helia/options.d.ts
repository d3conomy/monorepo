import { InstanceOptions } from "../container/options";
declare const defaultIpfsOptions: () => InstanceOptions;
/**
 * The options for creating an Ipfs process
 * @category IPFS
 */
declare class IpfsOptions extends InstanceOptions {
    constructor(options?: InstanceOptions);
    init(): void;
}
export { defaultIpfsOptions, IpfsOptions };
//# sourceMappingURL=options.d.ts.map