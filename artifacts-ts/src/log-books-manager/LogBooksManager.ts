import { IdReference, IdReferenceFormats, IdReferenceTypes, isIdReferenceFormat } from "../id-reference-factory/index.js";
import { ProcessStage } from "../process-interface/IProcess.js";
import { ResponseCode } from "../process-interface/logging.js";
import { ILogBook, LogBook } from "./LogBook.js";
import { ILogEntry, LogEntry } from "./LogEntry.js";
import { LogLevel, isLogLevel } from "./LogLevels.js";

class LogBooksManagerConfig {
    dir: string = "logs";
    level: LogLevel = LogLevel.INFO;
    names: IdReferenceFormats = IdReferenceFormats.NAME;
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
class LogBooksManager 
    implements ILogBooksManager
{
    /* The collection of log books */
    public books: Map<string, LogBook>;

    /* The log books manager configuration */
    public config = new LogBooksManagerConfig();

    public constructor({
        books,
        dir,
        level,
        names
    }: {
        books?: Map<string, LogBook>,
        dir?: string,
        level?: LogLevel | string,
        names?: IdReferenceFormats | string
    } = {}) {
        this.books = books ? books : new Map<string, LogBook>();
        this.config.dir = dir ? dir : this.config.dir;
        this.config.level = isLogLevel(level) ? isLogLevel(level) : this.config.level;
        this.config.names = names ? isIdReferenceFormat(names) : this.config.names;
    }

    /**
     * Initializes the log books manager
     */
    public init() {
        this.create(IdReferenceTypes.SYSTEM);
    }

    /**
     * Creates a new log book and adds it to the collection
     */
    public create(
        logBookName: string,
        printLevel: LogLevel = this.config.level
    ) {
        if (this.books.has(logBookName)) {
            throw new Error("Log book already exists");
        }

        const newLogBook = new LogBook(logBookName, printLevel);
        this.books.set(newLogBook.name, newLogBook);
    }

    /**
     * Gets a log book from the collection
     */
    public get(
        name: string
    ): LogBook {
        const logBook: LogBook | undefined = this.books.get(name);
        if (logBook) {
            return logBook;
        }
        else {
            throw new Error("Log book not found");
        }
    }

    /**
     * Deletes a log book from the collection
     */
    public delete(
        name: string
    ) {
        this.books.delete(name);
    }

    /**
     * Clears all the log books
     */
    public clear() {
        for (const logBook of this.books.values()) {
            logBook.clear();
            this.books.delete(logBook.name);
        }
    }

    /**
     * Returns a map of all the entries
     */
    public getLastEntries(item: number = 10): Map<string, LogEntry> {
        let allEntries: Map<string, LogEntry> = new Map<string, LogEntry>();
        for (const logBook of this.books.values()) {
            
            const entries = logBook.getLast(item);
            entries.forEach((entry, key) => {
                allEntries.set(`${logBook.name}-${key}`, entry);
            });
        }
        // sort the entries by timestamp
        allEntries = new Map([...allEntries.entries()].sort((a, b) => {
            return a[1].timestamp.getTime() - b[1].timestamp.getTime();
        }));

        return allEntries;
    }
}


/**
 * The log books manager
 * @category Logging
 * @example
 * const logBooksManager = new LogBooksManager();
 * logBooksManager.create("system");
 * logBooksManager.get("system");
 */
const logBooksManager = new LogBooksManager();

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
const logger = ({
    name,
    level,
    code,
    stage,
    message,
    error,
    processId,
    podId
}: {
    name?: string,
    level?: LogLevel,
    message: string,
    code?: ResponseCode,
    stage?: ProcessStage | string,
    error?: Error,
    processId?: IdReference,
    podId?: IdReference
}) => {
    let logBook: LogBook;

    if (!name) {
        name = IdReferenceTypes.SYSTEM;
    }

    try {
        logBook = logBooksManager.get(name);
    }
    catch (error) {
        logBooksManager.create(name);
    }

    logBook = logBooksManager.get(name);

    const entry: LogEntry = new LogEntry({
        printLevel: logBooksManager.config.level,
        level: level ? level : LogLevel.INFO,
        code: code,
        stage: stage,
        message: message,
        error: error,
        podId: podId,
        processId: processId
    })
    logBook.add(entry);
}

/**
 * Get the log book by name
 * @category Logging
 * @example
 * const logBook = getLogBook("system");
 */
const getLogBook = (logBookName: string): LogBook => {
    return logBooksManager.get(logBookName);
}

export {
    ILogBooksManager,
    LogBooksManager,
    LogBooksManagerConfig,
    logBooksManager,
    logger,
    getLogBook
}