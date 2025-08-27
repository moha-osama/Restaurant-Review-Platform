import { type Request, type Response, type NextFunction } from "express";
import crypto from "crypto";

const cookieOptions = {  
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 24 * 60 * 60 * 1000, 
}

export async function sessionMiddleware(req: Request, res: Response, next: NextFunction) {
    const sessionId = req.cookies.session_id;
    if (!sessionId) {
        const newSessionId = crypto.randomUUID();
        res.cookie("session_id", newSessionId, cookieOptions);
        req.session_id = newSessionId;
    }
    next();
}