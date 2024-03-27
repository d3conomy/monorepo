import { IdReference, IdReferenceTypes } from "../id-reference-factory/index.js";
import { ProcessStage, ResponseCode } from "../process-interface/index.js";
import { ILogBook, LogBook } from "./LogBook.js";
import { ILogEntry, LogEntry } from "./LogEntry.js";
import { LogLevel, isLogLevel } from "./LogLevels.js";

/**
 * Interface for a log books manager
 * @category Logging
 */
interface ILogBooksManager {
    books: Map<string, ILogBook>;
    printLevel: LogLevel | string;

    init: (config: {
        dir: string,
        level: string,
        names: string
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
class LogBooksManager 
    implements ILogBooksManager
{
    /* The collection of log books */
    public books: Map<string, LogBook> = new Map<string, LogBook>();

    /* The log level to print */
    public printLevel: LogLevel | string = 'info';

    /* The directory to store the log files 
    * TODO: Implement file storage
    */
    public dir: string = "";

    public constructor() {
        this.books = new Map<string, LogBook>();
        this.printLevel = 'info';
    }

    /**
     * Initializes the log books manager
     */
    public init({
        dir,
        level
    }: {
        dir?: string,
        level?: string
    } = {}) {
        this.printLevel = isLogLevel(level)
        this.dir = dir ? dir : "";
        this.create(IdReferenceTypes.SYSTEM);
    }

    /**
     * Creates a new log book and adds it to the collection
     */
    public create(
        logBookName: string,
    ) {
        // if (this.books.has(logBookName)) {
        //     throw new Error("Log book already exists");
        // }
        
        const newLogBook = new LogBook(logBookName, this.printLevel);
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
        }
    }

    /**
     * Returns a map of all the entries
     */
    public getAllEntries(item: number = 10): Map<number, LogEntry> {
        let allEntries: Map<number, LogEntry> = new Map<number, LogEntry>();
        for (const logBook of this.books.values()) {
            const entries = logBook.getLast(item);
            entries.forEach((entry, key) => {
                allEntries.set(key, entry);
            });
            
            // sort the entries by timestamp
            allEntries = new Map([...allEntries.entries()].sort((a, b) => {
                return a[1].timestamp.getTime() - b[1].timestamp.getTime();
            }));
        }
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
        printLevel: logBooksManager.printLevel,
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
    logBooksManager,
    logger,
    getLogBook,
    ILogBooksManager,
    LogBooksManager
}