import { expect } from 'chai';


/****************************************************
 * 
 * BaseRecord
 * 
 ****************************************************/
import { BaseRecord, OptionRecord, Options } from '../src/director/index.js';

describe('BaseRecord', () => {
    it('should create a new BaseRecord', () => {
        class TestRecord extends BaseRecord {
            constructor({name, description}: {name: string, description?: string}) {
                super({name, description});
            }

            public toString(): string {
                return `${this.name}`;
            }

            public toJSON(): any {
                return {
                    name: this.name,
                    description: this.description
                }
            }
        }
        
        const record = new TestRecord({name: 'test'});
        expect(record.name).to.equal('test');
        expect(record.description).to.equal(undefined);
    });

    it('should create a new BaseRecord with description', () => {
        class TestRecord extends BaseRecord {
            constructor({name, description}: {name: string, description?: string}) {
                super({name, description});
            }

            public toString(): string {
                return `${this.name}`;
            }

            public toJSON(): any {
                return {
                    name: this.name,
                    description: this.description
                }
            }
        }
        
        const record = new TestRecord({name: 'test', description: 'test description'});
        expect(record.name).to.equal('test');
        expect(record.description).to.equal('test description');
    });
});



/**
 * 
 * RecordManager
 * 
 */
import { RecordManager } from '../src/director/index.js';

describe('RecordManager', () => {
    it('should create a new RecordManager', () => {
        class TestRecord extends BaseRecord {
            constructor({name, description}: {name: string, description?: string}) {
                super({name, description});
            }

            public toString(): string {
                return `${this.name}`;
            }

            public toJSON(): any {
                return {
                    name: this.name,
                    description: this.description
                }
            }
        }

        const manager = new RecordManager<TestRecord>();
        expect(manager).to.be.an.instanceOf(RecordManager);
    });

    it('should add a record', () => {
        class TestRecord extends BaseRecord {
            constructor({name, description}: {name: string, description?: string}) {
                super({name, description});
            }

            public toString(): string {
                return `${this.name}`;
            }

            public toJSON(): any {
                return {
                    name: this.name,
                    description: this.description
                }
            }
        }

        const manager = new RecordManager<TestRecord>();
        const record = new TestRecord({name: 'test'});
        manager.addRecord(record);
        expect(manager.getRecordCount()).to.equal(1);
    });

    it('should remove a record', () => {
        class TestRecord extends BaseRecord {
            constructor({name, description}: {name: string, description?: string}) {
                super({name, description});
            }

            public toString(): string {
                return `${this.name}`;
            }

            public toJSON(): any {
                return {
                    name: this.name,
                    description: this.description
                }
            }
        }

        const manager = new RecordManager<TestRecord>();
        const record = new TestRecord({name: 'test'});
        manager.addRecord(record);
        manager.removeRecord(record);
        expect(manager.getRecordCount()).to.equal(0);
    });

    it('should get a record', () => {
        class TestRecord extends BaseRecord {
            constructor({name, description}: {name: string, description?: string}) {
                super({name, description});
            }

            public toString(): string {
                return `${this.name}`;
            }

            public toJSON(): any {
                return {
                    name: this.name,
                    description: this.description
                }
            }
        }

        const manager = new RecordManager<TestRecord>();
        const record = new TestRecord({name: 'test'});
        manager.addRecord(record as TestRecord);
        expect(manager.getRecord('test')).to.equal(record);
    });

    it('should get all records', () => {
        class TestRecord extends BaseRecord {
            constructor({name, description}: {name: string, description?: string}) {
                super({name, description});
            }

            public toString(): string {
                return `${this.name}`;
            }

            public toJSON(): any {
                return {
                    name: this.name,
                    description: this.description
                }
            }
        }

        const manager = new RecordManager<TestRecord>();
        const record = new TestRecord({name: 'test'});
        manager.addRecord(record);
        expect(manager.getRecords()).to.deep.equal([record]);
    });

    it('should get all discarded records', () => {
        class TestRecord extends BaseRecord {
            constructor({name, description}: {name: string, description?: string}) {
                super({name, description});
            }

            public toString(): string {
                return `${this.name}`;
            }

            public toJSON(): any {
                return {
                    name: this.name,
                    description: this.description
                }
            }
        }

        const manager = new RecordManager<TestRecord>();
        const record = new TestRecord({name: 'test'});
        manager.addRecord(record);
        manager.removeRecord(record);
        expect(manager.getDiscardedRecords()).to.deep.equal([record]);
    });

    it('should get record count', () => {
        class TestRecord extends BaseRecord {
            constructor({name, description}: {name: string, description?: string}) {
                super({name, description});
            }

            public toString(): string {
                return `${this.name}`;
            }

            public toJSON(): any {
                return {
                    name: this.name,
                    description: this.description
                }
            }
        }

        const manager = new RecordManager<TestRecord>();
        const record = new TestRecord({name: 'test'});
        manager.addRecord(record);
        expect(manager.getRecordCount()).to.equal(1);
    });
});


