import { expect } from 'chai';
import { IProcessCommand, IProcessCommandArg, IProcessCommandArgInput, IProcessCommandOutput, IProcessExecuteCommand, ProcessCommands } from '../src/process-interface/processCommand.js';
import { ProcessType } from '../src/process-interface/index.js';

describe('Process Command Tests', () => {
    const processCommandArg: IProcessCommandArg = {
        name: 'arg1',
        description: 'Argument 1',
        required: true,
    };

    const processCommandArgInput: IProcessCommandArgInput = {
        name: processCommandArg.name,
        value: 'test',
    };

    const processCommand: IProcessCommand = {
        name: 'testCommand',
        type: ProcessType.CUSTOM,
        args: [processCommandArg],
        action: (args: Array<IProcessCommandArgInput>) => {return args[0].value;},
        description: 'Test command',
    };

    const processCommands: ProcessCommands = new ProcessCommands(processCommand);

    const processCommandOutput: IProcessCommandOutput = {
        output: 'output',
        runtime: new Date("1s"),
    };

    const processExecuteCommand: IProcessExecuteCommand = {
        command: processCommand.name,
        params: new Array<IProcessCommandArgInput>(processCommandArgInput),
        result: processCommandOutput,
    };

    it('should have a name', () => {
        expect(processCommand.name).to.exist;
        expect(processCommand.name).to.be.a('string');
        expect(processCommand.name).to.equal('testCommand');
    });

    it('should have a type', () => {
        expect(processCommand.type).to.exist;
        expect(processCommand.type).to.be.a('string');
        expect(processCommand.type).to.equal(ProcessType.CUSTOM);
    });

    it('should have an action', () => {
        expect(processCommand.action).to.exist;
        expect(processCommand.action).to.be.a('function');
        console.log(processCommand.action(processExecuteCommand.params))
        expect(processCommand.action(processExecuteCommand.params)).to.equal('test')
    });

    it('should have a description', () => {
        expect(processCommand.description).to.exist;
        expect(processCommand.description).to.be.a('string');
    });

    it('should have a command in execute command', () => {
        expect(processExecuteCommand.command).to.exist;
        expect(processExecuteCommand.command).to.be.a('string');
        expect(processExecuteCommand.command).to.equal('testCommand');
    });

    it('should have arguments in execute command', () => {
        expect(processExecuteCommand.params).to.exist;
        expect(processExecuteCommand.params).to.be.an('array');
        expect(processExecuteCommand.params).to.have.lengthOf(1);
    });

    it('should have a result in execute command', () => {
        expect(processExecuteCommand.result).to.exist;
        expect(processExecuteCommand.result).to.be.an('object');
    });

    it('should have an array with the available commands', () => {
        expect(processCommands).to.exist;
        expect(processCommands).to.be.an('map');
        expect(processCommands).to.have.lengthOf(1);
    });

    it('should check if a command is unique', () => {
        console.log(processCommands);
        expect(processCommands.isUnique('testCommand')).to.be.false;
        expect(processCommands.isUnique('testCommand2')).to.be.true;
    });


});
