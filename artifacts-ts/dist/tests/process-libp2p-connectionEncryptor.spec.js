import { expect } from 'chai';
import { connectionEncryption } from '../src/process-libp2p/connectionEncryption.js';
describe('connectionEncryption', () => {
    it('should return an empty array when no encryption options are enabled', () => {
        const result = connectionEncryption();
        expect(result).to.be.an('array').that.is.empty;
    });
    it('should include noise encryption when enableNoise is true', () => {
        const result = connectionEncryption({ enableNoise: true });
        expect(result.toString()).to.deep.include('Noise');
    });
    it('should include tls encryption when enableTls is true', () => {
        const result = connectionEncryption({ enableTls: true });
        expect(result.toString()).to.deep.include('TLS');
    });
    it('should include both noise and tls encryption when both options are true', () => {
        const result = connectionEncryption({ enableNoise: true, enableTls: true });
        expect(result.toString()).to.deep.include('Noise');
        expect(result.toString()).to.deep.include('TLS');
    });
});
// You can also write tests for the connectionEncryptionOptions if needed
