import fs from 'fs/promises';
import { ProcessType } from "./processTypes.js";
import path from 'path';
class ProcessCommands extends Map {
    constructor(...commands) {
        super(commands.map((command) => [command.name, command]));
    }
    isUnique(name) {
        return !this.has(name);
    }
}
const createProcessCommandArgs = ({ name, description, required }) => {
    return {
        name,
        description,
        required,
        toString() {
            return this.name;
        }
    };
};
const createProcessCommand = ({ name, action, args, type, description }) => {
    if (!type) {
        type = ProcessType.CUSTOM;
    }
    return {
        name,
        action,
        args,
        type,
        description
    };
};
/**
 * Make sure the action is sanitized before executing
 * @param action
 * @returns
 */
const sanitizeEval = (action) => {
    const harmfulKeywords = ['exec', 'child_process', 'spawn', 'eval', 'Function', 'constructor', 'this', 'require', 'import'];
    for (const keyword of harmfulKeywords) {
        if (action.includes(keyword)) {
            throw new Error(`Potentially harmful keyword "${keyword}" found in action.`);
        }
    }
    return eval(action);
};
const importProcessCommands = async (filepath) => {
    const commands = new ProcessCommands();
    const __dirname = path.resolve();
    const __path = path.join(__dirname, filepath);
    try {
        const file = await fs.readFile(__path, 'utf-8');
        const json = JSON.parse(file);
        for (const command of json.commands) {
            command.action = sanitizeEval(command.action);
            commands.set(command.name, command);
        }
    }
    catch (error) {
        throw new Error(`Error reading file from disk: ${error}`);
    }
    return commands;
};
export { createProcessCommandArgs, createProcessCommand, importProcessCommands, ProcessCommands };
