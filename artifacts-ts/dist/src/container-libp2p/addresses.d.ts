import { Multiaddr } from "@multiformats/multiaddr";
import { InstanceOptionsList } from "../container/options";
declare const setListenAddresses: (multiaddrs: Array<Multiaddr>) => {
    listen: Array<string>;
};
declare const listenAddressesOptions: () => Partial<InstanceOptionsList>;
declare const listenAddresses: (instanceOptions: InstanceOptionsList) => {
    listen: Array<string>;
};
export { setListenAddresses, listenAddresses as listenAddressesConfig, listenAddressesOptions };
//# sourceMappingURL=addresses.d.ts.map