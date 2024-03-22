import { DateReference } from "../modules/date";
import { MetaData } from "./metaData";




/**
 * Interface for a log entry
 * @category Logging
 */
interface ILogEntry {
    timestamp: DateReference;
    message: string;
    code?: ResponseCode;
    error?: Error;
    level?: LogLevel;
    metadata?: MetaData;

    toString: () => string;
    print: () => void;
}

class LogEntry implements ILogEntry {
    timestamp: DateReference;
    message: string;
    code?: ResponseCode;
    error?: Error;
    level?: LogLevel;
    metadata?: MetaData;

    constructor({
        message,
        level,
        code,
        error,
        metadata
    }: {
        message: string,
        level: LogLevel,
        code?: ResponseCode,
        error?: Error,
        metadata?: MetaData
    }) {
        this.timestamp = new DateReference();
        this.message = message;
        this.level = level;
        this.code = code;
        this.error = error;
        this.metadata = metadata;
    
    }

    toString() {
        return `${this.timestamp} - ${this.level} - ${this.message}`;
    }

    print() {
        console.log(this.toString());
    }
}

export {
    LogLevel,
    ResponseCode,
    ILogEntry,
    LogEntry
}