/**
 * 
 * IdentityRecord
 * 
 */
import { IdentityRecord, IdentityManager, IdentityReferenceTypeUUID, IdentityReferenceTypeCustom } from '../src/director/index.js';

describe('IdentityRecord', () => {
    it('should create a new IdentityRecord', () => {
        const identity = new IdentityRecord({ id: 'test', type: IdentityReferenceTypeCustom });
        expect(identity.id).to.equal('test');
        expect(identity.type.format).to.equal(`custom`);
    });

    it('should create a new IdentityRecord with parent', () => {
        const parent = new IdentityRecord({ type: IdentityReferenceTypeUUID });
        const identity = new IdentityRecord({ id: 'test', type: IdentityReferenceTypeCustom, parent });
        expect(identity.id).to.equal('test');
        expect(identity.type.format).to.equal(`custom`);
        expect(identity.parent).to.equal(parent);
    });

    it('should output a string', () => {
        const identity = new IdentityRecord({ id: 'test', type: IdentityReferenceTypeCustom });
        console.log(`identity: ${identity.toString()}`)
        expect(identity.toString()).to.equal('test');
    });

    it('should output JSON', () => {
        const identity = new IdentityRecord({ id: 'test', type: IdentityReferenceTypeCustom });
        console.log(`identity: ${JSON.stringify(identity.toJSON().type)}`)
        expect(identity.toJSON().type.format).to.equal('custom');
    });
});

describe('IdentityManager', () => {
    it('should create a new IdentityManager', () => {
        const manager = new IdentityManager();
        expect(manager).to.be.an.instanceOf(IdentityManager);
    });

    it('should create a new IdentityRecord', () => {
        const manager = new IdentityManager();
        const identity = manager.createIdentity({type: IdentityReferenceTypeUUID });
        // expect(identity.id).to.equal('test');
        expect(identity.type.format).to.equal(`uuid`);
    });
});



import { CommandRecord, CommandProcess  } from '../src/director/index.js';

describe('CommandRecord', () => {
    it('should create a new CommandRecord', () => {
        const process: CommandProcess = async ({args, instance}) => {
            return args;
        };
        const record = new CommandRecord({name: 'test', description: 'test description', process});
        expect(record.name).to.equal('test');
        expect(record.description).to.equal('test description');
    });
});



import { RunCommandArg, commandArg, commandArgs } from '../src/director/index.js';

describe('RunCommandArg', () => {
    it('should create a new RunCommandArg', () => {
        const idm = new IdentityManager();
        const id = idm.createIdentity({type: IdentityReferenceTypeUUID});
        const arg = new RunCommandArg({name: 'test', value: 'test value'});
        expect(arg.name).to.equal('test');
        expect(arg.value).to.equal('test value');
    });

    it('should create a new RunCommandArg with description', () => {
        const idm = new IdentityManager();
        const id = idm.createIdentity({type: IdentityReferenceTypeUUID});
        const arg = new RunCommandArg({name: 'test', value: 'test value', description: 'test description'});
        expect(arg.name).to.equal('test');
        expect(arg.value).to.equal('test value');
        expect(arg.description).to.equal('test description');
    });

    it('should create a new commandarg', () => {
        const idm = new IdentityManager();
        const id = idm.createIdentity({type: IdentityReferenceTypeUUID});
        const arg = commandArg<string>({name: 'test', value: 'test value'});
        expect(arg.name).to.equal('test');
        expect(arg.value).to.equal('test value');
    });

    it('should create a new array of commandargs', () => {
        const idm = new IdentityManager();
        const id = idm.createIdentity({type: IdentityReferenceTypeUUID});
        const arg = commandArgs([
            {name: 'test', value: 'test value'},
            {name: 'test2', value: 'test value2'}
        ]);
        expect(arg[0].name).to.equal('test');
        expect(arg[0].value).to.equal('test value');
        expect(arg[1].name).to.equal('test2');
        expect(arg[1].value).to.equal('test value2');
    });
});

import { RunCommandRecord, RunCommandResult, RunCommandError } from '../src/director/index.js';

