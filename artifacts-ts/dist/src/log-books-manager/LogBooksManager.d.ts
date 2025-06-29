import { IdReference, IdReferenceFormats, IdReferenceTypes } from "../id-reference-factory/index.js";
import { ProcessStage } from "../process-interface/IProcess.js";
import { ResponseCode } from "../process-interface/logging.js";
import { ILogBook, LogBook } from "./LogBook.js";
import { ILogEntry, LogEntry } from "./LogEntry.js";
import { LogLevel } from "./LogLevels.js";
declare class LogBooksManagerConfig {
    dir: string;
    level: LogLevel;
    names: IdReferenceFormats;
}
/**
 * Interface for a log books manager
 * @category Logging
 */
interface ILogBooksManager {
    books: Map<string, ILogBook>;
    config: LogBooksManagerConfig;
    init: () => void;
    create: (name: string, printLevel: LogLevel) => void;
    get: (name: string) => ILogBook;
    delete: (name: string) => void;
    clear: () => void;
    getLastEntries: (items: number) => Map<string, ILogEntry>;
}
/**
 * A class to manage the system's collection of log books
 * @category Logging
 */
declare class LogBooksManager implements ILogBooksManager {
    books: Map<string, LogBook>;
    config: LogBooksManagerConfig;
    constructor({ books, dir, level, names }?: {
        books?: Map<string, LogBook>;
        dir?: string;
        level?: LogLevel | string;
        names?: IdReferenceFormats | string;
    });
    /**
     * Initializes the log books manager
     */
    init(): void;
    /**
     * Creates a new log book and adds it to the collection
     */
    create(logBookName: string, printLevel?: LogLevel): void;
    /**
     * Gets a log book from the collection
     */
    get(name: string): LogBook;
    /**
     * Deletes a log book from the collection
     */
    delete(name: string): void;
    /**
     * Clears all the log books
     */
    clear(): void;
    /**
     * Returns a map of all the entries
     */
    getLastEntries(item?: number): Map<string, LogEntry>;
}
/**
 * The log books manager
 * @category Logging
 * @example
 * const logBooksManager = new LogBooksManager();
 * logBooksManager.create("system");
 * logBooksManager.get("system");
 */
declare const logBooksManager: LogBooksManager;
/**
 * Log a message to the console
 * @category Logging
 * @example
 * logger({
 *     name: "system",
 *     level: LogLevel.INFO,
 *     code: ResponseCode.OK,
 *     stage: ProcessStage.START,
 *     message: "System started",
 *     error: undefined,
 *     processId: undefined,
 *     podId: undefined
 * });
 */
declare const logger: ({ name, level, code, stage, message, error, processId, podId }: {
    name?: string | undefined;
    level?: LogLevel | undefined;
    message: string;
    code?: ResponseCode | undefined;
    stage?: string | undefined;
    error?: Error | undefined;
    processId?: IdReference<IdReferenceTypes> | undefined;
    podId?: IdReference<IdReferenceTypes> | undefined;
}) => void;
/**
 * Get the log book by name
 * @category Logging
 * @example
 * const logBook = getLogBook("system");
 */
declare const getLogBook: (logBookName: string) => LogBook;
export { ILogBooksManager, LogBooksManager, LogBooksManagerConfig, logBooksManager, logger, getLogBook };
//# sourceMappingURL=LogBooksManager.d.ts.map