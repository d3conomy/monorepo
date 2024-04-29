import { IdReference } from "../id-reference-factory/index.js";
// import { ProcessStage, ResponseCode } from "../process-interface/index.js";
import { LogLevel, isLogLevel } from "./LogLevels.js";



/**
 * Interface for a log entry
 * @category Logging
 */
interface ILogEntry {
    podId?: IdReference;
    processId?: IdReference;
    level?: LogLevel;
    // code?: ResponseCode;
    // stage?: ProcessStage | string;
    timestamp: Date;
    message: string;
    error?: Error;

    print: (logLevel: LogLevel) => void;
}

/**
 * A class to represent a log entry
 * @category Logging
 */
class LogEntry
    implements ILogEntry
{
    public podId?: IdReference;
    public processId?: IdReference;
    public level?: LogLevel;
    // public code?: ResponseCode;
    // public stage?: ProcessStage | string;
    public timestamp: Date;
    public message: string;
    public error?: Error;

    public constructor({
        podId,
        processId,
        message,
        level,
        // code,
        // stage,
        error,
        printLevel
    }: {
        podId?: IdReference,
        processId?: IdReference
        message: string,
        level?: LogLevel | string,
        // code?: ResponseCode,
        // stage?: ProcessStage | string,
        error?: Error
        printLevel: LogLevel
    })  {
        this.podId = podId;
        this.processId = processId;
        this.message = message;
        this.level = level ? isLogLevel(level) : LogLevel.INFO;
        // this.code = code;
        // this.stage = stage;
        this.timestamp = new Date();
        this.error = error;

        this.print(printLevel);
    }

    /**
     * Prints the log entry to the console
     */
    public print = (printLevel: LogLevel): void => {
        const timestamp = this.timestamp.toUTCString();
        const output = `[${timestamp}] ${this.message}`;
        
        switch (this.level) {
            case LogLevel.ERROR:
                if (
                    printLevel === LogLevel.ERROR ||
                    printLevel === LogLevel.WARN ||
                    printLevel === LogLevel.INFO ||
                    printLevel === LogLevel.DEBUG
                ) {
                    console.error(output);
                }
                break;

            case LogLevel.WARN:
                if (
                    printLevel === LogLevel.WARN ||
                    printLevel === LogLevel.INFO ||
                    printLevel === LogLevel.DEBUG
                ) {
                    console.warn(output);
                }
                break;

            case LogLevel.INFO:
                if (
                    printLevel === LogLevel.INFO ||
                    printLevel === LogLevel.DEBUG
                ) {
                    console.log(output);
                }
                break;

            case LogLevel.DEBUG:
                if (
                    printLevel === LogLevel.DEBUG
                ) {
                    console.debug(output);
                }
                break;
                

            default:
                console.log(output);
                break;
        }
    }
}

export {
    ILogEntry,
    LogEntry
}