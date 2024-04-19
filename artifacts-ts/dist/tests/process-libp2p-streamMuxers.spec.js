import { expect } from 'chai';
import { streamMuxers, streamMuxerOptions } from '../src/process-libp2p/streamMuxers.js';
describe('streamMuxers', () => {
    it('should return an empty array when no options are provided', () => {
        const result = streamMuxers();
        expect(result).to.be.an('array');
    });
    it('should return an array with yamux when enableYamux is true', () => {
        const result = streamMuxers({ enableYamux: true });
        expect(result.toString()).to.deep.include('Yamux');
    });
    it('should return an array with mplex when enableMplex is true', () => {
        const result = streamMuxers({ enableMplex: true, enableYamux: false });
        console.log(result.toString());
        expect(result.toString()).to.deep.include('Mplex');
    });
    it('should return an array with both yamux and mplex when both options are true', () => {
        const result = streamMuxers({ enableYamux: true, enableMplex: true });
        expect(result.toString()).to.deep.include('Yamux');
        expect(result.toString()).to.deep.include('Mplex');
    });
});
describe('streamMuxerOptions', () => {
    it('should have the correct structure', () => {
        expect(streamMuxerOptions).to.be.an('array').that.has.lengthOf(2);
        expect(streamMuxerOptions[0]).to.have.property('name', 'enableYamux');
        expect(streamMuxerOptions[0]).to.have.property('description', 'Enable Yamux');
        expect(streamMuxerOptions[0]).to.have.property('required', false);
        expect(streamMuxerOptions[0]).to.have.property('defaultValue', true);
        expect(streamMuxerOptions[1]).to.have.property('name', 'enableMplex');
        expect(streamMuxerOptions[1]).to.have.property('description', 'Enable Mplex');
        expect(streamMuxerOptions[1]).to.have.property('required', false);
        expect(streamMuxerOptions[1]).to.have.property('defaultValue', false);
    });
});
