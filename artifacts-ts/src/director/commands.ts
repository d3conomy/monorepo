// Utility to convert OptionRecord<any>[] or Options to CommandArg<any>[]
function optionRecordsToCommandArgs(options?: Options | OptionRecord<any>[]): CommandArg<any>[] {
    if (!options) return [];
    if (options instanceof Options) {
        return options.getRecords().map(opt => new CommandArg({
            name: opt.name,
            description: opt.description,
            value: undefined,
            required: opt.required,
            defaultValue: opt.defaultValue
        }));
    }
    if (Array.isArray(options)) {
        return options.map(opt => new CommandArg({
            name: opt.name,
            description: opt.description,
            value: undefined,
            required: opt.required,
            defaultValue: opt.defaultValue
        }));
    }
    return [];
}
import { OptionRecord, Options } from "./options.js";
import { BaseRecord, RecordManager } from "./records.js";

class CommandArg<T>
    extends OptionRecord<T>
    implements Record<'value', T | undefined>
{
    public value: T | undefined;

    constructor({
        name,
        description,
        value,
        required,
        defaultValue
    }: {
        name: string,
        description?: string,
        value: T | undefined,
        required: boolean,
        defaultValue?: T | undefined
    }) {
        super({name, description, required, defaultValue});
        this.value = value;
    }

    public toString(): string {
        return `${this.name}: ${this.value}`;
    }

    public toJSON(): any {
        return {
            name: this.name,
            description: this.description,
            value: this.value,
            required: this.required,
            defaultValue: this.defaultValue
        }
    }
}

type CommandProcess = ({args, instance}:{args: RecordManager<RunCommandArg<any>>, instance: any}) => Promise<any>;

class CommandRecord
    extends BaseRecord
    implements 
        Record<'args', CommandArg<any>[] | undefined>,
        Record<'process', CommandProcess>
{
    public readonly args: CommandArg<any>[] | undefined;
    public readonly process: CommandProcess;

    constructor({
        name,
        description,
        args,
        process
    }: {
        name: string,
        description: string,
        args?: CommandArg<any>[] | Options | OptionRecord<any>[] | undefined,
        process: CommandProcess
    }) {
        super({name, description});
        if (Array.isArray(args) && args.length && args[0] instanceof CommandArg) {
            this.args = args as CommandArg<any>[];
        } else {
            this.args = optionRecordsToCommandArgs(args as Options | OptionRecord<any>[]);
        }
        this.process = process;
    }

    public toString(): string {
        return `${this.name}`;
    }

    public toJSON(): any {
        return {
            name: this.name,
            description: this.description,
            args: this.args,
        }
    }
}

class RunCommandArg<T>
    extends BaseRecord
    implements
        Record<'value', T>
{
    public readonly value: T;

    constructor({name, description, value}: {name: string,  value: T, description?: string | undefined}) {
        super({name, description});
        this.value = value;
    }

    public toString(): string {
        return `${this.name}: ${this.value}`;
    }

    public toJSON(): any {
        return {
            name: this.name,
            description: this.description,
            value: this.value
        }
    }

    public toKeyValuePair(): [string, T] {
        return [this.name, this.value];
    }
}

const commandArg = <T>({name, value}: {name: string, value: T}): RunCommandArg<T> => {
    return new RunCommandArg<T>({name, value});
}

const commandArgs = <T = any>(args: Array<{name: string, value: T}>): Array<RunCommandArg<T>> => {
    console.log(`commandArgs: ${args}`)
    return args.map(({name, value}) => commandArg({name, value}));
}

type RunCommandResultStatus = 'success' | 'failure';

class RunCommandError
    extends Error
{
    public readonly name: string;

    constructor({name, message}: {name: string, message: string}) {
        super(message);
        this.name = name;
    }
}

type RunCommandResultMetrics = Record<"runTime" |"bytesReceived" |"bytesSent", number>;

class RunCommandResult
    extends BaseRecord
    implements
        Record<'status', RunCommandResultStatus>,
        Record<'output', any>,
        Record<'error', RunCommandError | undefined>,
        Record<'metrics', RunCommandResultMetrics | undefined>
{
    public status: RunCommandResultStatus;
    public output: any;
    public metrics: RunCommandResultMetrics
    public error: RunCommandError | undefined;

    constructor({status, output, metrics, error}: {status: RunCommandResultStatus, output: any, metrics: RunCommandResultMetrics, error?: RunCommandError}) {
        super({name: 'RunCommandResult', description: undefined})
        this.status = status;
        this.output = output;
        this.metrics = metrics;
        this.error = error;
    }

    public toString(): string {
        return `${this.status}`;
    }

    public toJSON(): any {
        return {
            status: this.status,
            output: this.output,
            metrics: this.metrics,
            error: this.error
        }
    }
}

class RunCommandRecord
    extends BaseRecord
    implements
        Record<'args', RecordManager<RunCommandArg<any>> | undefined>,
        Record<'run', CommandRecord>,
        Record<'result', RunCommandResult | undefined>
{
    public readonly args: RecordManager<RunCommandArg<any>> | undefined;
    public run: CommandRecord;
    public result: RunCommandResult | undefined;

    constructor({
        run,
        name,
        args
    }: {
        run: CommandRecord,
        name?: string | undefined,
        args?: Array<RunCommandArg<any>> | RecordManager<RunCommandArg<any>> | undefined
    }) {
        if (name !== undefined) {
            if (run === undefined) {
                throw new Error('Command is required');
            }
            if (name !== run.name) {
                throw new Error('Command name does not match');
            }
        }

        if (name === undefined) {
            if (run === undefined) {
                throw new Error('Command is required');
            }
            name = run.name;
        }

        super({name: name, description: run?.description});
        this.run = run;

        if (args instanceof Array) {
            this.args = RecordManager.fromArray(args);
        }
        else if (args instanceof RecordManager) {
            this.args = args;
        }

        // Removed invalid .runTimeArgs usage
        // If you need to process args, do it here with array methods or utility functions

        console.log(`RunCommandRecord: ${this.name} - ${this.args}`)
    }

    public setResult(result: RunCommandResult): void {
        this.result = result;
    }

    public toString(): string {
        return `${this.name} - ${this.result?.status}`;
    }

    public toJSON(): any {
        return {
            name: this.name,
            description: this.description,
            args: this.args,
            run: this.run,
            result: this.result
        }
    }
}

class CommandsManager
    extends RecordManager<CommandRecord>
    // implements 
        // Record<'completed', RecordManager<RunCommandRecord>> 
{
    // public completed: RecordManager<RunCommandRecord> = new RecordManager<RunCommandRecord>();

    constructor(records?: CommandRecord[]) {
        super();
        if (records) {
            for (const record of records) {
                this.addRecord(record);
            }
        }
    }

    public createCommand({
        name,
        description,
        args,
        process
    }: {
        name: string,
        description: string,
        args?: Options | OptionRecord<any>[],
        process: CommandProcess
    }): CommandRecord {
        const record = new CommandRecord({name, description, args, process});
        this.addRecord(record);
        return record;
    }
}


export {
    CommandRecord,
    CommandProcess,
    CommandsManager,
    RunCommandArg,
    commandArg,
    commandArgs,
    RunCommandResult,
    RunCommandResultStatus,
    RunCommandError,
    RunCommandRecord
}