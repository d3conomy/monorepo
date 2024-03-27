import { IdReference } from "../idReference";



interface Peer {
    id: IdReference;
    multiaddrs: Array<string>;
    protocols: Array<string>;
}

export {
    Peer
}