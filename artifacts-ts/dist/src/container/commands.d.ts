interface CommandArg {
    name: string;
    description: string;
    required: boolean;
    defaultValue?: any;
}
interface CommandError extends Error {
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
    description: string;
    args: CommandArg[];
    run: (args?: CommandArg[], instance?: any) => Promise<CommandResult>;
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