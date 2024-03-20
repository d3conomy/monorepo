import { Defaults } from "../../defaults";
import { PodProcessId } from "./processId";
import { PodProcessStage, PodProcessStatus } from "./processStatus";


/**
 * Lunar Pod Process Types
 * @category Process
 */
enum PodProcessType {
    DB = 'opendb',
    IPFS = 'ipfs',
    LIBP2P = 'libp2p',
    ORBITDB = 'orbitdb',
}

/**
 * Check if a string is a valid process type
 * @category Process
 */
const isPodProcessType = (type?: string): PodProcessType => {
    if (type === undefined) {
        return Defaults.moonbasePodProcessType
    }
    if (Object.values(PodProcessType).includes(type as PodProcessType)) {
        return type as PodProcessType;
    }
    throw new Error('Invalid process type');
}

class PodProcess {
    id: PodProcessId;
    status: PodProcessStatus;

    constructor({
        component,
        id,
        status
    }: {
        component?: PodProcessType,
        id?: PodProcessId,
        status?: PodProcessStatus
    } ={}) {
        this.id = id ? id : new PodProcessId({component});
        this.status = status ? status : new PodProcessStatus({stage: PodProcessStage.NEW})
    }

}


export {
    PodProcessType,
    isPodProcessType,
    PodProcess
}