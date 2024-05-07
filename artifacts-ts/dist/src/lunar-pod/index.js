import { InstanceTypes } from '../container/instance.js';
import { LunarPodOptions } from './options.js';
import { DatabaseStack, GossipSubStack, IpfsFileSystemStack } from './stack.js';
import { OpenDbOptions } from '../container-orbitdb-open/options.js';
// Define the Pod class
class Pod {
    containers;
    options;
    idReferenceFactory;
    id;
    // public readonly template?: PodTemplate;
    constructor(id, idReferenceFactory, options) {
        this.id = id;
        this.options = new LunarPodOptions(options, true);
        const podStackType = options.get('podStackType');
        const ids = [];
        switch (podStackType) {
            case 'database':
                ids.push(idReferenceFactory.createIdReference({ type: InstanceTypes.Libp2p }));
                ids.push(idReferenceFactory.createIdReference({ type: InstanceTypes.IPFS }));
                ids.push(idReferenceFactory.createIdReference({ type: InstanceTypes.OrbitDb }));
                const dbOptions = options.get('openDbOptions');
                if (!dbOptions) {
                    options.set('openDbOptions', [new OpenDbOptions()]);
                    ids.push(idReferenceFactory.createIdReference({ type: InstanceTypes.Database, name: options.get('databaseName') }));
                }
                for (const option in dbOptions) {
                    ids.push(idReferenceFactory.createIdReference({ type: InstanceTypes.Database, name: options.get('databaseName') }));
                }
                this.containers = new DatabaseStack(ids, options);
                break;
            case 'gossipsub':
                ids.push(idReferenceFactory.createIdReference({ type: InstanceTypes.Libp2p }));
                ids.push(idReferenceFactory.createIdReference({ type: InstanceTypes.Pub_Sub }));
                this.containers = new GossipSubStack(ids, options);
                break;
            case 'ipfs-filesystem':
                ids.push(idReferenceFactory.createIdReference({ type: InstanceTypes.Libp2p }));
                ids.push(idReferenceFactory.createIdReference({ type: InstanceTypes.IPFS }));
                ids.push(idReferenceFactory.createIdReference({ type: InstanceTypes.File_System }));
                this.containers = new IpfsFileSystemStack(ids, options);
                break;
            default:
                throw new Error(`Invalid Pod Stack Type: ${podStackType}`);
        }
        this.idReferenceFactory = idReferenceFactory;
    }
    async init() {
        await this.containers.init();
    }
}
export { Pod };
