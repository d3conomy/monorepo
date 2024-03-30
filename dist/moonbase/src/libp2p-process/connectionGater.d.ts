/**
 * Default Connection Gater libp2p options
 * @category Libp2p
 */
declare const connectionGater: ({ enableDenyDialMultiaddr, denyDialMultiaddr }: {
    enableDenyDialMultiaddr: boolean;
    denyDialMultiaddr: boolean;
}) => any;
export { connectionGater };
