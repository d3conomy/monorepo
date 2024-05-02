import { Libp2pOptions } from "libp2p";
import { InstanceOptions } from "../container/options.js";
declare const defaultLibp2pOptions: () => InstanceOptions;
declare const createSubProcesses: (options?: InstanceOptions) => Promise<Libp2pOptions>;
export { defaultLibp2pOptions, createSubProcesses };
//# sourceMappingURL=options.d.ts.map