import { expect } from 'chai';
import { InstanceOption, InstanceOptions, InstanceOptionsList, createOptionsList } from '../src/container/options.js';

describe('InstanceOptionsList', () => {
    describe('toParams', () => {
        it('should convert options list to params object', () => {
            const options: InstanceOption<any>[] = [
                { name: 'option1', defaultValue: 'default1' },
                { name: 'option2', value: 'value2' },
                { name: 'option3', defaultValue: 'default3' },
            ];

            const instanceOptionsList = new InstanceOptionsList(options);
            const params = instanceOptionsList.toParams();

            expect(params).to.deep.equal({
                option1: 'default1',
                option2: 'value2',
                option3: 'default3',
            });
        });

        it('should return empty object if options list is empty', () => {
            const instanceOptionsList = new InstanceOptionsList([]);
            const params = instanceOptionsList.toParams();

            expect(params).to.deep.equal({});
        });

        it('should throw an error if option with the same name already exists', () => {
            const options: InstanceOption<any>[] = [
                { name: 'option1', value: 'default1' },
            ];

            const instanceOptionsList = new InstanceOptionsList(options);

            expect(() => {
                instanceOptionsList.push({ name: 'option1', value: 'default2' });
                instanceOptionsList.toParams()
            }).to.throw('Option with name already exists');
        });
    });
});


describe('InstanceOptions', () => {
    describe('create instance options', () => {
        it('should create instance options with given options', () => {
            const options: InstanceOptionsList = createOptionsList([
                { name: 'option1', defaultValue: 'default1' },
                { name: 'option2', value: 'value2' },
                { name: 'option3', defaultValue: 'default3' },
            ]);

            const instanceOptions = new InstanceOptions({options});

            expect(instanceOptions.options).to.be.an.instanceOf(InstanceOptionsList);
            expect(instanceOptions.options.length).to.equal(3);
        });

        it('should create instance options with given options and inject defaults', () => {
            const options: InstanceOptionsList = createOptionsList([
                { name: 'option1', defaultValue: 'default1' },
                { name: 'option2', value: 'value2' },
                { name: 'option3', defaultValue: 'default3' },
            ]);

            const defaults: InstanceOptionsList = createOptionsList([
                { name: 'option2', defaultValue: 'default2' },
                { name: 'option4', defaultValue: 'default4' },
            ]);

            const instanceOptions = new InstanceOptions({options, injectDefaults: true, defaults: new InstanceOptions({options: defaults})});

            expect(instanceOptions.options).to.be.an.instanceOf(InstanceOptionsList);
            expect(instanceOptions.options.length).to.equal(4);
        });
    });
});