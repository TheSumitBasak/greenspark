import { Request, Response } from "express";
import {
  uploadDocument,
  uploadMultipleDocuments,
  DOCUMENT_TYPES,
} from "../config/cloudinary";

export const uploadDocuments = async (req: Request, res: Response) => {
  try {
    const { documentType, userId } = req.body;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    if (!documentType || !DOCUMENT_TYPES[documentType as keyof typeof DOCUMENT_TYPES]) {
      return res.status(400).json({ error: "Invalid document type" });
    }

    // Upload files to Cloudinary
    const uploadPromises = files.map((file) =>
      uploadDocument(file, documentType, userId)
    );

    const urls = await Promise.all(uploadPromises);

    res.json({
      success: true,
      urls,
      count: urls.length,
      documentType,
    });
  } catch (error) {
    console.error("Upload documents error:", error);
    res.status(500).json({ error: "Failed to upload documents" });
  }
};

export const uploadSingleDocument = async (req: Request, res: Response) => {
  try {
    const { documentType, userId } = req.body;
    const file = req.file as Express.Multer.File;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (!documentType || !DOCUMENT_TYPES[documentType as keyof typeof DOCUMENT_TYPES]) {
      return res.status(400).json({ error: "Invalid document type" });
    }

    // Upload file to Cloudinary
    const url = await uploadDocument(file, documentType, userId);

    res.json({
      success: true,
      url: url,
      documentType,
    });
  } catch (error) {
    console.error("Upload single document error:", error);
    res.status(500).json({ error: "Failed to upload document" });
  }
};

export const getDocumentTypes = async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      documentTypes: DOCUMENT_TYPES,
    });
  } catch (error) {
    console.error("Get document types error:", error);
    res.status(500).json({ error: "Failed to get document types" });
  }
};
