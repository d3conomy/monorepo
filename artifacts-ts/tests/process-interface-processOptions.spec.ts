import { expect } from 'chai';
import { compileProcessOptions, createProcessOption, IProcessOption, IProcessOptions } from '../src/process-interface/processOptions.js';

describe('createProcessOption', () => {
    it('should create a process option with the provided values', () => {
        const option: IProcessOption = createProcessOption({
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
        const options: IProcessOptions = [
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

    describe('compileProcessOptions', () => {
        it('should compile the values with the options', () => {
            const values: Array<IProcessOption> = [
                {
                    name: 'option1',
                    value: 456
                },
                {
                    name: 'option2',
                    value: 'def'
                }
            ];

            const options: IProcessOptions = [
                {
                    name: 'option1',
                    description: 'Option 1',
                    required: true,
                    defaultValue: 123
                },
                {
                    name: 'option2',
                    description: 'Option 2',
                    required: false,
                    defaultValue: 'abc'
                }
            ];

            const compiledOptions: IProcessOptions = compileProcessOptions({
                values,
                options
            });

            expect(compiledOptions).to.be.an('array');
            expect(compiledOptions).to.have.lengthOf(2);
            expect(compiledOptions[0]).to.deep.equal({
                name: 'option1',
                description: 'Option 1',
                value: 456,
                required: true,
                defaultValue: 123
            });
            expect(compiledOptions[1]).to.deep.equal({
                name: 'option2',
                description: 'Option 2',
                value: 'def',
                required: false,
                defaultValue: 'abc'
            });
        });

        it('should use the default value if the value is not provided', () => {
            const values: Array<IProcessOption> = [
                {
                    name: 'option1',
                    value: 456
                }
            ];

            const options: IProcessOptions = [
                {
                    name: 'option1',
                    description: 'Option 1',
                    defaultValue: 123,
                    required: true
                },
                {
                    name: 'option2',
                    description: 'Option 2',
                    defaultValue: 'abc',
                    required: false
                }
            ];

            const compiledOptions: IProcessOptions = compileProcessOptions({
                values,
                options
            });

            console.log(compiledOptions);

            expect(compiledOptions).to.be.an('array');
            expect(compiledOptions).to.have.lengthOf(2);
            expect(compiledOptions[0]).to.deep.equal({
                name: 'option1',
                description: 'Option 1',
                value: 456,
                required: true,
                defaultValue: 123
            });
            expect(compiledOptions[1]).to.deep.equal({
                name: 'option2',
                description: 'Option 2',
                value: 'abc',
                required: false,
                defaultValue: 'abc'
            });

        });
    });
});
