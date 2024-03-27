import { IdReference } from './IdReference';
import { PodId } from '../../models/moonbase/podId';
import { PodProcessType, isPodProcessType } from '../../models/moonbase/process';


class ProcessId extends IdReference {
    
}


/**
 * Class for a pod process id reference
 * @category PodProcess
 */
class PodProcessId
    extends PodId
{
    public podId: PodId;
    public type: PodProcessType;

    constructor({
        name,
        format,
        metadata,
        podId,
        type
    }: {
        podId: PodId,
        type?: PodProcessType,
        name?: string,
        format?: IdReferenceFormat | string,
        metadata?: Map<string, any>
    }) {
        super({
            name,
            metadata,
            format,
            podBayId: podId.podBayId
        });
        this.podId = podId;
        this.type = isPodProcessType(type);
    }
}

export {
    PodProcessId
}