describe('RunCommandRecord', () => {
    it('should create a new RunCommandRecord', () => {
        const idm = new IdentityManager();
        const id = idm.createIdentity({type: IdentityReferenceTypeUUID});
        const process = async ({args}:{args: RecordManager<RunCommandArg<any>>}) => { return args};
        const runCommand = new CommandRecord({name: 'test', description: 'test description', process});
        const record = new RunCommandRecord({run: runCommand});
        expect(record.name).to.equal('test');
        expect(record.description).to.equal('test description');
    });

    it('should create a new RunCommandResult', () => {
        const result = new RunCommandResult({status: 'success', output: 'test', metrics: {runTime: 1, bytesReceived: 1, bytesSent: 1}});
        expect(result.status).to.equal('success');
        expect(result.output).to.equal('test');
        expect(result.metrics.runTime).to.equal(1);
        expect(result.metrics.bytesReceived).to.equal(1);
        expect(result.metrics.bytesSent).to.equal(1);
    });

    it('should create a new RunCommandResult with error', () => {
        const error = new RunCommandError({name: 'test', message: 'test message'});
        const result = new RunCommandResult({status: 'failure', output: 'test', metrics: {runTime: 1, bytesReceived: 1, bytesSent: 1}, error});
        expect(result.status).to.equal('failure');
        expect(result.output).to.equal('test');
        expect(result.metrics.runTime).to.equal(1);
        expect(result.metrics.bytesReceived).to.equal(1);
        expect(result.metrics.bytesSent).to.equal(1);
        expect(result.error).to.equal(error);
    });

    it('should create a RunCommandArg', () => {
        const arg = new RunCommandArg({name: 'test', value: 'test value'});
        expect(arg.name).to.equal('test');
        expect(arg.value).to.equal('test value');
    });

    it('should create a RunCommandArg with description', () => {
        const arg = new RunCommandArg({name: 'test', value: 'test value', description: 'test description'});
        expect(arg.name).to.equal('test');
        expect(arg.value).to.equal('test value');
        expect(arg.description).to.equal('test description');
    });

    it('should create a RunCommandArg with value type', () => {
        const arg = new RunCommandArg({name: 'test', value: 1});
        expect(arg.name).to.equal('test');
        expect(arg.value).to.equal(1);
    });

    it('should export to string', () => {
        const arg = new RunCommandArg({name: 'test', value: 1});
        expect(arg.toString()).to.equal('test: 1');
    });
});


/**
 * 
 *  Jobs
 */
import { JobChain, JobStatus, JobRecord, JobQueue } from '../src/director/index.js';

describe('JobChain', () => {
    it('should create a new JobChain', () => {
        const chain: JobChain = {previous: undefined, next: undefined};
        expect(chain.previous).to.equal(undefined);
        expect(chain.next).to.equal(undefined);
    });

    it('should create a new JobChain with previous and next', () => {
        const idm = new IdentityManager();
        const previous = idm.createIdentity({type: IdentityReferenceTypeUUID});
        const next = idm.createIdentity({type: IdentityReferenceTypeUUID});
        const chain: JobChain = {previous, next};
        expect(chain.previous).to.equal(previous);
        expect(chain.next).to.equal(next);
    });
});

describe('JobRecord', () => {
    it('should create a new JobRecord', () => {
        const idm = new IdentityManager();
        const id = idm.createIdentity({type: IdentityReferenceTypeUUID});
        const process = async ({args}:{args: RecordManager<RunCommandArg<any>>}) => { return args};
        const command = new CommandRecord({name: 'test', description: 'test description', process});
        const runCommand = new RunCommandRecord({run: command});
        const record = new JobRecord({id, command: runCommand});
        expect(record.name).to.equal('JobRecord');
        expect(record.description).to.equal('Job Record for test');
    });

    it('should create a new JobRecord with chain', () => {
        const idm = new IdentityManager();
        const id = idm.createIdentity({type: IdentityReferenceTypeUUID});
        const process = async ({args}:{args: RecordManager<RunCommandArg<any>>}) => { return args};
        const command = new CommandRecord({name: 'test', description: 'test description', process});
        const runCommand = new RunCommandRecord({run: command});
        const previous = idm.createIdentity({type: IdentityReferenceTypeUUID});
        const next = idm.createIdentity({type: IdentityReferenceTypeUUID});
        const record = new JobRecord({id, command: runCommand, previous, next});
        expect(record.name).to.equal('JobRecord');
        expect(record.description).to.equal('Job Record for test');
        expect(record.chain.previous).to.equal(previous);
        expect(record.chain.next).to.equal(next);
    });

});

