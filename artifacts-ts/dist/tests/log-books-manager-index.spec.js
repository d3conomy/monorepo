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
