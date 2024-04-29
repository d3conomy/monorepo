import { expect } from 'chai';
import OrbitDBIdentityProviderDID from '@orbitdb/identity-provider-did';
import KeyDidResolver from 'key-did-resolver';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import { useIdentityProvider } from '@orbitdb/core';
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
