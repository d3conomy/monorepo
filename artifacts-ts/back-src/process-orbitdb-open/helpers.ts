import fs from 'fs/promises';
import path from 'path';

const removeLock = async (address: string, podId: string): Promise<void> => {

    const __dirname = path.resolve();
    const orbitDbDataPath = path.join(__dirname, `./data/pods/${podId}/orbitdb/orbitdb/${address}}`);
    const headLockFile = path.join(orbitDbDataPath, '/log/_heads/LOCK');
    const indexLockFile = path.join(orbitDbDataPath, '/log/_index/LOCK');
    try {
        //check if the files exist
        if (await fs.stat(headLockFile)) {
            await fs.unlink(headLockFile);
        }
        if (await fs.stat(indexLockFile)) {
            await fs.unlink(indexLockFile);
        }
    }
    catch (error) {
        // logger({
        //     level: LogLevel.ERROR,
        //     processId: this.id,
        //     message: `Error removing lock files: ${error}`
        // });
    }
}

export {
    removeLock
}