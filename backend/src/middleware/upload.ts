import multer from "multer";
import path from "path";
import fs from "fs";
import { validateDocument } from "../config/cloudinary";
import { NextFunction, Request, Response } from "express";

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// File filter function
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const validation = validateDocument(file);

  if (!validation.isValid) {
    cb(new Error(validation.error));
    return;
  }

  cb(null, true);
};

// Create multer instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 10, // Maximum 10 files
  },
});

// Single file upload middleware
export const uploadSingle = upload.single("document");

// Multiple files upload middleware
export const uploadMultiple = upload.array("documents", 10);

// Specific field upload middleware
export const uploadField = (fieldName: string) => upload.single(fieldName);

// Multiple fields upload middleware
export const uploadFields = (fields: multer.Field[]) => upload.fields(fields);

// Error handling middleware
export const handleUploadError = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ error: "File too large. Maximum size is 10MB." });
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return res
        .status(400)
        .json({ error: "Too many files. Maximum is 10 files." });
    }
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({ error: "Unexpected file field." });
    }
  }

  if (error.message) {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};

// Cleanup uploaded files
export const cleanupUploads = (filePaths: string[]) => {
  filePaths.forEach((filePath) => {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  });
};

// Get file info
export const getFileInfo = (file: Express.Multer.File) => {
  return {
    originalname: file.originalname,
    filename: file.filename,
    path: file.path,
    size: file.size,
    mimetype: file.mimetype,
  };
};

// Validate uploaded files
export const validateUploadedFiles = (files: Express.Multer.File[]) => {
  const errors: string[] = [];

  files.forEach((file, index) => {
    const validation = validateDocument(file);
    if (!validation.isValid) {
      errors.push(`File ${index + 1}: ${validation.error}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};
