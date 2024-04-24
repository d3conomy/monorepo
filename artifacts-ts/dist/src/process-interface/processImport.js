import fs from 'fs/promises';
import { isProcessType } from "./processTypes.js";
import path from 'path';
import { createProcessContainer } from './processContainer.js';
import { ProcessCommands } from './processCommand.js';
/**
 * Make sure the action is sanitized before executing
 * @param action
 * @returns
 */
const sanitizeEval = (action) => {
    const harmfulKeywords = ['exec', 'child_process', 'spawn', 'eval', 'Function', 'constructor', 'require', 'import'];
    for (const keyword of harmfulKeywords) {
        if (typeof action !== 'string') {
            throw new Error(`Action is not a string`);
        }
        if (action.includes(keyword)) {
            throw new Error(`Action contains harmful keyword: ${keyword}`);
        }
    }
    return eval(action);
};
const importFromFile = async (filepath) => {
    const __dirname = path.resolve();
    const __path = path.join(__dirname, filepath);
    try {
        const file = await fs.readFile(__path, 'utf-8');
        return JSON.parse(file);
    }
    catch (error) {
        throw new Error(`Error reading file from disk: ${error}`);
    }
};
const importProcessContainerFromJSON = (json) => {
    const processContainer = createProcessContainer({
        type: isProcessType(json.type),
        process: sanitizeEval(json.process),
        options: json.options
    });
    return processContainer;
};
const importProcessCommandsFromJSON = (process, json) => {
    let commands;
    commands = new ProcessCommands({
        proc: process.process
    });
    for (const command of json.commands) {
        command.action = sanitizeEval(command.action);
        commands.set(command.name, command);
    }
    return commands;
};
export { importFromFile, importProcessContainerFromJSON, importProcessCommandsFromJSON };
