import { expect } from 'chai';

import * as index from '../src/index.js';

describe('Index::LogBookManagerExport', () => {
    it('should export all modules', () => {
        expect(index).to.haveOwnProperty('LogBooksManager');
        expect(index).to.haveOwnProperty('LogBook');
        expect(index).to.haveOwnProperty('logBooksManager');
        expect(index).to.haveOwnProperty('logger');
        expect(index).to.haveOwnProperty('getLogBook');
        expect(index).to.haveOwnProperty('LogLevel');
        expect(index).to.haveOwnProperty('isLogLevel')
    });
});
