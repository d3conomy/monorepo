import express from 'express';
/**
 * Handles the API routes for pubsub operations
 * @category API
 */
const router = express.Router();
/**
 * @openapi
 * /api/v0/pubsub/topics:
 *  get:
 *   tags:
 *    - pubsub
 *   description: Return the list of pubsub topics
 *   responses:
 *    200:
 *     description: A successful response
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         topics:
 *          type: array
 *          items:
 *           type: string
 *       examples:
 *        test:
 *         value: {topics: ["test"]}
 * */
router.get('/pubsub/topics', async function (req, res) {
    const podBay = req.podBay;
    const topics = podBay.getOpenTopics();
    res.send({
        topics: topics
    });
});
/**
 * @openapi
 * /api/v0/pubsub/subscribe:
 *  post:
 *   tags:
 *    - pubsub
 *   requestBody:
 *    description: Topic to subscribe to
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        topic:
 *         type: string
 *         description: The topic to subscribe to
 *         example: "moonbase-pubsub"
 *        podId:
 *         type: string
 *         description: The podId to subscribe
 *         example: "TestPod"
 *   responses:
 *    200:
 *     description: A successful response
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *       examples:
 *        test:
 *         value: {message: "Subscribed to topic"}
 * */
router.post('/pubsub/subscribe', async function (req, res) {
    const podBay = req.podBay;
    const topic = req.body.topic;
    const podId = req.body.podId;
    await podBay.subscribe({ topic, podId });
    res.send({
        message: `Subscribed to topic ${topic}`
    });
});
/**
 * @openapi
 * /api/v0/pubsub/publish:
 *  post:
 *   tags:
 *    - pubsub
 *   requestBody:
 *    description: Topic to publish to
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        topic:
 *         type: string
 *         description: The topic to publish to
 *         example: "moonbase-pubsub"
 *        message:
 *         type: string
 *         description: The message to publish
 *         example: "Hello Moonbase"
 *        podId:
 *         type: string
 *         description: The podId to publish
 *         example: "TestPod"
 *   responses:
 *    200:
 *     description: A successful response
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *       examples:
 *        test:
 *         value: {message: "Published to topic"}
 * */
router.post('/pubsub/publish', async function (req, res) {
    const podBay = req.podBay;
    const topic = req.body.topic;
    const message = req.body.message;
    const podId = req.body.podId;
    const publishResponse = await podBay.publish({ topic, message, podId });
    res.send({
        message: `Published to topic ${topic}: ${publishResponse.message}`
    });
});
export { router as pubSubRouter };
