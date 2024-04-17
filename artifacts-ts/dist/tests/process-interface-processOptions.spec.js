import { expect } from 'chai';
import { createProcessOption } from '../src/process-interface/processOptions.js';
describe('createProcessOption', () => {
    it('should create a process option with the provided values', () => {
        const option = createProcessOption({
            name: 'option1',
            description: 'Option 1',
            value: 123,
            required: true
        });
        expect(option.name).to.equal('option1');
        expect(option.description).to.equal('Option 1');
        expect(option.value).to.equal(123);
        expect(option.required).to.be.true;
    });
});
describe('IProcessOptions', () => {
    it('should be an array of IProcessOption', () => {
        const options = [
            {
                name: 'option1',
                description: 'Option 1',
                value: 123,
                required: true
            },
            {
                name: 'option2',
                description: 'Option 2',
                value: 'abc',
                required: false
            }
        ];
        expect(options).to.be.an('array');
        expect(options).to.have.lengthOf(2);
        expect(options[0]).to.deep.equal({
            name: 'option1',
            description: 'Option 1',
            value: 123,
            required: true
        });
        expect(options[1]).to.deep.equal({
            name: 'option2',
            description: 'Option 2',
            value: 'abc',
            required: false
        });
    });
});
