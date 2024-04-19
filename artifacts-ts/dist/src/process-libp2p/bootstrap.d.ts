import { Multiaddr } from '@multiformats/multiaddr';
import { IProcessOptions } from '../process-interface/index.js';
declare const bootstrapOptions: IProcessOptions;
declare const libp2pBootstrap: ({ defaultConfig, multiaddrs, list }?: {
    defaultConfig?: boolean | undefined;
    multiaddrs?: (string | Multiaddr)[] | undefined;
    list?: boolean | undefined;
}) => any;
export { libp2pBootstrap, bootstrapOptions };
//# sourceMappingURL=bootstrap.d.ts.map