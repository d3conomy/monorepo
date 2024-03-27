import { DateReference } from '../../modules/date';
import { MetaData } from '../metaData';

/**
 * Lunar Pod Process Stages
 * @category Process
 */
enum PodProcessStage {
    NEW = 'new',
    INIT = 'init',
    STARTED = 'started',
    STARTING = 'starting',
    PENDING = 'pending',
    COMPLETED = 'completed',
    STOPPING = 'stopping',
    STOPPED = 'stopped',
    ERROR = 'error',
    WARNING = 'warning',
    UNKNOWN = 'unknown',
}

/**
 * Check if a string is a valid process stage
 * @category Process
 */
const isPodProcessStage = (stage: string): PodProcessStage => {
    if (Object.values(PodProcessStage).includes(stage as PodProcessStage)) {
        return stage as PodProcessStage;
    }
    else if (stage === undefined) {
        return PodProcessStage.UNKNOWN;
    }
    throw new Error('Invalid process stage');
}

/**
 * Class for a process status
 * @category Process
 */
class PodProcessStatus {
    public stage: PodProcessStage;
    public readonly dateCreated: DateReference;
    public dateUpdated?: DateReference;
    public dateDeleted?: DateReference;
    public deleted?: boolean;
    public metadata?: MetaData;

    constructor({
        stage,
        dateUpdated,
        dateDeleted,
        deleted,
        metadata
    }: {
        stage: PodProcessStage,
        dateUpdated?: DateReference,
        dateDeleted?: DateReference,
        deleted?: boolean,
        metadata?: MetaData
    }) {
        this.stage = isPodProcessStage(stage);
        this.dateCreated = new DateReference();
        this.dateUpdated = dateUpdated ? dateUpdated : new DateReference();
        this.dateDeleted = dateDeleted;
        this.deleted = deleted;
        this.metadata = metadata;
    }
}



export {
    PodProcessStage,
    isPodProcessStage,
    PodProcessStatus
}