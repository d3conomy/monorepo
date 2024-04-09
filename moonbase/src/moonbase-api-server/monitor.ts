import { LogLevel, logger } from "d3-artifacts";
import { NextFunction,  Request, Response } from "express";


/**
 * Monitor API requests
 * @param req The request
 * @param res The response
 * @param next The next function
 */
const apiMonitor = async (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    let responseSize = 0;

    // Hook on 'data' event to calculate size of chunked response
    res.on('data', (chunk: Buffer) => {
        responseSize += chunk.length;
    });

    res.on('finish', () => {
        const duration = Date.now() - start;

        // If not chunked response, use Content-Length header
        if (res.get('Content-Length')) {
            responseSize = Number(res.get('Content-Length'));
        }

        logger({
            name: 'api-monitor',
            level: LogLevel.DEBUG,
            message: `API request ${req.method} ${req.path} ${req.hostname} ${req.ip} ${res.statusCode} ${duration}ms ${responseSize} bytes`
        });
    });
    next();
}

export { apiMonitor }