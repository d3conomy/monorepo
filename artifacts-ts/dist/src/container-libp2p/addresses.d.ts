import { Multiaddr } from "@multiformats/multiaddr";
import { InstanceOptions } from '../container/options.js';
declare const setListenAddresses: (multiaddrs: Array<Multiaddr>) => {
    listen: Array<string>;
};
declare const listenAddressesOptions: () => InstanceOptions;
declare const listenAddresses: (options: InstanceOptions) => {
    listen: Array<string>;
};
export { setListenAddresses, listenAddresses as listenAddressesConfig, listenAddressesOptions };
//# sourceMappingURL=addresses.d.ts.map