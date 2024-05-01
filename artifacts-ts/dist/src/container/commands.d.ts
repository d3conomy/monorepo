interface CommandArg<T> {
    name: string;
    value?: T;
    description?: string;
    required?: boolean;
    defaultValue?: T;
}
declare class CommandError extends Error {
    command: string;
    constructor(command: string, message: string);
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
    run: ({ args, instance }: {
        args: CommandArg<any>[] | any;
        instance: any;
    }) => Promise<any>;
}
declare class Commands {
    private commands;
    private instance;
    constructor({ commands, instance }: {
        commands: Command[];
        instance?: any;
    });
    setInstance(instance: any): void;
    getInstance(): any;
    isUnique(name: string): boolean;
    add(command: Command): void;
    get(name: string): Command;
    list(): Command[];
}
export { CommandArg, CommandError, CommandResultMetrics, CommandResult, Command, Commands };
//# sourceMappingURL=commands.d.ts.map