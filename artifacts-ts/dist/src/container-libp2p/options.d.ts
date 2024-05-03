import { Libp2pOptions } from "libp2p";
import { InstanceOptions } from "../container/options.js";
declare const defaultLibp2pOptions: () => InstanceOptions;
declare const createLibp2pOptions: (options?: InstanceOptions) => Promise<Libp2pOptions>;
export { defaultLibp2pOptions, createLibp2pOptions };
//# sourceMappingURL=options.d.ts.map