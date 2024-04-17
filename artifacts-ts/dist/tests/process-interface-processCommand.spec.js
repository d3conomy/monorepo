import { expect } from 'chai';
import { importProcessCommands, ProcessCommands } from '../src/process-interface/processCommand.js';
import { ProcessType } from '../src/process-interface/index.js';
import { runCommand } from '../src/process-interface/processJob.js';
import { JobId, SystemId } from '../src/id-reference-factory/index.js';
describe('Process Command Tests', () => {
    const processCommandArg = {
        name: 'arg1',
        description: 'Argument 1',
        required: true,
    };
    const processCommandArgInput = {
        name: processCommandArg.name,
        value: 'test',
    };
    const processCommand = {
        name: 'testCommand',
        type: ProcessType.CUSTOM,
        args: [processCommandArg],
        action: (args) => { return args ? args[0].value : undefined; },
        description: 'Test command',
    };
    const processCommands = new ProcessCommands({
        commands: [processCommand],
        proc: () => console.log('test')
    });
    const processCommandOutput = {
        output: 'output',
        runtime: 10,
    };
    const processExecuteCommand = {
        command: processCommand.name,
        params: new Array(processCommandArgInput),
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
        console.log(processCommand.action(processExecuteCommand.params));
        expect(processCommand.action(processExecuteCommand.params)).to.equal('test');
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
    it('should create a process command argument', () => {
        const processCommandArg = {
            name: 'arg1',
            description: 'Argument 1',
            required: true,
        };
        expect(processCommandArg).to.exist;
        expect(processCommandArg).to.be.an('object');
    });
    it('should create a process command', () => {
        const processCommand = {
            name: 'testCommand',
            action: (args) => { return args ? args[0].value : undefined; },
            args: [processCommandArg],
            description: 'Test command',
        };
        expect(processCommand).to.exist;
        expect(processCommand).to.be.an('object');
    });
    it('should import process command classes', async () => {
        const processCommands = await importProcessCommands("tests/exampleCommands.json");
        console.log(processCommands);
        expect(processCommands).to.exist;
        expect(processCommands).to.be.an('map');
    });
    it('should run an imported process command', async () => {
        const processCommands = await importProcessCommands("tests/exampleCommands.json");
        const processCommand = processCommands.get('custom-hello');
        const processCommandArgInputCustom = {
            name: 'name',
            value: 'test',
        };
        const processExecuteCommand = {
            command: processCommand ? processCommand.name : 'custom-hello',
            params: new Array(processCommandArgInputCustom),
            result: processCommandOutput,
        };
        expect(processCommand).to.exist;
        expect(processCommand).to.be.an('object');
        const jobId = new JobId({
            name: 'testJob',
            componentId: new SystemId({ name: 'testSystem' }),
        });
        const job = await runCommand(jobId, processExecuteCommand, processCommands);
        console.log(job);
        expect(job).to.exist;
        expect(job).to.be.an('object');
        expect(job.result).to.exist;
        expect(job.result).to.be.an('object');
        expect(job.result?.output).to.equal('Hello test!');
        // expect(processCommand?.action(processExecuteCommand.params)).to.equal('Hello test!');
    });
    it('should run a process command', async () => {
        const jobId = new JobId({
            name: 'testJob',
            componentId: new SystemId({ name: 'testSystem' }),
        });
        const job = await runCommand(jobId, processExecuteCommand, processCommands);
        console.log(job);
        expect(job).to.exist;
        expect(job).to.be.an('object');
        expect(job.result).to.exist;
        expect(job.result).to.be.an('object');
        expect(job.result?.output).to.equal('test');
    });
    it('should run the imported process command - goodbye', async () => {
        const processCommands = await importProcessCommands("tests/exampleCommands.json");
        const processCommand = processCommands.get('custom-goodbye');
        const processCommandArgInputCustom = {
            name: 'name',
            value: 'test',
        };
        const processExecuteCommand = {
            command: processCommand ? processCommand.name : 'custom-goodbye',
            params: new Array(processCommandArgInputCustom),
            result: processCommandOutput,
        };
        expect(processCommand).to.exist;
        expect(processCommand).to.be.an('object');
        const jobId = new JobId({
            name: 'testJob',
            componentId: new SystemId({ name: 'testSystem' }),
        });
        const job = await runCommand(jobId, processExecuteCommand, processCommands);
        console.log(job);
        expect(job).to.exist;
        expect(job).to.be.an('object');
        expect(job.result).to.exist;
        expect(job.result).to.be.an('object');
        expect(job.result?.output).to.equal('Goodbye test!');
    });
    it('should run the imported process command - custom-add', async () => {
        const processCommands = await importProcessCommands("tests/exampleCommands.json");
        const processCommand = processCommands.get('custom-add');
        const processCommandArgInputCustom = {
            name: 'num1',
            value: 1
        };
        const procesCommandArgInputCustom2 = {
            name: 'num2',
            value: 2
        };
        const processExecuteCommand = {
            command: processCommand ? processCommand.name : 'custom-add',
            params: new Array(processCommandArgInputCustom, procesCommandArgInputCustom2),
            result: processCommandOutput,
        };
        expect(processCommand).to.exist;
        expect(processCommand).to.be.an('object');
        const jobId = new JobId({
            name: 'testJob',
            componentId: new SystemId({ name: 'testSystem' }),
        });
        const job = await runCommand(jobId, processExecuteCommand, processCommands);
        console.log(job);
        expect(job).to.exist;
        expect(job).to.be.an('object');
        expect(job.result).to.exist;
        expect(job.result).to.be.an('object');
        expect(job.result?.output).to.equal('The sum of 1 and 2 is 3');
    });
    it('should run the imported process command - custom-run-process', async () => {
        const processCommands = await importProcessCommands("tests/exampleCommands.json");
        const processCommand = processCommands.get('custom-run-process');
        console.log(processCommand);
        const processCommandArgInputCustom = {
            name: 'custom',
            value: 'custom-hello'
        };
        const processExecuteCommand = {
            command: processCommand ? processCommand.name : 'custom-run-process',
            params: new Array(processCommandArgInputCustom),
            result: processCommandOutput,
        };
        expect(processCommand).to.exist;
        expect(processCommand).to.be.an('object');
        // expect(processCommand?.process).to.exist;
        const jobId = new JobId({
            name: 'testJob',
            componentId: new SystemId({ name: 'testSystem' }),
        });
        const job = await runCommand(jobId, processExecuteCommand, processCommands);
        console.log(job);
        expect(job).to.exist;
        expect(job).to.be.an('object');
        expect(job.result).to.exist;
        expect(job.result).to.be.an('object');
        expect(job.result?.output).to.equal('Process has been run custom-hello');
    });
});
