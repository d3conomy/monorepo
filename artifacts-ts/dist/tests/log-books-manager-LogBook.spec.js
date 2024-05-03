import { expect } from 'chai';
import { LogBook } from '../src/log-books-manager/LogBook.js';
import { LogEntry } from '../src/log-books-manager/LogEntry.js';
import { LogLevel } from '../src/log-books-manager/LogLevels.js';
describe('src/log-books-manager/LogBook.js', () => {
    let logBook;
    beforeEach(() => {
        logBook = new LogBook('Test LogBook');
    });
    afterEach(() => {
        logBook.clear();
    });
    it('should add an entry to the log book', () => {
        const entry = new LogEntry({ message: 'Test message', level: LogLevel.INFO, printLevel: LogLevel.INFO });
        logBook.add(entry);
        expect(logBook.entries.size).to.be.greaterThan(0);
    });
    it('should get an entry from the log book', () => {
        const entry = new LogEntry({ message: 'Test message', level: LogLevel.INFO, printLevel: LogLevel.INFO });
        logBook.add(entry);
        const retrievedEntry = logBook.get(1);
        expect(retrievedEntry).to.equal(entry);
    });
    it('should delete an entry from the log book', () => {
        const entry = new LogEntry({ message: 'Test message', level: LogLevel.INFO, printLevel: LogLevel.INFO });
        logBook.add(entry);
        logBook.delete(1);
        expect(logBook.entries.size).to.be.equal(0);
    });
    it('should clear the log book', () => {
        const entry = new LogEntry({ message: 'Test message', level: LogLevel.INFO, printLevel: LogLevel.INFO });
        logBook.add(entry);
        logBook.clear();
        expect(logBook.entries.size).to.be.equal(0);
    });
    it('should get all entries from the log book', () => {
        const entry1 = new LogEntry({ message: 'Test message 1', level: LogLevel.INFO, printLevel: LogLevel.INFO });
        const entry2 = new LogEntry({ message: 'Test message 2', level: LogLevel.INFO, printLevel: LogLevel.INFO });
        logBook.add(entry1);
        logBook.add(entry2);
        const allEntries = logBook.getAll();
        expect(allEntries.size).to.be.greaterThanOrEqual(2);
        expect(allEntries.get(1)).to.equal(entry1);
        expect(allEntries.get(2)).to.equal(entry2);
    });
    it('should get the last n entries from the log book', () => {
        const entry1 = new LogEntry({ message: 'Test message 1', level: LogLevel.INFO, printLevel: LogLevel.INFO });
        const entry2 = new LogEntry({ message: 'Test message 2', level: LogLevel.INFO, printLevel: LogLevel.INFO });
        const entry3 = new LogEntry({ message: 'Test message 3', level: LogLevel.INFO, printLevel: LogLevel.INFO });
        logBook.add(entry1);
        logBook.add(entry2);
        logBook.add(entry3);
        const lastEntries = logBook.getLast(2);
        expect(lastEntries.size).to.be.greaterThanOrEqual(2);
        expect(lastEntries.get(2)).to.equal(entry2);
        expect(lastEntries.get(3)).to.equal(entry3);
    });
    it('should throw an error when entry is not found', () => {
        expect(() => logBook.get(1)).to.throw('Entry not found');
    });
});
