import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
    authToken?: string;
}

const extractAuthToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.headers['authorization'];
    if (token && token.startsWith('Bearer ')) {
        req.authToken = token.slice(7); // remove 'Bearer ' prefix
    } else {
        req.authToken = ''; // default to empty string if no valid token is found
    }
    next();
};

export default extractAuthToken;
