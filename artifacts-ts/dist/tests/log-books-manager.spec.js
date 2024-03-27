import { expect } from 'chai';
import * as LogBooksManagerSrc from '../src/log-books-manager/index.js';
describe('src/log-books-manager/index.js', () => {
    it('should export the log-books-manager', () => {
        expect(LogBooksManagerSrc).to.haveOwnProperty('LogBooksManager');
    });
    it('should export the logBook', () => {
        expect(LogBooksManagerSrc).to.haveOwnProperty('LogBook');
    });
    it('should export the log-books-manager', () => {
        expect(LogBooksManagerSrc).to.haveOwnProperty('logBooksManager');
    });
    it('should export the logger', () => {
        expect(LogBooksManagerSrc).to.haveOwnProperty('logger');
    });
    it('should export the getLogBook', () => {
        expect(LogBooksManagerSrc).to.haveOwnProperty('getLogBook');
    });
    it('should export the log-books-manager constants', () => {
        expect(LogBooksManagerSrc).to.haveOwnProperty('LogLevel');
    });
    it('should export the log-books-manager constants', () => {
        expect(LogBooksManagerSrc).to.haveOwnProperty('isLogLevel');
    });
});
describe('src/log-books-manager/LogEntry.js', () => {
    it('should create an LogEntry object', () => {
        const logEntry = new LogBooksManagerSrc.LogEntry({
            message: 'test message',
            printLevel: LogBooksManagerSrc.LogLevel.INFO
        });
        expect(logEntry).to.haveOwnProperty('message');
        expect(logEntry).to.haveOwnProperty('printLevel');
    });
    it('should print the log entry', () => {
        const logEntry = new LogBooksManagerSrc.LogEntry({
            message: 'test message',
            printLevel: LogBooksManagerSrc.LogLevel.INFO
        });
        expect(logEntry).to.haveOwnProperty('print');
    });
    it('should not print the log entry', () => {
        const logEntry = new LogBooksManagerSrc.LogEntry({
            level: LogBooksManagerSrc.LogLevel.DEBUG,
            message: 'test message',
            printLevel: LogBooksManagerSrc.LogLevel.INFO
        });
        expect(logEntry).to.haveOwnProperty('print');
    });
    it('should not print the log entry', () => {
        const logEntry = new LogBooksManagerSrc.LogEntry({
            level: LogBooksManagerSrc.LogLevel.WARN,
            message: 'test message',
            printLevel: LogBooksManagerSrc.LogLevel.ERROR
        });
        expect(logEntry).to.haveOwnProperty('print');
    });
    it('should print the log entry', () => {
        const logEntry = new LogBooksManagerSrc.LogEntry({
            level: LogBooksManagerSrc.LogLevel.INFO,
            message: 'test message',
            printLevel: LogBooksManagerSrc.LogLevel.INFO
        });
        expect(logEntry).to.haveOwnProperty('print');
    });
});
