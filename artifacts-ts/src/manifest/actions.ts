import fs from 'fs/promises';
import path from 'path';

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

export {
    loadFile
}