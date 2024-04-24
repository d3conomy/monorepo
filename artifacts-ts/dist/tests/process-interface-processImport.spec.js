import { expect } from 'chai';
import fs from 'fs/promises';
import sinon from 'sinon';
import { createProcessContainer, } from '../src/process-interface/processContainer.js';
import { ProcessCommands } from '../src/process-interface/processCommand.js';
import { ProcessType } from '../src/process-interface/processTypes.js';
import { importFromFile, importProcessCommandsFromJSON, importProcessContainerFromJSON } from '../src/process-interface/processImport.js';
describe('importFromFile', () => {
    it('should import file from disk and parse it as JSON', async () => {
        const filepath = '/path/to/file.json';
        const fileContent = { foo: 'bar' };
        const readFileStub = sinon.stub(fs, 'readFile').resolves(JSON.stringify(fileContent));
        const result = await importFromFile(filepath);
        // expect(readFileStub).to.have.been.call(path.resolve(), filepath);
        expect(result).to.deep.equal(fileContent);
        readFileStub.restore();
    });
    it('should throw an error if there is an error reading the file', async () => {
        const filepath = '/path/to/file.json';
        const errorMessage = 'Error reading file from disk';
        const readFileStub = sinon.stub(fs, 'readFile').rejects(new Error(errorMessage));
        try {
            await importFromFile(filepath);
            expect.fail('Expected an error to be thrown');
        }
        catch (error) {
            expect(error.message).to.equal(`Error reading file from disk: Error: ${errorMessage}`);
        }
        readFileStub.restore();
    });
});
describe('importProcessContainerFromJSON', () => {
    it('should create a process container from JSON', () => {
        const json = {
            type: 'custom',
            process: "() => { return 'hello' }",
            options: { foo: 'bar' }
        };
        const result = importProcessContainerFromJSON(json);
        // expect(result).to.be.an.instanceOf(IProcessContainer);
        expect(result.type).to.equal(json.type);
        // expect(result.process).to.equal(json.process);
        expect(result.options).to.deep.equal(json.options);
    });
});
describe('importProcessCommandsFromJSON', () => {
    it('should create process commands from JSON', () => {
        const process = createProcessContainer({ type: ProcessType.CUSTOM, process: () => { return 'hello'; } });
        const json = {
            commands: [
                { name: 'command1', action: '() => { return "action1"}' },
                { name: 'command2', action: '() => { return "action2"}' }
            ]
        };
        const result = importProcessCommandsFromJSON(process, json);
        expect(result).to.be.an.instanceOf(ProcessCommands);
        // expect(result.get('command1')).to.deep.equal({ name: 'command1', action: 'action1' });
        // expect(result.get('command2')).to.deep.equal({ name: 'command2', action: 'action2' });
    });
});
