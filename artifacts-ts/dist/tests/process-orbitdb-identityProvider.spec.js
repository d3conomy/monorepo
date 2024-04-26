import { expect } from 'chai';
import { createIdentityProvider } from '../src/process-orbitdb/identityProvider.js';
describe('createIdentityProvider', () => {
    it('should create an identity provider with default identity seed', () => {
        const identityProvider = createIdentityProvider();
        expect(identityProvider).to.exist;
        // Add more assertions as needed
    });
    it('should create an identity provider with custom identity seed', () => {
        const identitySeed = new Uint8Array(32);
        const identityProvider = createIdentityProvider({ identitySeed });
        expect(identityProvider).to.exist;
        // Add more assertions as needed
    });
    it('should create an identity provider with custom identity provider', () => {
        const customIdentityProvider = {}; // Replace with your custom identity provider
        const identityProvider = createIdentityProvider({ identityProvider: customIdentityProvider });
        expect(identityProvider).to.exist;
        // Add more assertions as needed
    });
});
