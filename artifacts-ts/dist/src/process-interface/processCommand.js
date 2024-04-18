import { ProcessType } from "./processTypes.js";
class ProcessCommands extends Map {
    type = ProcessType.CUSTOM;
    process;
    constructor({ commands, proc } = {}) {
        super();
        this.process = {
            type: this.type,
            process: proc
        };
        if (commands) {
            for (const command of commands) {
                this.set(command.name, command);
            }
        }
    }
    isUnique(name) {
        return !this.has(name);
    }
}
const createProcessCommandArgs = ({ name, description, required, defaultValue }) => {
    return {
        name,
        description,
        required,
        default: defaultValue,
        toString() {
            return this.name;
        }
    };
};
const createProcessCommand = ({ name, action, args, type, description }) => {
    if (!type) {
        type = ProcessType.CUSTOM;
    }
    if (!args) {
        args = [];
    }
    return {
        name,
        action,
        args,
        type,
        description
    };
};
export { createProcessCommandArgs, createProcessCommand, ProcessCommands };
