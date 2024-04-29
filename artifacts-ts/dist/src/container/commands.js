class Commands {
    commands = [];
    instance;
    constructor({ commands, instance }) {
        this.instance = instance;
        for (const command of commands) {
            this.add(command);
        }
    }
    setInstance(instance) {
        this.instance = instance;
    }
    getInstance() {
        return this.instance;
    }
    isUnique(name) {
        return !this.commands.some((command) => command.name === name);
    }
    add(command) {
        if (!this.isUnique(command.name)) {
            throw new Error(`Command ${command.name} already exists`);
        }
        this.commands.push(command);
    }
    get(name) {
        const command = this.commands.find((command) => command.name === name);
        if (!command) {
            throw new Error(`Command ${name} not found`);
        }
        return command;
    }
    list() {
        return this.commands;
    }
}
export { Commands };
