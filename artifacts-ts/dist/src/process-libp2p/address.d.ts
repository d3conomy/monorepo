import { Multiaddr } from "@multiformats/multiaddr";
import { IProcessOptionsList } from "../process-interface/index.js";
declare const setListenAddresses: (multiaddrs: Array<Multiaddr>) => {
    listen: Array<string>;
};
declare const listenAddressesOptions: () => IProcessOptionsList;
declare const listenAddresses: ({ ...values }: {
    [x: string]: any;
}) => {
    listen: Array<string>;
};
export { setListenAddresses, listenAddresses as listenAddressesConfig, listenAddressesOptions };
//# sourceMappingURL=address.d.ts.map