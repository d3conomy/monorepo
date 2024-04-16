import { expect } from 'chai';
import { IProcessJob, jobRunner, commandSelector, runCommand } from '../src/process-interface/processJob.js';
import { IProcessCommand, IProcessCommandArgInput, IProcessCommands, IProcessExecuteCommand } from '../src/process-interface/processCommand.js';
import { ProcessStage } from '../src/process-interface/processStages.js';
import { JobId, PodProcessId, SystemId } from '../src/id-reference-factory/index.js';
import { ProcessType } from '../src/index.js';

describe('Process Job', () => {
    let processCommand: IProcessCommand<ProcessType.CUSTOM>;
    let processCommands: IProcessCommands;
    let jobId: JobId;

    beforeEach(() => {
        processCommand = {
            type: ProcessType.CUSTOM,
            name: 'command1',
            action: async (args?: Array<IProcessCommandArgInput>) => {
                // Mock implementation of process command action
                return args ? args[0].value.join(' ') : undefined;
            },
        };

        processCommands = new Map();
        processCommands.set(processCommand.name, processCommand);

        jobId = new JobId({
            componentId: new SystemId({name: 'system1'}),
            name: 'job1',
        });
        
    });

    describe('jobRunner', () => {
        it('should run the job and update the status and result', async () => {
            const job: IProcessJob = {
                jobId,
                command: 'command1',
                status: ProcessStage.NEW,
                params: new Array<IProcessCommandArgInput>({
                    name: 'values',
                    value: ['Mock', 'output'],
                }),
            };

            const result: IProcessJob = await jobRunner(job, processCommand);

            expect(result.status).to.equal(ProcessStage.FINISHED);
            expect(result.result?.output).to.deep.equal('Mock output');
        });

        it('should catch and handle errors', async () => {
            const job: IProcessJob = {
                jobId,
                command: 'command1',
                status: ProcessStage.NEW,
                params: new Array<IProcessCommandArgInput>({
                    name: 'values',
                    value: ['Mock', 'output']
                }),
            };

            processCommand = {
                type: ProcessType.CUSTOM,
                name: 'command1',
                action: async (params: any) => {
                    throw new Error('Mock error');
                },
            };

            const result = await jobRunner(job, processCommand);

            expect(result.status).to.equal(ProcessStage.ERROR);
            expect(result.result?.output).to.equal('Mock error');
        });
    });

    describe('commandSelector', () => {
        it('should return the process command for a valid job command', () => {
            const job: IProcessJob = {
                jobId,
                command: 'command1',
                status: ProcessStage.NEW,
                params: new Array<IProcessCommandArgInput>({
                    name: 'values',
                    value: ['Mock', 'output'],
                }),
            };

            const result = commandSelector(job, processCommands);

            expect(result).to.equal(processCommand);
        });

        it('should throw an error for an invalid job command', () => {
            const job: IProcessJob = {
                jobId,
                command: 'invalidCommand',
                status: ProcessStage.NEW,
                params: [],
            };

            expect(() => commandSelector(job, processCommands)).to.throw('Command invalidCommand not found');
        });

        // it('should throw an error for a command with incorrect number of arguments', () => {
        //     const job: IProcessJob = {
        //         jobId,
        //         command: 'command1',
        //         status: ProcessStage.NEW,
        //         params: [],
        //     };

        //     processCommands.set('command1', {
        //         type: ProcessType.CUSTOM,
        //         name: 'command1',
        //         action: async (params: any) => {
        //             // Mock implementation of process command action
        //             return params.values.join(' ');
        //         },
        //         args: [
        //             {
        //                 name: 'values',
        //                 description: 'Values to join',
        //                 required: true,
        //             },
        //         ],
        //     });

        //     expect(() => commandSelector(job, processCommands)).to.throw('Incorrect number of arguments for command command1');

        //     job.params = new Array<IProcessCommandArgInput>({
        //         name: 'values',
        //         value: ['Mock', 'output'],
        //     });

        //     expect(() => commandSelector(job, processCommands)).to.throw('Incorrect number of arguments for command command1');
        // });
    });

    describe('runCommand', () => {
        it('should run the command and return the job', async () => {
            const command: IProcessExecuteCommand = {
                command: 'command1',
                params: new Array<IProcessCommandArgInput>({
                    name: 'values',
                    value: ['Mock', 'output'],
                }),
            };

            const result = await runCommand(jobId, command, processCommands);

            expect(result.jobId).to.equal(jobId);
            expect(result.command).to.equal(command.command);
            expect(result.status).to.equal(ProcessStage.FINISHED);
            expect(result.result?.output).to.deep.equal('Mock output');
        });
    });
});
