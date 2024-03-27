import { IdReferenceTypes } from '../id-reference-factory/IdReferenceConstants.js';
import { isLogLevel } from './LogLevels.js';
/**
 * A class to manage an individual log book
 * @category Logging
 */
class LogBook {
    name;
    entries;
    printLevel;
    constructor(name, printLevel = "info") {
        this.name = name;
        this.printLevel = isLogLevel(printLevel);
        this.entries = new Map();
    }
    /**
     * Adds an entry to the log book
     */
    add(entry) {
        const counter = this.entries.size + 1;
        this.entries.set(counter, entry);
    }
    /**
     * Gets an entry from the log book
     */
    get(entryId) {
        const entry = this.entries.get(entryId);
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
    delete(entryId) {
        this.entries.delete(entryId);
    }
    /**
     * Returns a map of all the entries
     */
    getAll() {
        return this.entries;
    }
    /**
     * Clears the entire log book
     */
    clear() {
        this.entries = new Map();
    }
    /**
     * Retrieve the last n entries from the log book
     */
    getLast(count = 1) {
        let lastEntries = new Map();
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
    getPodHistory(podId) {
        let podHistory = new Map();
        this.entries.forEach((entry, key) => {
            if (entry.podId?.name === podId &&
                entry.podId?.metadata?.has("type") &&
                entry.podId?.metadata.get('type') === `${IdReferenceTypes.POD}`) {
                podHistory.set(key, entry);
            }
        });
        return podHistory;
    }
    /**
     * Returns a map of the history for the job
     */
    getProcessHistory(processId) {
        let jobHistory = new Map();
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
    getLevelHistory(level) {
        let levelHistory = new Map();
        this.entries.forEach((entry, key) => {
            if (entry.level === level) {
                levelHistory.set(key, entry);
            }
        });
        return levelHistory;
    }
}
export { LogBook, };
