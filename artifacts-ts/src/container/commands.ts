interface CommandArg<T> {
    name: string;
    value?: T;
    description?: string;
    required?: boolean;
    defaultValue?: T;
}

class CommandError extends Error {
    command: string;

    constructor(command: string, message: string) {
        super(message);
        this.command = command;
        this.name = 'CommandError';
    }
}

interface CommandResultMetrics {
    runtime: number;
    bytesUploaded: number;
    bytesDownloaded: number;
}

interface CommandResult {
    output: any;
    error?: CommandError;
    metrics: CommandResultMetrics;
}

interface Command {
    name: string;
    description?: string;
    args?: CommandArg<any>[];

    run: ({args, instance}:{args: CommandArg<any>[] | any, instance: any }) => Promise<any>;
}

class Commands {
    private commands: Command[] = [];
    private instance: any;

    constructor({commands, instance}: {commands: Command[], instance?: any}) {
        this.instance = instance;
        for (const command of commands) {
            this.add(command);
        }
    }

    setInstance(instance: any) {
        this.instance = instance;
    }

    getInstance(): any {
        return this.instance;
    }

    isUnique(name: string): boolean {
        return !this.commands.some((command) => command.name === name);
    }

    add(command: Command): void {
        if (!this.isUnique(command.name)) {
            throw new CommandError(command.name, `Command already exists`);
        }
        this.commands.push(command);
    }

    get(name: string): Command {
        const command = this.commands.find((command) => command.name === name);

        if (!command) {
            throw new CommandError(name, `Command not found`);
        }

        return command;
    }

    list(): Command[] {
        return this.commands;
    }

}

export {
    CommandArg,
    CommandError,
    CommandResultMetrics,
    CommandResult,
    Command,
    Commands
}
