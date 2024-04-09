import { NextFunction, Request, Response } from "express";
/**
 * Monitor API requests
 * @param req The request
 * @param res The response
 * @param next The next function
 */
declare const apiMonitor: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export { apiMonitor };
//# sourceMappingURL=monitor.d.ts.map