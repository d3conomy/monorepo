import { DateReference } from "./date";
import { MetaData } from "./metaData";

/**
 * Log Level
 * @category Logging
 * @description Log levels - determine the severity of the log entry
 */
enum LogLevel {
    Debug = 0,
    Info = 1,
    Warning = 2,
    Error = 3,
    Fatal = 4
}

/**
 * Response Codes
 * @category Logging
 */
enum ResponseCode {
    OK = 200,
    Created = 201,
    Accepted = 202,
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    MethodNotAllowed = 405,
    InternalServerError = 500,
    NotImplemented = 501,
    BadGateway = 502,
    ServiceUnavailable = 503,
    GatewayTimeout = 504,
}


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

    constructor(
        message: string,
        level: LogLevel = LogLevel.Info,
        code?: ResponseCode,
        error?: Error,
        metadata?: MetaData
    ) {
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