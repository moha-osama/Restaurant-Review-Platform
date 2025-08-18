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

    // Fetch actual user data from database
    const user = await prisma.user.getCurrentUser(decoded.id);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ error: "User role not found" });
    }

    if (!roles.includes(req.user.role.toLowerCase())) {
      return res
        .status(403)
        .json({ error: "You do not have access to this resource" });
    }
    next();
  };
}
