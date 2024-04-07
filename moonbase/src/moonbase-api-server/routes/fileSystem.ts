import express, { Request, Response } from 'express';
import fs from 'fs/promises';

const router = express.Router();

/**
 * @openapi
 * /api/v0/fs:
 *  get:
 *   tags:
 *    - filesystem
 *   description: Return the list of files in a directory
 *   responses:
 *    200:
 *     description: A successful response
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         files:
 *          type: array
 *          items: 
 *           type: string
 *       examples:
 *        test:
 *         value: {filesystems: ["test"]}
 * */
router.get('/fs', async function(req: Request, res: Response) {
    const podBay = req.podBay;
    const openFileSystems: Array<string> = podBay.getOpenFs();
    res.send({
        filesystems: openFileSystems
    });
});

/**
 * @openapi
 * /api/v0/fs:
 *  post:
 *   tags:
 *    - filesystem
 *   description: Create a new filesystem
 *   requestBody:
 *    description: The IPFS FS name and type
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        podId:
 *         type: string
 *         description: The pod name to create the fs on
 *         example: "TestPod"
 *        filesystemName:
 *         type: string
 *         description: The filesystem name
 *         example: "TestFS"
 *        filesystemType:
 *         type: string
 *         description: The filesystem type
 *         example: "unixfs"
 *   responses:
 *    200:
 *     description: A successful response
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         ipfsProcessId:
 *          type: string
 *         filesystemType:
 *          type: string
 *       examples:
 *        test:
 *         value: {ipfsFilesystemName: "TestFS"}
 * */
router.post('/fs', async function(req: Request, res: Response) {
    const podBay = req.podBay;
    const podId = req.body.podId;
    const filesystemName = req.body.filesystemName;
    const filesystemType = req.body.filesystemType;
    const ipfsFS = await podBay.createFs({
        podId,
        filesystemName,
        filesystemType
    });
    const ipfsFSProcess = podBay.getFs(ipfsFS);
    const dirCid = await ipfsFSProcess.addDirectory({ path: 'test' });
    ipfsFSProcess.activeCid = dirCid;
    res.send({
        ipfsFilesystemName: ipfsFS,
        dirCid: dirCid.toString()
    });
});

/**
 * @openapi
 * /api/v0/fs/{ipfsProcessId}:
 *  get:
 *   tags:
 *    - filesystem
 *   description: Return the list of files in a directory
 *   parameters:
 *    - name: ipfsProcessId
 *      in: path
 *      required: true
 *      description: The IPFS process id
 *      schema:
 *       type: string
 *   responses:
 *    200:
 *     description: A successful response
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         files:
 *          type: array
 *          items: 
 *           type: string
 *       examples:
 *        test:
 *         value: {files: ["test"]}
 * */
router.get('/fs/:ipfsProcessId', async function(req: Request, res: Response) {
    const podBay = req.podBay;
    const ipfsProcessId = req.params.ipfsProcessId;
    const ipfsFS = podBay.getFs(ipfsProcessId);
    const files = ipfsFS.ls();
    const filesArray = [];
    for await (const file of files) {
        console.log(file)
        filesArray.push(file);
    }
    res.send({
        files: filesArray
    });
});


/**
 * @openapi
 * /api/v0/fs/{ipfsProcessId}:
 *  post:
 *   tags:
 *    - filesystem
 *   parameters:
 *    - name: ipfsFSProcessId
 *      in: path
 *      required: true
 *      description: The IPFS process id
 *      schema:
 *       type: string
 *       example: "TestFS"
 *   requestBody:
 *    description: Add a file to the filesystem
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        path:
 *         type: string
 *         description: The path to add the file
 *         example: "/test.txt"
 *        data:
 *         type: string
 *         description: The data to add
 *         example: "Hello, World!"
 *     multipart/form-data:
 *      schema:
 *       type: object
 *       properties:
 *        file:
 *         type: string
 *         format: binary
 *         description: The file to add
 *   responses:
 *    200:
 *     description: A successful response
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         cid:
 *          type: string
 *       examples:
 *        test:
 *         value: {cid: "QmZKJ5KQ1wZ8Jw8jz2t8Q2b7Zb2j8"}
 * */
router.post('/fs/:ipfsFSProcessId', async function(req: Request, res: Response) {
    const podBay = req.podBay;
    const ipfsFSProcessId = req.params.ipfsFSProcessId;
    const ipfsFS = podBay.getFs(ipfsFSProcessId);
    let data: string | Uint8Array = new TextEncoder().encode(req.body.data)
    let path = req.body.path;

    const chunks = [];
    for await (const chunk of req) {
        chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    const boundary = `--${req.headers['content-type']?.split('; ')[1].split('=')[1]}`;
    const parts = buffer.toString().split(boundary).slice(1, -1);

    for (const part of parts) {
        const [header, body] = part.split('\r\n\r\n');
        const nameMatch = header.match(/name="([^"]+)"/);
        const filenameMatch = header.match(/filename="([^"]+)"/);

        if (nameMatch && filenameMatch) {
            const name = nameMatch[1];
            path = filenameMatch[1];
            const bodydata = body.slice(0, -2);

            if (name === 'file') {
                data = new TextEncoder().encode(bodydata);
                break;
            }
        }
    }
    
    console.log(ipfsFS)
    const cid = await ipfsFS.addFile({ data, path });
    ipfsFS.activeCid = cid;
    console.log(cid)
    res.send({
        cid: cid.toString()
    });
});

export {
    router as fileSystemRouter
}