describe('JobQueue', () => {
    const instance = async () => { return 'test'};
    it('should create a new JobQueue', () => {
        const queue = new JobQueue({instance});
        expect(queue).to.be.an.instanceOf(JobQueue);
    });

    it('should add a job', () => {
        const idm = new IdentityManager();
        const id = idm.createIdentity({type: IdentityReferenceTypeUUID});
        const process = async ({args, instance}:{args: RecordManager<RunCommandArg<any>>, instance: any}) => { return instance()};
        const command = new CommandRecord({name: 'test', description: 'test description', process});
        const runCommand = new RunCommandRecord({run: command});
        const job = new JobRecord({id, command: runCommand});
        const queue = new JobQueue({instance});
        queue.addRecord(job);
        expect(queue.getRecordCount()).to.equal(1);
    });

    it('should remove a job', () => {
        const idm = new IdentityManager();
        const id = idm.createIdentity({type: IdentityReferenceTypeUUID});
        const process = async ({args}:{args: RecordManager<RunCommandArg<any>>}) => { return args};
        const command = new CommandRecord({name: 'test', description: 'test description', process});
        const runCommand = new RunCommandRecord({run: command});
        const job = new JobRecord({id, command: runCommand});
        const queue = new JobQueue({instance});
        queue.enqueue(job);
        queue.dequeue();
        console.log(`queue: ${JSON.stringify(queue)}`)
        expect(queue.getRecordCount()).to.equal(1);
    });

    it('should get a job', () => {
        const idm = new IdentityManager();
        const id = idm.createIdentity({type: IdentityReferenceTypeUUID});
        const process = async ({args}:{args: RecordManager<RunCommandArg<any>>}) => { return args.getRecordCountTotal()};
        const command = new CommandRecord({name: 'test', description: 'test description', process});
        const runCommand = new RunCommandRecord({run: command});
        const job = new JobRecord({id, command: runCommand});
        const queue = new JobQueue({instance});
        queue.enqueue(job);
        expect(queue.getJobById(job.id)).to.equal(job);
    });

    it('should get all jobs', () => {
        const idm = new IdentityManager();
        const id = idm.createIdentity({type: IdentityReferenceTypeUUID});
        const process = async ({args}:{args: RecordManager<RunCommandArg<any>>}) => { return args};
        const command = new CommandRecord({name: 'test', description: 'test description', process});
        const runCommand = new RunCommandRecord({run: command});
        const job = new JobRecord({id, command: runCommand});
        const queue = new JobQueue({instance});
        queue.addRecord(job);
        expect(queue.getRecords()).to.deep.equal([job]);
    });

    it('should get all completed jobs', () => {
        const idm = new IdentityManager();
        const id = idm.createIdentity({type: IdentityReferenceTypeUUID});
        const process = async ({args}:{args: RecordManager<RunCommandArg<any>>}) => { return args};
        const command = new CommandRecord({name: 'test', description: 'test description', process});
        const runCommand = new RunCommandRecord({run: command});
        const job = new JobRecord({id, command: runCommand});
        const queue = new JobQueue({instance});
        queue.addRecord(job);
        job.status = 'completed';
        queue.complete(job);
        expect(queue.completedRecords).to.deep.equal([job]);
    });

    it('should get all failed jobs', () => {
        const idm = new IdentityManager();
        const id = idm.createIdentity({type: IdentityReferenceTypeUUID});
        const process = async ({args}:{args: RecordManager<RunCommandArg<any>>}) => { return args};
        const command = new CommandRecord({name: 'test', description: 'test description', process});
        const runCommand = new RunCommandRecord({run: command});
        const job = new JobRecord({id, command: runCommand});
        const queue = new JobQueue({instance});
        queue.addRecord(job);
        job.status = 'failed';
        queue.complete(job);
        expect(queue.failedJobs).to.deep.equal([job]);
    });

    it('should run a job', async () => {
        const idm = new IdentityManager();
        const id = idm.createIdentity({type: IdentityReferenceTypeUUID});
        const process = async ({args, instance}:{args: RecordManager<RunCommandArg<any>>, instance: any}) => { return await args.getRecordCountTotal()};
        const command = new CommandRecord({name: 'test', description: 'test description', process});
        const runCommand = new RunCommandRecord({run: command, args: commandArgs([{name: 'test', value: 'test value'}])});
        const job = new JobRecord({id, command: runCommand});
        const queue = new JobQueue({instance});
        queue.enqueue(job);
        const result = await queue.run();
        console.log(`result: ${JSON.stringify(result[0].toJSON())}`)
        expect(result[0]).to.deep.equal(job);
    });

    it('should run a job with args', async () => {
        const idm = new IdentityManager();
        const id = idm.createIdentity({type: IdentityReferenceTypeUUID});
        const optionArg = new OptionRecord<string>({name: 'test', description: 'test description'})
        const args = new Options()
        args.addRecord(optionArg);
        const process = async ({args, instance}:{args: RecordManager<RunCommandArg<any>>, instance: any}) => { return await args.getRecordCount()};
        const command = new CommandRecord({name: 'test', args, description: 'test description', process});
        console.log(`command: ${JSON.stringify(command)}`)
        const runCommand = new RunCommandRecord({run: command, args: commandArgs([{name: 'test', value: 'test value'}])});
        const job = new JobRecord({id, command: runCommand});
        const queue = new JobQueue({instance});
        queue.enqueue(job);
        const result = await queue.run();
        console.log(`result: ${JSON.stringify(result[0].toJSON())}`)
        expect(result[0]).to.deep.equal(job);
    });
});
