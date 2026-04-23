import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import multer from "multer";

const uploadRoot = path.resolve(process.cwd(), "uploads");

const allowedImageMimes = new Map<string, string>([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
  ["image/avif", ".avif"]
]);

export class UploadValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UploadValidationError";
  }
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (_req, file, callback) => {
    if (!allowedImageMimes.has(file.mimetype)) {
      callback(new UploadValidationError("Only JPEG, PNG, WEBP, GIF or AVIF images are allowed"));
      return;
    }

    callback(null, true);
  }
});

export const imageUpload = upload;

function getExtension(file: Express.Multer.File) {
  return allowedImageMimes.get(file.mimetype) ?? path.extname(file.originalname).toLowerCase() ?? ".img";
}

export function isStoredUploadPath(value: string | null | undefined) {
  return Boolean(value && value.startsWith("/uploads/"));
}

export async function ensureUploadRoot() {
  await fs.mkdir(uploadRoot, { recursive: true });
}

export async function saveUploadedImage(file: Express.Multer.File, prefix: string) {
  await ensureUploadRoot();

  const fileName = `${prefix}-${Date.now()}-${crypto.randomUUID()}${getExtension(file)}`;
  const filePath = path.join(uploadRoot, fileName);

  await fs.writeFile(filePath, file.buffer);

  return `/uploads/${fileName}`;
}

export async function deleteStoredImage(imagePath: string | null | undefined) {
  if (!isStoredUploadPath(imagePath)) {
    return;
  }

  const fileName = path.basename(imagePath as string);

  try {
    await fs.unlink(path.join(uploadRoot, fileName));
  } catch {
    // Best effort cleanup. Missing files are fine.
  }
}