import { expect } from 'chai';
import { LogBooksManager } from '../src/log-books-manager/LogBooksManager.js';
import { LogBook } from '../src/log-books-manager/LogBook.js';
import { LogLevel } from '../src/log-books-manager/LogLevels.js';
import { LogEntry } from '../src/log-books-manager/LogEntry.js';

describe('src/log-books-manager/LogBooksManager.js', () => {
    let logBooksManager: LogBooksManager;

    beforeEach(() => {
        logBooksManager = new LogBooksManager();
    });

    afterEach(() => {
        logBooksManager.clear();
    });

    it('should create a new log book', () => {
        logBooksManager.create('Test LogBook', LogLevel.INFO);
        expect(logBooksManager.books.size).to.be.equal(1);
        const logBook = logBooksManager.get('Test LogBook');
        expect(logBook).to.be.instanceOf(LogBook);
        expect(logBook.name).to.be.equal('Test LogBook');
        expect(logBook.printLevel).to.be.equal(LogLevel.INFO);
    });

    it('should throw an error when creating a log book that already exists', () => {
        logBooksManager.create('Test LogBook', LogLevel.INFO);
        expect(() => logBooksManager.create('Test LogBook', LogLevel.DEBUG)).to.throw('Log book already exists');
    });

    it('should get an existing log book', () => {
        logBooksManager.create('Test LogBook', LogLevel.INFO);
        const logBook = logBooksManager.get('Test LogBook');
        expect(logBook).to.be.instanceOf(LogBook);
        expect(logBook.name).to.be.equal('Test LogBook');
        expect(logBook.printLevel).to.be.equal(LogLevel.INFO);
    });

    it('should throw an error when getting a log book that does not exist', () => {
        expect(() => logBooksManager.get('Nonexistent LogBook')).to.throw('Log book not found');
    });

    it('should delete an existing log book', () => {
        logBooksManager.create('Test LogBook', LogLevel.INFO);
        logBooksManager.delete('Test LogBook');
        expect(logBooksManager.books.size).to.be.equal(0);
    });

    it('should clear all log books', () => {
        logBooksManager.create('Test LogBook 1', LogLevel.INFO);
        logBooksManager.create('Test LogBook 2', LogLevel.DEBUG);
        logBooksManager.clear();
        expect(logBooksManager.books.size).to.be.equal(0);
    });

    it('should get all entries from all log books', () => {
        logBooksManager.create('Test LogBook 1', LogLevel.INFO);
        logBooksManager.create('Test LogBook 2', LogLevel.DEBUG);
        const logBook1 = logBooksManager.get('Test LogBook 1');
        const logBook2 = logBooksManager.get('Test LogBook 2');
        const entry1 = new LogEntry({ message: 'Test message 1', level: LogLevel.INFO, printLevel: LogLevel.INFO});
        const entry2 = new LogEntry({ message: 'Test message 2', level: LogLevel.DEBUG, printLevel: LogLevel.DEBUG});
        logBook1.add(entry1);
        logBook2.add(entry2);
        const allEntries = logBooksManager.getLastEntries();
        expect(allEntries.size).to.be.equal(2);
        expect(allEntries.get('Test LogBook 1-1')).to.be.equal(entry1);
        expect(allEntries.get('Test LogBook 2-1')).to.be.equal(entry2);
    });
});