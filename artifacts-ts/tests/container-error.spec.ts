import { expect } from 'chai';
import { ContainerError } from '../src/container/error.js';
import { ContainerId } from '../src/id-reference-factory/index.js';
import { createId } from './helpers.js';

describe('ContainerError', () => {
    it('should create an instance of ContainerError', () => {
        const error = new ContainerError('Test error');
        expect(error).to.be.an.instanceOf(ContainerError);
        expect(error.message).to.equal('Test error');
        expect(error.containerId).to.be.undefined;
        expect(error.name).to.equal('ContainerError');
    });

    it('should create an instance of ContainerError with containerId', () => {
        const containerId = createId('container') as ContainerId;
        const error = new ContainerError('Test error', containerId);
        expect(error).to.be.an.instanceOf(ContainerError);
        expect(error.message).to.equal('Test error');
        expect(error.containerId).to.equal(containerId);
        expect(error.name).to.equal('ContainerError');
    });
});
