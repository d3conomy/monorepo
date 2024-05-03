import fs from 'fs/promises';
import path from 'path';

const removeLock = async ({
    address,
    podId,
    directory
}: {
    address: string,
    podId?: string,
    directory?: string
}): Promise<void> => {
    let headLockFile: string
    let indexLockFile: string

    if (directory) {
        headLockFile = path.join(directory, '/orbitdb/', address, '/log/_heads/LOCK');
        indexLockFile = path.join(directory, '/orbitdb/', address, '/log/_index/LOCK');
    }
    else {
        const __dirname = path.resolve();
        const orbitDbDataPath = path.join(__dirname, `./data/pods/${podId}/orbitdb/orbitdb/${address}}`);
        headLockFile = path.join(orbitDbDataPath, '/log/_heads/LOCK');
        indexLockFile = path.join(orbitDbDataPath, '/log/_index/LOCK');
    }
    
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