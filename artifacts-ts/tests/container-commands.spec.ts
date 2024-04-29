import { expect } from 'chai';
import { Command, Commands } from '../src/container/commands.js';

describe('Commands', () => {
    let commands: Commands;

    beforeEach(() => {
        commands = new Commands({ commands: [] });
    });

    it('should add a command', () => {
        const command: Command = {
            name: 'test',
            description: 'Test command',
            args: [],
            run: async () => { return { output: null, metrics: { runtime: 0, bytesUploaded: 0, bytesDownloaded: 0 } }}
        };

        commands.add(command);

        expect(commands.list()).to.deep.equal([command]);
    });

    it('should throw an error when adding a duplicate command', () => {
        const command: Command = {
            name: 'test',
            description: 'Test command',
            args: [],
            run: async () => {return { output: null, metrics: { runtime: 0, bytesUploaded: 0, bytesDownloaded: 0 } }}
        };

        commands.add(command);

        expect(() => commands.add(command)).to.throw(Error, 'Command test already exists');
    });

    it('should get a command by name', () => {
        const command: Command = {
            name: 'test',
            description: 'Test command',
            args: [],
            run: async () => {return { output: null, metrics: { runtime: 0, bytesUploaded: 0, bytesDownloaded: 0 }}}
        };

        commands.add(command);

        expect(commands.get('test')).to.equal(command);
    });

    it('should throw an error when getting a non-existent command', () => {
        expect(() => commands.get('nonexistent')).to.throw(Error, 'Command nonexistent not found');
    });
});
