import { ILogEntry, LogEntry } from './LogEntry.js';
import { LogLevel } from './LogLevels.js';
/**
 * Interface for a log book
 * @category Logging
 */
interface ILogBook {
    name: string;
    entries: Map<number, ILogEntry>;
    printLevel: LogLevel;
    add: (entry: ILogEntry) => void;
    get: (id: number) => ILogEntry;
    delete: (id: number) => void;
    clear: () => void;
    getAll: () => Map<number, ILogEntry>;
    getPodHistory: (podId: string) => Map<number, ILogEntry>;
    getProcessHistory: (processId: string) => Map<number, ILogEntry>;
    getLast: (count: number) => Map<number, ILogEntry>;
}
/**
 * A class to manage an individual log book
 * @category Logging
 */
declare class LogBook implements ILogBook {
    name: string;
    entries: Map<number, LogEntry>;
    printLevel: LogLevel;
    constructor(name: string, printLevel?: LogLevel | string);
    /**
     * Adds an entry to the log book
     */
    add(entry: LogEntry): void;
    /**
     * Gets an entry from the log book
     */
    get(entryId: number): LogEntry;
    /**
     * Deletes an entry from the log book
     */
    delete(entryId: number): void;
    /**
     * Returns a map of all the entries
     */
    getAll(): Map<number, ILogEntry>;
    /**
     * Clears the entire log book
     */
    clear(): void;
    /**
     * Retrieve the last n entries from the log book
     */
    getLast(count?: number): Map<number, LogEntry>;
    /**
     * Returns a map of the history for the pod
     */
    getPodHistory(podId: string): Map<number, LogEntry>;
    /**
     * Returns a map of the history for the job
     */
    getProcessHistory(processId: string): Map<number, LogEntry>;
    /**
     * Returns a map of the history for the log level
     */
    getLevelHistory(level: LogLevel): Map<number, LogEntry>;
}
export { LogBook, ILogBook, };
//# sourceMappingURL=LogBook.d.ts.map