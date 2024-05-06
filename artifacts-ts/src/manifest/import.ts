import fs from 'fs/promises';
import path from 'path';
import { Manifest } from '.';

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


const parseManifest = async (filepath: string): Promise<Manifest> => {
    const json = await loadFile(filepath);

    if (!json.version) {
        throw new Error('Manifest file is missing version');
    }

    return json;
}

export {
    loadFile,
    parseManifest
}