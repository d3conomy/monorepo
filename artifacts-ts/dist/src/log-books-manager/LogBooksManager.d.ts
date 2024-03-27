import { IdReference } from "../id-reference-factory/index.js";
import { ProcessStage, ResponseCode } from "../process-interface/index.js";
import { ILogBook, LogBook } from "./LogBook.js";
import { ILogEntry, LogEntry } from "./LogEntry.js";
import { LogLevel } from "./LogLevels.js";
/**
 * Interface for a log books manager
 * @category Logging
 */
interface ILogBooksManager {
    books: Map<string, ILogBook>;
    printLevel: LogLevel | string;
    init: (config: {
        dir: string;
        level: string;
        names: string;
    }) => void;
    create: (name: string, printLevel: LogLevel) => void;
    get: (name: string) => ILogBook;
    delete: (name: string) => void;
    clear: () => void;
    getAllEntries: () => Map<number, ILogEntry>;
}
/**
 * A class to manage the system's collection of log books
 * @category Logging
 */
declare class LogBooksManager implements ILogBooksManager {
    books: Map<string, LogBook>;
    printLevel: LogLevel | string;
    dir: string;
    constructor();
    /**
     * Initializes the log books manager
     */
    init({ dir, level }?: {
        dir?: string;
        level?: string;
    }): void;
    /**
     * Creates a new log book and adds it to the collection
     */
    create(logBookName: string): void;
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
    getAllEntries(item?: number): Map<number, LogEntry>;
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
    processId?: IdReference | undefined;
    podId?: IdReference | undefined;
}) => void;
/**
 * Get the log book by name
 * @category Logging
 * @example
 * const logBook = getLogBook("system");
 */
declare const getLogBook: (logBookName: string) => LogBook;
export { logBooksManager, logger, getLogBook, ILogBooksManager, LogBooksManager };
//# sourceMappingURL=LogBooksManager.d.ts.map