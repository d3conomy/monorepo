import { expect } from 'chai';
import { libp2pOptions, buildSubProcesses } from '../src/process-libp2p/options.js';
import { createProcessOption } from '../src/process-interface/index.js';
describe('libp2pOptions', () => {
    it('should return an array of loaded options', () => {
        const options = libp2pOptions();
        expect(options).to.be.an('array');
        // Add more assertions based on your expected behavior
    });
});
describe('buildSubProcesses', () => {
    it('should build sub processes based on the given options', async () => {
        const options = [
            createProcessOption({
                name: 'enableNoise',
                value: true
            }),
            createProcessOption({
                name: 'enableWebSockets',
                value: true
            })
        ];
        const libp2pOptions = await buildSubProcesses(options);
        expect(libp2pOptions).to.be.an('object');
        expect(libp2pOptions.transports).to.be.an('array');
        // Add more assertions based on your expected behavior
    });
});
