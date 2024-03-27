import { expect } from 'chai';
import { LogLevel, isLogLevel } from '../src/log-books-manager/LogLevels.js';

describe('/src/log-books-manager/LogLevels.js', () => {
    describe('isLogLevel', () => {
        it('should return the log level if it is valid', () => {
            expect(isLogLevel('info')).to.equal(LogLevel.INFO);
            expect(isLogLevel('warn')).to.equal(LogLevel.WARN);
            expect(isLogLevel('error')).to.equal(LogLevel.ERROR);
            expect(isLogLevel('debug')).to.equal(LogLevel.DEBUG);
        });

        it('should convert the log level to lowercase if it is a string', () => {
            expect(isLogLevel('INFO')).to.equal(LogLevel.INFO);
            expect(isLogLevel('WARN')).to.equal(LogLevel.WARN);
            expect(isLogLevel('ERROR')).to.equal(LogLevel.ERROR);
            expect(isLogLevel('DEBUG')).to.equal(LogLevel.DEBUG);
        });

        it('should throw an error if the log level is invalid', () => {
            expect(() => isLogLevel('invalid')).to.throw('Invalid log level');
        });
    });
});
