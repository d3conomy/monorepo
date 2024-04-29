import { expect } from 'chai';
import { IProcessCommand, IProcessCommandArg, IProcessCommandArgInput, IProcessCommandOutput, IProcessExecuteCommand, ProcessCommands } from '../src/process-interface/processCommand.js';
import { ProcessType, createProcessContainer } from '../src/process-interface/index.js';
import { importFromFile, importProcessCommandsFromJSON, importProcessContainerFromJSON } from '../src/process-interface/processImport.js';
import { runCommand } from '../src/process-interface/processJob.js';
import { JobId, SystemId } from '../src/id-reference-factory/index.js';

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
        action: (args?: Array<IProcessCommandArgInput>) => {return args ? args[0].value : undefined;},
        description: 'Test command',
    };

    const processCommands: ProcessCommands = new ProcessCommands({
        commands: [processCommand],
        container: createProcessContainer({
            type: ProcessType.CUSTOM,
            instance: () => console.log('test')
        })
    });

    const processCommandOutput: IProcessCommandOutput = {
        output: 'output',
        runtime: 10,
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
        // console.log(processCommand.action(processExecuteCommand.params))
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
        // console.log(processCommands);
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
            action: (args?: Array<IProcessCommandArgInput>) => {return args ? args[0].value : undefined;},
            args: [processCommandArg],
            description: 'Test command',
        };
        expect(processCommand).to.exist;
        expect(processCommand).to.be.an('object');
    });

    it('should import process command classes', async () => {
        const json = await importFromFile("tests/exampleCommands.json");
        const processContainer = importProcessContainerFromJSON(json);
        const processCommands = importProcessCommandsFromJSON(processContainer, json);
        // console.log(processCommands);
        expect(processCommands).to.exist;
        expect(processCommands).to.be.an('map');
    });

    it('should run an imported process command', async () => {
        const json = await importFromFile("tests/exampleCommands.json");
        const processContainer = importProcessContainerFromJSON(json);
        const processCommands = importProcessCommandsFromJSON(processContainer, json);
        const processCommand = processCommands.get('custom-hello');
        const processCommandArgInputCustom: IProcessCommandArgInput = {
            name: 'name',
            value: 'test',
        };
        const processExecuteCommand: IProcessExecuteCommand = {
            command: processCommand? processCommand.name : 'custom-hello',
            params: new Array<IProcessCommandArgInput>(processCommandArgInputCustom),
            result: processCommandOutput,
        };
        expect(processCommand).to.exist;
        expect(processCommand).to.be.an('object');

        const jobId = new JobId({
            name: 'testJob',
            componentId: new SystemId({name: 'testSystem'}),
        })
        const job = await runCommand(jobId, processExecuteCommand, processCommands);
        // console.log(job);
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
            componentId: new SystemId({name: 'testSystem'}),
        })
        const job = await runCommand(jobId, processExecuteCommand, processCommands);
        // console.log(job);
        expect(job).to.exist;
        expect(job).to.be.an('object');
        expect(job.result).to.exist;
        expect(job.result).to.be.an('object');
        expect(job.result?.output).to.equal('test');
    });

    it('should run the imported process command - goodbye', async () => {
        const json = await importFromFile("tests/exampleCommands.json");
        const processContainer = importProcessContainerFromJSON(json);
        const processCommands = importProcessCommandsFromJSON(processContainer, json);
        const processCommand = processCommands.get('custom-goodbye');
        const processCommandArgInputCustom: IProcessCommandArgInput = {
            name: 'name',
            value: 'test',
        };
        const processExecuteCommand: IProcessExecuteCommand = {
            command: processCommand? processCommand.name : 'custom-goodbye',
            params: new Array<IProcessCommandArgInput>(processCommandArgInputCustom),
            result: processCommandOutput,
        };
        expect(processCommand).to.exist;
        expect(processCommand).to.be.an('object');

        const jobId = new JobId({
            name: 'testJob',
            componentId: new SystemId({name: 'testSystem'}),
        })
        const job = await runCommand(jobId, processExecuteCommand, processCommands);
        // console.log(job);
        expect(job).to.exist;
        expect(job).to.be.an('object');
        expect(job.result).to.exist;
        expect(job.result).to.be.an('object');
        expect(job.result?.output).to.equal('Goodbye test!');
    });

    it('should run the imported process command - custom-add', async () => {
        const json = await importFromFile("tests/exampleCommands.json");
        const processContainer = importProcessContainerFromJSON(json);
        const processCommands = importProcessCommandsFromJSON(processContainer, json);
        const processCommand = processCommands.get('custom-add');
        const processCommandArgInputCustom: IProcessCommandArgInput = {
            name: 'num1',
            value: 1
        };
        const procesCommandArgInputCustom2: IProcessCommandArgInput = {
            name: 'num2',
            value: 2
        };
        const processExecuteCommand: IProcessExecuteCommand = {
            command: processCommand? processCommand.name : 'custom-add',
            params: new Array<IProcessCommandArgInput>(processCommandArgInputCustom, procesCommandArgInputCustom2),
            result: processCommandOutput,
        };
        expect(processCommand).to.exist;
        expect(processCommand).to.be.an('object');

        const jobId = new JobId({
            name: 'testJob',
            componentId: new SystemId({name: 'testSystem'}),
        })
        const job = await runCommand(jobId, processExecuteCommand, processCommands);
        // console.log(job);
        expect(job).to.exist;
        expect(job).to.be.an('object');
        expect(job.result).to.exist;
        expect(job.result).to.be.an('object');
        expect(job.result?.output).to.equal('The sum of 1 and 2 is 3');
    })

    it('should run the imported process command - custom-run-process', async () => {
        const json = await importFromFile("tests/exampleCommands.json");
        const processContainer = importProcessContainerFromJSON(json);
        const processCommands = importProcessCommandsFromJSON(processContainer, json);
        const processCommand = processCommands.get('custom-run-process');
        // console.log(processCommand);
        const processCommandArgInputCustom: IProcessCommandArgInput = {
            name: 'custom',
            value: 'custom-hello'
        };
        const processExecuteCommand: IProcessExecuteCommand = {
            command: processCommand? processCommand.name : 'custom-run-process',
            params: new Array<IProcessCommandArgInput>(processCommandArgInputCustom),
            result: processCommandOutput,
        };
        expect(processCommand).to.exist;
        expect(processCommand).to.be.an('object');
        expect(processCommands.container).to.exist;

        const jobId = new JobId({
            name: 'testJob',
            componentId: new SystemId({name: 'testSystem'}),
        })
        const job = await runCommand(jobId, processExecuteCommand, processCommands);
        console.log(job);
        expect(job).to.exist;
        expect(job).to.be.an('object');
        expect(job.result).to.exist;
        expect(job.result).to.be.an('object');
        expect(job.result?.output).to.equal('Process has been run custom-hello');
    });

});
