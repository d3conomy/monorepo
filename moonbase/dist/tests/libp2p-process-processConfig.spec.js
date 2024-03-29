import { expect } from 'chai';
import { Libp2pProcessConfig } from '../src/libp2p-process/processConfig.js';
import { Libp2pProcessOptions, createLibp2pProcessOptions } from '../src/libp2p-process/processOptions.js';
describe('createLibp2pProcessOptions', async () => {
    it('should return a valid Libp2pOptions object', async () => {
        const processOptions = await createLibp2pProcessOptions();
        expect(processOptions).to.be.an.instanceOf(Libp2pProcessOptions);
        // Add more assertions for other properties
    });
});
describe('Libp2pProcessConfig', () => {
    it('should have default values', () => {
        const config = new Libp2pProcessConfig();
        expect(config.autoStart).to.be.false;
        // Add more assertions for other properties
    });
});
