import fs from 'fs/promises';
import path from 'path';
import { InstanceOptionsList } from './options';
import { CommandArg, Commands } from './commands';





interface CommandsTemplate {
    name: string;
    description: string;
    args: CommandArg[];

    run: (args?: CommandArg[], instance?: any ) => Promise<any>;

}

interface ContainerTemplate {
    name: string;
    type: string;
    description?: string;
    options?: InstanceOptionsList;
    commands?: CommandsTemplate[]
    initializer?: () => Promise<any>;
    instance?: () => Promise<any>;
}

const loadFile = async (filepath: string): Promise<any> => {
    const __dirname = path.resolve();
    const __path = path.join(__dirname, filepath);

    try {
        const file = await fs.readFile(__path, 'utf-8');
        return JSON.parse(file);
    }
    catch (error: any) {
        throw new Error(`Error reading file from disk: ${error}`);
    }
}