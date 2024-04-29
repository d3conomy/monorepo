import { expect } from 'chai';
import { createProcessContainer, IProcessContainer } from '../src/process-interface/processContainer.js';
import { createProcessOption, IProcessOptionsList } from '../src/process-interface/processOptions.js';
import { ProcessType } from '../src/process-interface/processTypes.js';

describe('createProcessContainer', () => {
    it('should create a process container with the given type, process, and options', () => {
        const type: ProcessType = ProcessType.CUSTOM;
        const instance = () => { console.log('hello, world!') };
        const options: IProcessOptionsList = [
            createProcessOption({name: 'someOption', value: 'someValue'})
        ];

        const result: IProcessContainer<ProcessType> = createProcessContainer({type, instance, options});

        expect(result.type).to.equal(type);
        expect(result.instance).to.equal(instance);
        expect(result.options).to.equal(options);
    });

    it('should create a instance container with the given type and default instance and options', () => {
        const type: ProcessType = ProcessType.CUSTOM;

        const result: IProcessContainer<ProcessType> = createProcessContainer({type});

        expect(result.type).to.equal(type);
        expect(result.instance).to.be.undefined;
        expect(result.options).to.be.undefined;
    });
});
