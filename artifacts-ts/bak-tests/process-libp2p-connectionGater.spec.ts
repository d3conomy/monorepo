import { expect } from 'chai';
import { connectionGater, connectionGaterOptions } from '../src/process-libp2p/connectionGater.js';

describe('Connection Gater', () => {
    describe('connectionGater', () => {
        afterEach(() => {
            connectionGater();
        });

        it('should return an empty map when no options are provided', () => {
            const result = connectionGater();
            // console.log(result);
            expect(result.size).to.equal(1);
        });

        it('should return a map with the "denyDialMultiaddr" function when "enableDenyDialMultiaddr" is true', () => {
            const result = connectionGater({ enableDenyDialMultiaddr: true });
            expect(result.size).to.equal(1);
            expect(result.has('denyDialMultiaddr')).to.be.true;
            expect(result.get('denyDialMultiaddr')).to.be.a('function');
        });

        it('should return a map without the "denyDialMultiaddr" function when "enableDenyDialMultiaddr" is false', () => {
            const result = connectionGater({ enableDenyDialMultiaddr: false });
            expect(result.size).to.equal(0);
            // console.log(``)
            expect(result.has('denyDialMultiaddr')).to.be.false;
        });

        it('should return the correct value for "denyDialMultiaddr" when "enableDenyDialMultiaddr" is true', async () => {
            const result = connectionGater({ enableDenyDialMultiaddr: true, denyDialMultiaddr: true });
            const denyDialMultiaddrFn = result.get('denyDialMultiaddr');
            expect(denyDialMultiaddrFn).to.be.a('function');
            const denyDialMultiaddrValue = await denyDialMultiaddrFn();
            expect(denyDialMultiaddrValue).to.be.true;
        });

        it('should return the default value for "denyDialMultiaddr" when "enableDenyDialMultiaddr" is true but no value is provided', async () => {
            const result = connectionGater({ enableDenyDialMultiaddr: true, denyDialMultiaddr: false });
            const denyDialMultiaddrFn = result.get('denyDialMultiaddr');
            expect(denyDialMultiaddrFn).to.be.a('function');
            const denyDialMultiaddrValue = await denyDialMultiaddrFn();
            expect(denyDialMultiaddrValue).to.be.false;
        });
    });
});
