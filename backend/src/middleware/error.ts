import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { ZodError } from "zod";
import { UploadValidationError } from "../utils/uploads";

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: "Validation error",
      details: error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message
      }))
    });
  }

  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({ error: "Image file is too large (max 5 MB)" });
    }

    return res.status(400).json({ error: error.message });
  }

  if (error instanceof UploadValidationError) {
    return res.status(400).json({ error: error.message });
  }

  if (error instanceof Error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(500).json({ error: "Unknown server error" });
}
