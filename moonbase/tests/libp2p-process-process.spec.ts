import { expect } from 'chai';
// import { createLibp2pProcess } from '../src/libp2p-process/process.js';

describe('createLibp2pProcess', () => {
    it('should create a libp2p process', async () => {
        const libp2p = await createLibp2pProcess();
        expect(libp2p).to.be.an('object');
        // Add more assertions to validate the created libp2p process
    });

    it('should throw an error if createLibp2p fails', async () => {
        // Mock the createLibp2p function to throw an error
        const createLibp2pMock = async () => {
            throw new Error('Mocked createLibp2p error');
        };

        // Replace the original createLibp2p function with the mock
        const proxyquire = require('proxyquire').noCallThru();
        const { createLibp2pProcess } = proxyquire('../src/libp2p-process/process.js', {
            '../libp2p': { createLibp2p: createLibp2pMock }
        });

        // Call the createLibp2pProcess function
        try {
            await createLibp2pProcess();
        } catch (error: any) {
            expect(error).to.be.an('error');
            expect(error.message).to.equal('Mocked createLibp2p error');
        }

        // Restore the original createLibp2p function
        const { createLibp2pProcess } = require('../src/libp2p-process/process.js');
    });
});
