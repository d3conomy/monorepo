import { expect } from 'chai';
import { compileProcessOptions, createProcessOption, findProcessOption, injectDefaultValues } from '../src/process-interface/processOptions.js';
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
describe('IProcessOptionsList', () => {
    it('should be an array of IProcessOption', () => {
        const options = [
            createProcessOption({
                name: 'option1',
                description: 'Option 1',
                value: 123,
                required: true
            }),
            createProcessOption({
                name: 'option2',
                description: 'Option 2',
                value: 'abc',
                required: false
            })
        ];
        expect(options).to.be.an('array');
        expect(options).to.have.lengthOf(2);
        expect(options[0]).to.deep.equal({
            name: 'option1',
            description: 'Option 1',
            value: 123,
            required: true,
            defaultValue: undefined
        });
        expect(options[1]).to.deep.equal({
            name: 'option2',
            description: 'Option 2',
            value: 'abc',
            required: false,
            defaultValue: undefined
        });
    });
    it('should be able to add new options', () => {
        const options = [
            createProcessOption({
                name: 'option1',
                description: 'Option 1',
                value: 123,
                required: true
            })
        ];
        options.push(createProcessOption({
            name: 'option2',
            description: 'Option 2',
            value: 'abc',
            required: false
        }));
        expect(options).to.have.lengthOf(2);
        expect(options[1]).to.deep.equal({
            name: 'option2',
            description: 'Option 2',
            value: 'abc',
            required: false,
            defaultValue: undefined
        });
    });
});
describe('findProcessOption', () => {
    it('should find an option by name in an array of options', () => {
        const options = [
            createProcessOption({
                name: 'option1',
                description: 'Option 1',
                value: 123,
                required: true
            }),
            createProcessOption({
                name: 'option2',
                description: 'Option 2',
                value: 'abc',
                required: false
            })
        ];
        const option = findProcessOption({
            options,
            name: 'option2'
        });
        expect(option).to.deep.equal({
            name: 'option2',
            description: 'Option 2',
            value: 'abc',
            required: false,
            defaultValue: undefined
        });
    });
    it('should find an option by name in a Map of options', () => {
        const options = new Map([
            ['option1', createProcessOption({
                    name: 'option1',
                    description: 'Option 1',
                    value: 123,
                    required: true
                })],
            ['option2', createProcessOption({
                    name: 'option2',
                    description: 'Option 2',
                    value: 'abc',
                    required: false
                })]
        ]);
        const option = findProcessOption({
            options,
            name: 'option2'
        });
        expect(option).to.deep.equal({
            name: 'option2',
            description: 'Option 2',
            value: 'abc',
            required: false,
            defaultValue: undefined
        });
    });
    it('should find an option by name in an object of options', () => {
        const options = {
            'option1': createProcessOption({
                name: 'option1',
                description: 'Option 1',
                value: 123,
                required: true
            }),
            'option2': createProcessOption({
                name: 'option2',
                description: 'Option 2',
                value: 'abc',
                required: false
            })
        };
        const option = findProcessOption({
            options,
            name: 'option2'
        });
        expect(option).to.deep.equal({
            name: 'option2',
            description: 'Option 2',
            value: 'abc',
            required: false,
            defaultValue: undefined
        });
    });
});
describe('compileProcessOptions', () => {
    it('should compile process options with the provided values', () => {
        const options = [
            createProcessOption({
                name: 'option1',
                description: 'Option 1',
                value: 123,
                required: true
            }),
            createProcessOption({
                name: 'option2',
                description: 'Option 2',
                value: 'abc',
                required: false
            })
        ];
        // const values: { [key: string]: any } = {
        //     'option1': 456,
        //     'option2': 'def'
        // };
        const values = {
            'option1': { name: 'option1', value: 456 },
            'option2': { name: 'option2', value: 'def' }
        };
        const defaults = injectDefaultValues({
            options,
            values
        });
        console.log(`defaults: ${JSON.stringify(defaults)}`);
        const compiledOptions = compileProcessOptions(defaults);
        console.log(`compiledOptions: ${JSON.stringify(compiledOptions)}`);
        expect(compiledOptions).to.deep.equal({
            'option1': 456,
            'option2': 'def'
        });
    });
    it('should compile process options with the provided values and default values', () => {
        const options = [
            createProcessOption({
                name: 'option1',
                description: 'Option 1',
                value: 123,
                required: true
            }),
            createProcessOption({
                name: 'option2',
                description: 'Option 2',
                value: 'abc',
                required: false,
                defaultValue: 'xyz'
            })
        ];
        const values = {
            'option1': { name: "option1", value: 456 }
        };
        const defaults = injectDefaultValues({
            options,
            values
        });
        const compiledOptions = compileProcessOptions(defaults);
        console.log(compiledOptions);
        expect(compiledOptions).to.deep.equal({
            'option1': 456,
            'option2': 'abc'
        });
    });
});
