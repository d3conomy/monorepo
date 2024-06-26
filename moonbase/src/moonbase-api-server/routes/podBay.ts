import express, { Request, Response, NextFunction } from 'express';
import timeout from "connect-timeout"
import { PodBay } from '../../pod-bay/index.js';
import { IdReferenceTypes, LogLevel, PodId, ProcessType, isProcessType, logger } from 'd3-artifacts';
import { execute } from '../../pod-bay/command.js';


/**
 * Handles the API routes for managing pods
 * @category API
 */
const router = express.Router();


const timeoutDuration = '7s';

/**
 * @openapi
 * /api/v0/pods:
 *  get:
 *   tags:
 *    - pod bay
 *   description: Return the list of pods in the pod bay
 *   responses:
 *    200:
 *     description: A successful response
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *     example: /or
 * */
router.get('/pods', async function(req: Request, res: Response) {
    const podBay = req.podBay
    const podIds = podBay.pods.map(pod => pod.id);
    const podComponents = podBay.pods.map(pod => pod.getProcesses());

    const pods = podIds.map((id, index) => {
        return {
            pod: id,
            processTypes: podComponents[index]
        }
    });

    res.send(
        pods
    );
});


/**
 * @openapi
 * /api/v0/pods:
 *  post:
 *   tags:
 *    - pod bay
 *   requestBody:
 *    description: Pod ID and processType type
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        id:
 *         type: string
 *        processType:
 *         type: string
 *      examples:
 *       orbitdb:
 *        summary: Create a new OrbitDB pod
 *        value:
 *         id: "TestPod"
 *         processType: "orbitdb"
 *       libp2p:
 *        summary: Create a new libp2p pod
 *        value: 
 *         id: "TestPod"
 *         processType: "libp2p"
 *       ipfs:
 *        summary: Create a new IPFS pod
 *        value:
 *         id: "TestPod"
 *         processType: "ipfs"
 *   description: Creates a new pod
 *   responses:
 *    200:
 *     description: A successful response
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *     example: /or
 */
router.post('/pods', async function(req: Request, res: Response) {
    const podBay: PodBay = req.podBay;
    const id = req.body.id;
    const processType = req.body.process ? isProcessType(req.body.process) : ProcessType.ORBITDB;
    const idRef = podBay.idReferenceFactory.createIdReference({
        name: id,
        type: IdReferenceTypes.POD,
        dependsOn: podBay.id
    });
    await podBay.newPod({id: idRef, processType: processType});
    res.send({
        message: `Pod created`,
        podId: idRef,
        processType: processType
    });
});


/**
 * @openapi
 * /api/v0/pods:
 *  delete:
 *   tags:
 *    - pod bay
 *   description: Delete a pod by ID
 *   requestBody:
 *    description: Pod ID
 *    required: false
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        id:
 *         type: string
 *         example: "TestPod"
 *   responses:
 *    200:
 *     description: A successful response
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *     example: /or
 * */
router.delete('/pods', async function(req: Request, res: Response) {
    const podBay = req.podBay;
    const podId = req.body.id;
    await podBay.removePod(podId);
    res.send({
        message: `Node deleted`,
        podId: podId,
        podBay: podBay.id.name
    });
});

/**
 * @openapi
 * /api/v0/pod/{id}:
 *  get:
 *   tags:
 *    - pod
 *   description: Get a node by ID
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *       type: string
 *      example: "TestPod"
 *      description: Node ID
 *    - in: query
 *      name: info
 *      required: false
 *      schema:
 *       type: string
 *      description: Requested Pod information
 *      examples: 
 *       peerid:
 *        summary: Get the peer ID
 *        value: "peerid"
 *       multiaddrs:
 *        summary: Get the multiaddresses
 *        value: "multiaddrs"
 *       connections:
 *        summary: Get the connections
 *        value: "connections"
 *       peers:
 *        summary: Get the peers
 *        value: "peers"
 *       protocols:
 *        summary: Get the protocols
 *        value: "protocols"
 *   responses:
 *    200:
 *     description: A successful response
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *     example: /or
 * */
