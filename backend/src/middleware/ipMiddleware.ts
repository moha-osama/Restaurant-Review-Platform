import requestIp  from "request-ip";
import { type Request, type Response, type NextFunction } from "express";

export async function ipMiddleware(req: Request, res: Response, next: NextFunction) {
    const ip = requestIp.getClientIp(req);
    if (!ip) {
        return res.status(400).json({ error: "IP address not found" });
    }
    req.ipAddress = ip;
    next();
}