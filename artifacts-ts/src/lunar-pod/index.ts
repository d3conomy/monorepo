import { Libp2p } from 'libp2p';
import { GossipSubContainer } from '../container-libp2p-pubsub/index.js';
import { Libp2pContainer } from '../container-libp2p/index.js';
import { Commands } from '../container/commands.js';
import { Container } from '../container/index.js';
import { InstanceType, InstanceTypes } from '../container/instance.js';
import { InstanceOptions } from '../container/options.js';
import { ContainerId, PodId } from '../id-reference-factory/IdReferenceClasses.js';
import { ContainerTemplate, PodTemplate } from '../manifest/templatesV1.js';
import { LunarPodOptions, lunarPodOptions } from './options.js';
// import { Stack, StackType } from './stack.js';
import { IdReferenceFactory } from '../id-reference-factory/IdReferenceFactory.js';
import { DatabaseStack, GossipSubStack, IpfsFileSystemStack, StackType, StackTypes } from './stack.js';
import { OpenDbOptions } from '../container-orbitdb-open/options.js';



// Define the Pod class
class Pod
{
    private containers: StackType;
    private options: LunarPodOptions;
    private readonly idReferenceFactory: IdReferenceFactory; 
    public readonly id: PodId;
    // public readonly template?: PodTemplate;

    constructor(id: PodId, idReferenceFactory: IdReferenceFactory, options: LunarPodOptions)
    {
        this.id = id;
        this.options = new LunarPodOptions(options, true);

        const podStackType = options.get('podStackType');

        const ids = [];

        switch (podStackType) {
            case 'database':
                ids.push(idReferenceFactory.createIdReference({type: InstanceTypes.Libp2p}))
                ids.push(idReferenceFactory.createIdReference({type: InstanceTypes.IPFS}))
                ids.push(idReferenceFactory.createIdReference({type: InstanceTypes.OrbitDb}))

                const dbOptions: OpenDbOptions[] = options.get('openDbOptions')
                if (!dbOptions) {
                    options.set('openDbOptions', [new OpenDbOptions()])
                    ids.push(idReferenceFactory.createIdReference({type: InstanceTypes.Database, name: options.get('databaseName')}))
                }
                for (const option in dbOptions) {
                    ids.push(idReferenceFactory.createIdReference({type: InstanceTypes.Database, name: options.get('databaseName')}))
                }
                this.containers = new DatabaseStack(ids, options);
                break;
            case 'gossipsub':
                ids.push(idReferenceFactory.createIdReference({type: InstanceTypes.Libp2p}))
                ids.push(idReferenceFactory.createIdReference({type: InstanceTypes.Pub_Sub}))
                this.containers = new GossipSubStack(ids, options);
                break;
            case 'ipfs-filesystem':
                ids.push(idReferenceFactory.createIdReference({type: InstanceTypes.Libp2p}))
                ids.push(idReferenceFactory.createIdReference({type: InstanceTypes.IPFS}))
                ids.push(idReferenceFactory.createIdReference({type: InstanceTypes.File_System}))
                this.containers = new IpfsFileSystemStack(ids, options);
                break;
            default:
                throw new Error(`Invalid Pod Stack Type: ${podStackType}`);
        }

        this.idReferenceFactory = idReferenceFactory;
    }

    async init(): Promise<void>
    {
        await this.containers.init();
    }
}

export { Pod };