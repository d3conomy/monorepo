import { IdReference } from '../idReference';
import { ILogEntry, LogEntry, LogLevel } from '../log';
import { MetaData } from '../metaData';
import { PodProcessIdReference } from './processId';
import { PodProcessStatus } from './processStatus';

class ProcessLogEntry 
    extends LogEntry    
    implements ILogEntry
{
    podId?: IdReference;
    processId?: PodProcessIdReference;
    status?: PodProcessStatus;

    constructor({
        message,
        level,
        podId,
        processId,
        status,
        metadata
    }: {
        message: string,
        level: LogLevel,
        podId: IdReference,
        processId: PodProcessIdReference,
        status: PodProcessStatus
        metadata?: MetaData
    }) {
        super(message, level);
        this.podId = podId;
        this.processId = processId;
        this.status = status;
    }
}

export {
    ProcessLogEntry
}