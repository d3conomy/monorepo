import { IdReferenceFormats, IdReferenceTypes, isIdReferenceFormat } from "../id-reference-factory/index.js";
import { LogBook } from "./LogBook.js";
import { LogEntry } from "./LogEntry.js";
import { LogLevel, isLogLevel } from "./LogLevels.js";
class LogBooksManagerConfig {
    dir = "logs";
    level = LogLevel.INFO;
    names = IdReferenceFormats.NAME;
}
/**
 * A class to manage the system's collection of log books
 * @category Logging
 */
class LogBooksManager {
    /* The collection of log books */
    books;
    /* The log books manager configuration */
    config = new LogBooksManagerConfig();
    constructor({ books, dir, level, names } = {}) {
        this.books = books ? books : new Map();
        this.config.dir = dir ? dir : this.config.dir;
        this.config.level = isLogLevel(level) ? isLogLevel(level) : this.config.level;
        this.config.names = names ? isIdReferenceFormat(names) : this.config.names;
    }
    /**
     * Initializes the log books manager
     */
    init() {
        this.create(IdReferenceTypes.SYSTEM);
    }
    /**
     * Creates a new log book and adds it to the collection
     */
    create(logBookName, printLevel = this.config.level) {
        if (this.books.has(logBookName)) {
            throw new Error("Log book already exists");
        }
        const newLogBook = new LogBook(logBookName, printLevel);
        this.books.set(newLogBook.name, newLogBook);
    }
    /**
     * Gets a log book from the collection
     */
    get(name) {
        const logBook = this.books.get(name);
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
    delete(name) {
        this.books.delete(name);
    }
    /**
     * Clears all the log books
     */
    clear() {
        for (const logBook of this.books.values()) {
            logBook.clear();
            this.books.delete(logBook.name);
        }
    }
    /**
     * Returns a map of all the entries
     */
    getLastEntries(item = 10) {
        let allEntries = new Map();
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
const logger = ({ name, level, 
// code,
// stage,
message, error, processId, podId }) => {
    let logBook;
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
    const entry = new LogEntry({
        printLevel: logBooksManager.config.level,
        level: level ? level : LogLevel.INFO,
        // code: code,
        // stage: stage,
        message: message,
        error: error,
        podId: podId,
        processId: processId
    });
    logBook.add(entry);
};
/**
 * Get the log book by name
 * @category Logging
 * @example
 * const logBook = getLogBook("system");
 */
const getLogBook = (logBookName) => {
    return logBooksManager.get(logBookName);
};
export { LogBooksManager, LogBooksManagerConfig, logBooksManager, logger, getLogBook };
