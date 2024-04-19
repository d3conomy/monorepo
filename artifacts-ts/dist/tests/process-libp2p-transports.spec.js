import { expect } from 'chai';
import { transports, transportOptions } from '../src/process-libp2p/transports.js';
import { webSockets } from '@libp2p/websockets';
describe('transports', () => {
    it('should return an array of transport options', () => {
        const result = transports();
        expect(result).to.be.an('array');
        expect(result).to.have.lengthOf(4); // Modify the expected length based on the number of enabled transports
    });
    it('should include webSockets transport when enableWebSockets is true', () => {
        const result = transports({ enableWebSockets: true });
        expect(result.toString()).to.deep.include('WebSockets(');
    });
    it('should not include webSockets transport when enableWebSockets is false', () => {
        const result = transports({ enableWebSockets: false });
        expect(result).to.not.deep.include(webSockets());
    });
    // Add more test cases for other transports
    it('should include circuitRelayTransport when enableCircuitRelayTransport is true', () => {
        const result = transports({ enableCircuitRelayTransport: true });
        expect(result.toString()).to.deep.include("CircuitRelayTransport(");
    });
    it('should include circuitRelayTransport with discoverRelays option when enableCircuitRelayTransportDiscoverRelays is provided', () => {
        const discoverRelays = 2; // Modify the value based on your test case
        const result = transports({ enableCircuitRelayTransport: true, enableCircuitRelayTransportDiscoverRelays: discoverRelays });
        expect(result.toString()).to.deep.include("CircuitRelayTransport(");
    });
    it('should not include circuitRelayTransport when enableCircuitRelayTransport is false', () => {
        const result = transports({ enableCircuitRelayTransport: false });
        console.log(result.toString());
        expect(result.toString()).to.not.deep.include("circuitRelayTransport()");
    });
});
describe('transportOptions', () => {
    it('should return an array of transport options', () => {
        expect(transportOptions).to.be.an('array');
        expect(transportOptions).to.have.lengthOf(6); // Modify the expected length based on the number of transport options
    });
});
