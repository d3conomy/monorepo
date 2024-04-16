class ProcessCommands extends Map {
    constructor(...commands) {
        super(commands.map((command) => [command.name, command]));
    }
    isUnique(name) {
        return !this.has(name);
    }
}
export { ProcessCommands };
