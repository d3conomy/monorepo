import { expect } from 'chai';
import { createProcessContainer } from '../src/process-interface/processContainer.js';
import { createProcessOption } from '../src/process-interface/processOptions.js';
import { ProcessType } from '../src/process-interface/processTypes.js';
describe('createProcessContainer', () => {
    it('should create a process container with the given type, process, and options', () => {
        const type = ProcessType.CUSTOM;
        const process = () => { console.log('hello, world!'); };
        const options = [
            createProcessOption({ name: 'someOption', value: 'someValue' })
        ];
        const result = createProcessContainer(type, process, options);
        expect(result.type).to.equal(type);
        expect(result.process).to.equal(process);
        expect(result.options).to.equal(options);
    });
    it('should create a process container with the given type and default process and options', () => {
        const type = ProcessType.CUSTOM;
        const result = createProcessContainer(type);
        expect(result.type).to.equal(type);
        expect(result.process).to.be.undefined;
        expect(result.options).to.be.undefined;
    });
});
