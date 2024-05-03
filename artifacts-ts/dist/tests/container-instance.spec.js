import { expect } from 'chai';
import { InstanceTypes } from '../src/container/instance.js';
describe('Container Instance', () => {
    describe('InstanceType', () => {
        it('should be a valid key of InstanceTypes', () => {
            const instanceTypeKeys = Object.keys(InstanceTypes);
            const instanceTypeValues = Object.values(InstanceTypes);
            expect(instanceTypeKeys).to.include.members(instanceTypeValues);
        });
    });
    describe('InstanceTypes', () => {
        it('should have unique values', () => {
            const instanceTypeValues = Object.values(InstanceTypes);
            expect(new Set(instanceTypeValues).size).to.equal(instanceTypeValues.length);
        });
    });
});
