import { IdReference } from "../id-reference-factory/index.js";
import { LogLevel } from "./LogLevels.js";
/**
 * Interface for a log entry
 * @category Logging
 */
interface ILogEntry {
    podId?: IdReference;
    processId?: IdReference;
    level?: LogLevel;
    timestamp: Date;
    message: string;
    error?: Error;
    print: (logLevel: LogLevel) => void;
}
/**
 * A class to represent a log entry
 * @category Logging
 */
declare class LogEntry implements ILogEntry {
    podId?: IdReference;
    processId?: IdReference;
    level?: LogLevel;
    timestamp: Date;
    message: string;
    error?: Error;
    constructor({ podId, processId, message, level, error, printLevel }: {
        podId?: IdReference;
        processId?: IdReference;
        message: string;
        level?: LogLevel | string;
        error?: Error;
        printLevel: LogLevel;
    });
    /**
     * Prints the log entry to the console
     */
    print: (printLevel: LogLevel) => void;
}
export { ILogEntry, LogEntry };
//# sourceMappingURL=LogEntry.d.ts.map