router.get('/pod/:id', timeout(timeoutDuration), async function(req: Request, res: Response, next: NextFunction) {
    const podBay = req.podBay;
    const podId = req.params.id;
    const command = req.query.info;

    const podIdRef = podBay.idReferenceFactory.getIdReference(podId) as PodId;
    const pod = podBay.getPod(podIdRef);

    if (!pod) {
        res.status(404).send({
            message: `Pod not found`,
            podId: podId
        });
        return;
    }

    let result: any;
    try {
        if (command) {
            result = await execute({pod, command: command as string})
        }
        else {
            result = pod.getProcesses()
        }
    }
    catch (e: any) {
        result = {
            message: `Command failed`,
            podId: podId,
            command: command,
            error: e.message
        }
        next(result);
        return
    }
    
    res.send(result);
});


/**
 * @openapi
 * /api/v0/pod/{id}:
 *  post:
 *   tags:
 *    - pod
 *   description: Run a command on a pod
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *       type: string
 *      example: "TestPod"
 *      description: Pod ID
 *   requestBody:
 *    description: Command and arguments
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        command:
 *         type: string
 *      examples: 
 *       dial:
 *        summary: Dial a peer
 *        value:
 *         command: "dial"
 *         args:
 *          address: "/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ"
 *       dialprotocol:
 *        summary: Dial a peer with a protocol
 *        value:
 *         command: "dialprotocol"
 *         args:
 *          address: "/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ"
 *          protocol: "/libp2p/circuit/relay/0.2.0/hop"
 *       addjson:
 *        summary: Add a JSON object to IPFS
 *        value:
 *         command: "addjson"
 *         args:
 *          data: {"name": "Test"}
 *       getjson:
 *        summary: Get a JSON object from IPFS
 *        value:
 *         command: "getjson"
 *         args:
 *          cid: "baguqeera7q5beo5vjjs6xapkezg6hai3v2fin4es34xr7gor7unfqf6dswzq"
 *   responses:
 *    200:
 *     description: A successful response
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *     example: /or
 * */
router.post('/pod/:id', timeout(timeoutDuration), async function(req: Request, res: Response, next: NextFunction) {
    const podBay = req.podBay;
    const podId = req.params.id;
    const command = req.body.command;
    const args = req.body.args;

    const podIdRef = podBay.idReferenceFactory.getIdReference(podId) as PodId;
    const pod = podBay.getPod(podIdRef);

    if (!pod) {
        res.status(404).send({
            message: `Pod not found`,
            podId: podId
        });
        return;
    }
    let result;
    try {
        result = await execute({pod, command, args});
        logger({
            level: LogLevel.INFO,
            message: `Command [${command}] succeeded: ${JSON.stringify(result)}`,
            podId: pod.id
        })
    }
    catch (e: any) {
        result = {
            message: `Command failed`,
            podId: podId,
            command: command,
            error: e.message
        }
        next(result);
        return
    }
    res.send(result);
});


/**
 * @openapi
 * /api/v0/pod/{id}:
 *  put:
 *   tags:
 *    - pod
 *   description: Start, stop, or restart a pod
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *       type: string
 *      example: "TestPod"
 *      description: Pod ID
 *   requestBody:
 *    description: Command and arguments
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        state:
 *         type: string
 *        args:
 *         type: object
 *      examples: 
 *       start:
 *        summary: Start a pod
 *        value:
 *         state: "start"
 *         args:
 *          processType: "orbitdb"
 *       stop:
 *        summary: Stop a pod
 *        value:
 *         state: "stop"
 *         args:
 *          processType: "orbitdb"
 *       restart:
 *        summary: Restart a pod
 *        value:
 *         state: "restart"
 *         args:
 *          processType: "orbitdb"
 *   responses:
 *    200:
 *     description: A successful response
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *     example: /or
 * */
router.put('/pod/:id', async function(req: Request, res: Response) {
    const podBay = req.podBay;
    const podId = req.params.id;
    const state = req.body.state;
    const args = req.body.args;
    
    const podIdRef = podBay.idReferenceFactory.getIdReference(podId) as PodId;
    const pod = podBay.getPod(podIdRef);

    if (!pod) {
        res.status(404).send({
            message: `Pod not found`,
            podId: podId
        });
        return;
    }
    let result;
    try {
        switch (state) {
            case "start":
                await pod.start(args?.processType);
                break;
            case "stop":
                await pod.stop(args?.processType);
                break;
            case "restart":
                await pod.restart(args?.processType);
                break;
        }
        result = {
            message: `Command succeeded`,
            podId: podId,
            command: state
        }

    }
    catch (e: any) {
        result = {
            message: `Command failed`,
            podId: podId,
            command: state,
            error: e.message
        }
    }
    res.send(result);
})


export {
    router as podBayRouter
};