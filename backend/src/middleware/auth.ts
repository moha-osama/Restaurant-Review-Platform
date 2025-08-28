import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import prisma from "../lib/client.js";

interface JwtPayload {
  id: string;
  role: string;
}

export async function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.auth_token;

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET environment variable is required");
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;

    const user = await prisma.user.getCurrentUser(decoded.id);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // IMPORTANT: Verify token is still active in user's tokens array
    if (!user.tokens || !user.tokens.includes(token)) {
      return res.status(401).json({ error: "Token no longer valid" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Auth error:", error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: "Invalid token" });
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(401).json({ error: "Authentication failed" });
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.auth_token;
    const decoded = jwt.decode(token) as JwtPayload;
    const userRole = decoded.role.toLowerCase();

    if (!userRole) {
      return res.status(403).json({ error: "User role not found" });
    }

    if (!userRole.includes(req.user.role.toLowerCase())) {
      return res
        .status(403)
        .json({ error: "You do not have access to this resource" });
    }
    next();
  };
}
