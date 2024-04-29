import { expect } from 'chai';
import sinon from 'sinon';
import * as LogBooksManagerSrc from '../src/log-books-manager/index.js';
import { MetaData } from '../src/id-reference-factory/IdReferenceMetadata.js';
import { IdReferenceTypes } from '../src/id-reference-factory/index.js';
describe('src/log-books-manager/LogEntry.js', () => {
    let consoleLogSpy;
    beforeEach(() => {
        // Replace console.log with a spy function before each test
        consoleLogSpy = sinon.spy(console, 'log');
    });
    afterEach(() => {
        // Restore console.log after each test
        consoleLogSpy.restore();
    });
    it('should create an LogEntry object', () => {
        const logEntry = new LogBooksManagerSrc.LogEntry({
            message: 'test message',
            printLevel: LogBooksManagerSrc.LogLevel.INFO
        });
        expect(logEntry).to.be.instanceOf(LogBooksManagerSrc.LogEntry);
    });
    it('should print the log entry', () => {
        const logEntry = new LogBooksManagerSrc.LogEntry({
            message: 'test message',
            printLevel: LogBooksManagerSrc.LogLevel.INFO
        });
        expect(consoleLogSpy.calledOnce).to.be.true;
    });
    it('should not print the log entry', () => {
        const logEntry = new LogBooksManagerSrc.LogEntry({
            level: LogBooksManagerSrc.LogLevel.DEBUG,
            message: 'test message',
            printLevel: LogBooksManagerSrc.LogLevel.INFO
        });
        expect(consoleLogSpy.calledOnce).to.be.false;
    });
    it('should not print the log entry', () => {
        const logEntry = new LogBooksManagerSrc.LogEntry({
            level: LogBooksManagerSrc.LogLevel.WARN,
            message: 'test message',
            printLevel: LogBooksManagerSrc.LogLevel.ERROR
        });
        expect(consoleLogSpy.calledOnce).to.be.false;
    });
    it('should print the log entry', () => {
        const logEntry = new LogBooksManagerSrc.LogEntry({
            level: LogBooksManagerSrc.LogLevel.INFO,
            message: 'test message',
            printLevel: LogBooksManagerSrc.LogLevel.INFO
        });
        expect(consoleLogSpy.calledOnce).to.be.true;
    });
    it('should contain the correct properties', () => {
        const logEntry = new LogBooksManagerSrc.LogEntry({
            level: LogBooksManagerSrc.LogLevel.INFO,
            message: 'test message',
            printLevel: LogBooksManagerSrc.LogLevel.INFO
        });
        expect(logEntry).to.haveOwnProperty('timestamp');
        expect(logEntry).to.haveOwnProperty('level');
        expect(logEntry).to.haveOwnProperty('message');
    });
    it('should contain all the properties', () => {
        const logEntry = new LogBooksManagerSrc.LogEntry({
            podId: { name: 'test', metadata: new MetaData(), type: IdReferenceTypes.POD },
            level: LogBooksManagerSrc.LogLevel.INFO,
            message: 'test message',
            printLevel: LogBooksManagerSrc.LogLevel.INFO
        });
        expect(logEntry).to.haveOwnProperty('timestamp');
        expect(logEntry).to.haveOwnProperty('level');
        expect(logEntry).to.haveOwnProperty('message');
        // expect(logEntry).to.haveOwnProperty('code');
        // expect(logEntry).to.haveOwnProperty('stage');
        expect(logEntry).to.haveOwnProperty('error');
        expect(logEntry).to.haveOwnProperty('processId');
        expect(logEntry).to.haveOwnProperty('podId');
    });
});
