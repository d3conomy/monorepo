import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { apiMonitor } from './monitor.js';
import { podBayRouter, metricsRouter, dbRouter, pubSubRouter, fileSystemRouter } from './routes/index.js';
import { LogLevel, logger } from 'd3-artifacts';
/**
 * The options for the API server
 * @category API
 */
class ApiServerOptions {
    podBay;
    port;
    corsOrigin;
    constructor({ podBay, port, corsOrigin }) {
        if (!podBay) {
            throw new Error('ApiServerOptions requires a PodBay');
        }
        this.podBay = podBay;
        this.port = port ? port : 4343;
        this.corsOrigin = corsOrigin ? corsOrigin : '*';
    }
}
/**
 * The API server
 * @category API
 */
class ApiServer {
    app;
    options;
    constructor(options) {
        this.app = express();
        this.options = {
            port: options.port,
            corsOrigin: options.corsOrigin,
            podBay: options.podBay
        };
    }
    /**
     * Initializes the API server
     */
    init() {
        const options = {
            definition: {
                openapi: '3.0.0',
                info: {
                    title: 'Moonbase API',
                    version: '0.0.1',
                },
                servers: [
                    {
                        url: `http://0.0.0.0:${this.options.port}`,
                        description: 'Development server',
                    },
                ],
                consumes: ['application/json'],
                produces: ['application/json']
                // host: url, // Host (optional)
            },
            // Path to the API docs
            apis: [
                './src/moonbase-api-server/routes/*.ts',
                // './src/moonbase-api-server/models/*.ts',
                './dist/src/moonbase-api-src/routes/*.js',
                // './dist/api/models/*.js'
            ]
        };
        const corsOptions = {
            origin: this.options.corsOrigin,
            optionsSuccessStatus: 200
        };
        this.app.use(cors(corsOptions));
        const podBayMiddleware = (req, _res, next) => {
            req.podBay = this.options.podBay;
            next();
        };
        this.app.use(express.json());
        this.app.use('/api/v0', 
        // apiAuth,
        apiMonitor, podBayMiddleware, metricsRouter, podBayRouter, dbRouter, pubSubRouter, fileSystemRouter);
        const specs = swaggerJsdoc(options);
        this.app.use('/api/v0/docs', swaggerUi.serve);
        this.app.get('/api/v0/docs', swaggerUi.setup(specs, { explorer: true }));
        this.app.use(function (err, req, res, next) {
            res.status(500).send(res);
        });
    }
    /**
     * Starts the API server
     */
    start() {
        this.init();
        this.app.listen(this.options.port, () => {
            logger({
                level: LogLevel.INFO,
                message: `Moonbase🌙⛺️ API Server listening on port ${this.options.port} `
            });
        });
    }
}
export { ApiServer, ApiServerOptions };
