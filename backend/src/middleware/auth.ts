import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { sendError } from "../utils/http";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.header("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendError(res, 401, "Unauthorized");
  }

  const token = authHeader.replace("Bearer ", "").trim();

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.sub,
      role: payload.role,
      email: payload.email,
      username: payload.username
    };
    return next();
  } catch {
    return sendError(res, 401, "Invalid or expired token");
  }
}

export function requireRole(role: "USER" | "ADMIN") {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 401, "Unauthorized");
    }

    if (req.user.role !== role && req.user.role !== "ADMIN") {
      return sendError(res, 403, "Forbidden");
    }

    return next();
  };
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return sendError(res, 401, "Unauthorized");
  }

  if (req.user.role !== "ADMIN") {
    return sendError(res, 403, "Forbidden");
  }

  return next();
}
