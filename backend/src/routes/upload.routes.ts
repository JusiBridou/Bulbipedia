import { Router } from "express";
import { asyncHandler } from "../middleware/async-handler";
import { requireAuth } from "../middleware/auth";
import { sendError } from "../utils/http";
import { imageUpload, saveUploadedImage } from "../utils/uploads";

const uploadRouter = Router();

uploadRouter.post(
  "/image",
  requireAuth,
  imageUpload.single("image"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return sendError(res, 400, "Image file is required");
    }

    const url = await saveUploadedImage(req.file, "inline");

    return res.status(201).json({ url });
  })
);

export default uploadRouter;