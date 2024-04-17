import { expect } from 'chai';
import { createProcessContainer, IProcessContainer } from '../src/process-interface/processContainer.js';
import { createProcessOption, IProcessOptions } from '../src/process-interface/processOptions.js';
import { ProcessType } from '../src/process-interface/processTypes.js';

describe('createProcessContainer', () => {
    it('should create a process container with the given type, process, and options', () => {
        const type: ProcessType = ProcessType.CUSTOM;
        const process = () => { console.log('hello, world!') };
        const options: IProcessOptions = [
            createProcessOption({name: 'someOption', value: 'someValue'})
        ];

        const result: IProcessContainer<ProcessType> = createProcessContainer(type, process, options);

        expect(result.type).to.equal(type);
        expect(result.process).to.equal(process);
        expect(result.options).to.equal(options);
    });

    it('should create a process container with the given type and default process and options', () => {
        const type: ProcessType = ProcessType.CUSTOM;

        const result: IProcessContainer<ProcessType> = createProcessContainer(type);

        expect(result.type).to.equal(type);
        expect(result.process).to.be.undefined;
        expect(result.options).to.be.undefined;
    });
});
