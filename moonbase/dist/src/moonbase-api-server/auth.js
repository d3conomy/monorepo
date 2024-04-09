"use strict";
// import { } from "did-jwt";
// import { LogLevel, logger } from "d3-artifacts";
// import { NextFunction,  Request, Response } from "express";
// /**
//  * Authorize API requests
//  * @param req The request
//  * @param res The response
//  * @param next The next function
//  */
// const apiAuth = (req: Request, res: Response, next: NextFunction) => {
//     //use decentralized id-jwt to authenticate the request
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//         res.status(401).send('Unauthorized');
//         return;
//     }
//     const token = authHeader.split(' ')[1];
//     if (!token) {
//         res.status(401).send('Unauthorized');
//         return;
//     }
//     try {
//         const decoded = didJWT.decodeJWT(token);
//         logger({
//             name: 'api-auth',
//             level: LogLevel.INFO,
//             message: `API request authorized ${decoded.payload.iss}`
//         });
//     } catch (error) {
//         res.status(401).send('Unauthorized');
//         return;
//     }
//     next();
// }
// export { apiAuth }
