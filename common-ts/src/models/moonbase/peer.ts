import { IdReference } from "../idReference";



class Peer {
    public id: IdReference;
    public multiaddrs: Array<string>;
    public protocols: Array<string>;

    constructor({
        id,
        multiaddrs,
        protocols
    }: {
        id: IdReference,
        multiaddrs: Array<string>,
        protocols: Array<string>
    }) {
        this.id = id;
        this.multiaddrs = multiaddrs;
        this.protocols = protocols;
    }
}

export {
    Peer
}