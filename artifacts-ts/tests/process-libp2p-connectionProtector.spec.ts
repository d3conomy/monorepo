import { expect } from 'chai';
import { ProtectorComponents, preSharedKey } from '@libp2p/pnet';
import { createSwarmKey, connectionProtector, connectionProtectorOptions } from '../src/process-libp2p/connectionProtector.js';

describe('Process Libp2p Connection Protector', () => {
    describe('createSwarmKey', () => {
        it('should create a new pre-shared key for the swarm', () => {
            const swarmKey = createSwarmKey();
            expect(swarmKey).to.be.an.instanceOf(Uint8Array);
        });

        it('should create a new pre-shared key for the swarm with the provided hex value', () => {
            const swarmKeyAsHex = '0123456789abcdef';
            const swarmKey = createSwarmKey(swarmKeyAsHex);
            expect(swarmKey).to.be.an.instanceOf(Uint8Array);
        });
    });

    describe('connectionProtector', () => {
        it('should create a connection protector using a pre-shared key', () => {
            const psk = createSwarmKey();
            const protector = preSharedKey({ psk });

            expect(protector).to.be.an('function');
            expect(protector.toString()).to.include('PreSharedKey');
        });
    });
});
