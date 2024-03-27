
import { IdReferenceTypes } from '../id-reference-factory/IdReferenceConstants.js';
import { ILogEntry, LogEntry } from './LogEntry.js';
import { LogLevel, isLogLevel } from './LogLevels.js';


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
class LogBook
    implements ILogBook
{
    public name: string;
    public entries: Map<number, LogEntry>;
    public printLevel: LogLevel;

    public constructor(name: string, printLevel: LogLevel | string = "info") {
        this.name = name
        this.printLevel = isLogLevel(printLevel);
        this.entries = new Map<number, LogEntry>();
    }

    /**
     * Adds an entry to the log book
     */
    public add(entry: LogEntry):  void {

        const counter = this.entries.size + 1;
        this.entries.set(counter, entry);
    }

    /**
     * Gets an entry from the log book
     */
    public get(entryId: number): LogEntry {
        const entry: LogEntry | undefined = this.entries.get(entryId);
        if (entry) {
            return entry;
        }
        else {
            throw new Error("Entry not found");
        }
    }

    /**
     * Deletes an entry from the log book
     */
    public delete(entryId: number): void {
        this.entries.delete(entryId);
    }

    /**
     * Returns a map of all the entries
     */
    public getAll(): Map<number, ILogEntry> {
        return this.entries;
    }

    /**
     * Clears the entire log book
     */
    public clear(): void {
        this.entries = new Map<number, LogEntry>();
    }

    /**
     * Retrieve the last n entries from the log book
     */
    public getLast(count: number = 1): Map<number, LogEntry> {
        let lastEntries: Map<number, LogEntry> = new Map<number, LogEntry>();
        let historyArray = Array.from(this.entries);
        let lastEntriesArray = historyArray.slice(-count);
        lastEntriesArray.forEach((entry) => {
            lastEntries.set(entry[0], entry[1]);
        });
        return lastEntries;
    }

    /**
     * Returns a map of the history for the pod
     */
    public getPodHistory(podId: string): Map<number, LogEntry> {
        let podHistory: Map<number, LogEntry> = new Map<number, LogEntry>();
        this.entries.forEach((entry, key) => {
            if (
                entry.podId?.name === podId &&
                entry.podId?.metadata?.has("type") &&
                entry.podId?.metadata.get('type') === `${IdReferenceTypes.POD}`
            ) {
                podHistory.set(key, entry);
            }
        });
        return podHistory;
    }

    /**
     * Returns a map of the history for the job
     */
    public getProcessHistory(processId: string): Map<number, LogEntry> {
        let jobHistory: Map<number, LogEntry> = new Map<number, LogEntry>();
        this.entries.forEach((entry, key) => {
            if (entry.processId?.name === processId) {
                jobHistory.set(key, entry);
            }
        });
        return jobHistory;
    }

    /**
     * Returns a map of the history for the log level
     */
    public getLevelHistory(level: LogLevel): Map<number, LogEntry> {
        let levelHistory: Map<number, LogEntry> = new Map<number, LogEntry>();
        this.entries.forEach((entry, key) => {
            if (entry.level === level) {
                levelHistory.set(key, entry);
            }
        });
        return levelHistory;
    }
}

export {
    LogBook,
    ILogBook,
}