
import { createHelia, HeliaLibp2p,} from "helia";
import { Libp2p } from "libp2p";


import { IProcess, Process } from "../process-interface/process.js";
import { IProcessContainer, createProcessContainer } from "../process-interface/processContainer.js";
import { ProcessType } from "../process-interface/processTypes.js";
import { IProcessOption, IProcessOptionsList } from "../process-interface/processOptions.js";
import { IProcessCommand } from "../process-interface/processCommand.js";
import { ipfsCommands } from "./commands.js";
import { PodProcessId } from "../id-reference-factory/IdReferenceClasses.js";
import { ipfsOptions } from "./options.js";

// class HeliaLibp2pProcess extends HeliaLibp2p {

// }
/**
 * Create an IPFS process
 * @category IPFS
 */
const createIpfsInstance = async (
    instanceOptions: Array<IProcessOption>
): Promise<HeliaLibp2p<Libp2p>> => {
    const helia: HeliaLibp2p<Libp2p> = await createHelia({
        libp2p: instanceOptions.find(option => option.name === 'libp2p')?.value as Libp2p,
        blockstore: instanceOptions.find(option => option.name === 'blockstore')?.value,
        datastore: instanceOptions.find(option => option.name === 'datastore')?.value,
        start: instanceOptions.find(option => option.name === 'start')?.value
    })
    return helia as HeliaLibp2p<Libp2p>
}


/**
 * The process container for the IPFS process
 * 
 * Helia is used as the IPFS process
 * @category IPFS
 */
class IpfsProcess
    extends Process
    implements IProcess
{
    /**
     * Constructor for the Ipfs process
     */
    constructor({
        id,
        container,
        options,
        commands
    }: {
        id: PodProcessId,
        container?: IProcessContainer,
        options?: Array<IProcessOption>,
        commands?: Array<IProcessCommand>
    }) {
        if (container?.instance === undefined) {
            if (options === undefined) {
                options = ipfsOptions()
            }

            const init = async (
                processOptions: IProcessOptionsList | undefined
            ): Promise<HeliaLibp2p<Libp2p>> => {
                if (processOptions === undefined) {
                    throw new Error(`No IPFS options found, include a libp2p process in the options`)
                }
                return await createIpfsInstance(processOptions)
            }

            container = createProcessContainer<ProcessType.IPFS>({
                type: ProcessType.IPFS,
                instance: undefined,
                options,
                init
            })
        }
        super(
            id, 
            container,
            commands ? commands : ipfsCommands
        )
    }

    public async stop(): Promise<void> {
        this.jobQueue.stop()
        this.container?.instance?.stop()
    }
}

const createIpfsProcess = async (
    id: PodProcessId,
    options: Array<IProcessOption>,
): Promise<IpfsProcess> => {
    const process = new IpfsProcess({
        id,
        options,
        commands: ipfsCommands
    })

    await process.init()

    return process
}

export {
    createIpfsInstance,
    createIpfsProcess,
    IpfsProcess
}

