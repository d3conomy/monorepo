import { ILogEntry, LogEntry, LogLevel } from '../log';
import { MetaData } from '../metaData';
import { JobId } from './jobId';
import { PodProcessStatus } from './processStatus';

class ProcessLogEntry 
    extends LogEntry    
    implements ILogEntry
{
    jobId?: JobId;
    status?: PodProcessStatus;

    constructor({
        message,
        level,
        jobId,
        status,
        metadata
    }: {
        message: string,
        level: LogLevel,
        jobId: JobId,
        status: PodProcessStatus
        metadata?: MetaData
    }) {
        super({message, level, metadata});
        this.jobId = jobId;
        this.status = status;
    }
}

export {
    ProcessLogEntry
}