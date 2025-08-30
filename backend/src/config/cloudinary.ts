import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

export default cloudinary;

// Upload options
export const UPLOAD_OPTIONS = {
  folder: "green-hydrogen-credits",
  allowed_formats: ["jpg", "jpeg", "png", "pdf", "doc", "docx"],
  max_file_size: 10 * 1024 * 1024, // 10MB
  resource_type: "auto",
  transformation: {
    quality: "auto",
    fetch_format: "auto",
  },
};

// Document types
export const DOCUMENT_TYPES = {
  USER_VERIFICATION: "user-verification",
  VERIFIER_ORGANIZATION: "verifier-organization",
  PRODUCTION_PROOF: "production-proof",
  VERIFICATION_SUBMISSION: "verification-submission",
};

// Upload helper functions
export const uploadDocument = async (
  file: Express.Multer.File,
  documentType: string,
  userId?: string
): Promise<string> => {
  try {
    const folderPath = `${UPLOAD_OPTIONS.folder}/${documentType}`;
    const publicId = userId
      ? `${folderPath}/${userId}_${Date.now()}`
      : `${folderPath}/${Date.now()}`;

    const result = await cloudinary.uploader.upload(file.path, {
      ...UPLOAD_OPTIONS,
      public_id: publicId,
      folder: folderPath,
      resource_type: "auto",
    } as any);

    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload document");
  }
};

export const uploadMultipleDocuments = async (
  files: Express.Multer.File[],
  documentType: string,
  userId?: string
): Promise<string[]> => {
  try {
    const uploadPromises = files.map((file) =>
      uploadDocument(file, documentType, userId)
    );
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error("Multiple document upload error:", error);
    throw new Error("Failed to upload documents");
  }
};

export const deleteDocument = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw new Error("Failed to delete document");
  }
};

export const getDocumentUrl = (publicId: string): string => {
  return cloudinary.url(publicId, {
    secure: true,
    transformation: UPLOAD_OPTIONS.transformation,
  });
};

// Validation helpers
export const validateFileType = (file: Express.Multer.File): boolean => {
  const allowedTypes = UPLOAD_OPTIONS.allowed_formats;
  const fileExtension = file.originalname.split(".").pop()?.toLowerCase();
  return allowedTypes.includes(fileExtension || "");
};

export const validateFileSize = (file: Express.Multer.File): boolean => {
  return file.size <= UPLOAD_OPTIONS.max_file_size;
};

export const validateDocument = (
  file: Express.Multer.File
): { isValid: boolean; error?: string } => {
  if (!validateFileType(file)) {
    return {
      isValid: false,
      error: `Invalid file type. Allowed types: ${UPLOAD_OPTIONS.allowed_formats.join(", ")}`,
    };
  }

  if (!validateFileSize(file)) {
    return {
      isValid: false,
      error: `File too large. Maximum size: ${UPLOAD_OPTIONS.max_file_size / (1024 * 1024)}MB`,
    };
  }

  return { isValid: true };
};
