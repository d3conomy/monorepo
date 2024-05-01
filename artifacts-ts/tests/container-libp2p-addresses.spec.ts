import { expect } from "chai";
import { multiaddr, Multiaddr } from "@multiformats/multiaddr";
import { setListenAddresses, listenAddressesConfig, listenAddressesOptions } from "../src/container-libp2p/addresses.js";

describe("setListenAddresses", () => {
    it("should return an object with listen addresses", () => {
        const multiaddrs: Array<Multiaddr> = [
            multiaddr("/ip4/127.0.0.1/tcp/8080"),
            multiaddr("/ip6/::1/tcp/8080"),
        ];

        const result = setListenAddresses(multiaddrs);

        expect(result).to.deep.equal({
            listen: [
                "/ip4/127.0.0.1/tcp/8080",
                "/ip6/::1/tcp/8080",
            ],
        });
    });
});

describe("listenAddressesConfig", () => {
    it("should return an object with listen addresses based on instance options", () => {
        const instanceOptions = listenAddressesOptions();

        const result = listenAddressesConfig(instanceOptions);
 
        // Add your assertions here
    });
});
