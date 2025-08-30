import { Router } from "express";
import {
  uploadMultiple,
  handleUploadError,
  cleanupUploads,
} from "../middleware/upload";
import { authenticateToken } from "../middleware/auth";
import {
  uploadDocuments,
  uploadSingleDocument,
  getDocumentTypes,
} from "../controllers/uploadController";

const router = Router();

// Upload multiple documents
router.post(
  "/documents",
  authenticateToken,
  uploadMultiple,
  handleUploadError,
  uploadDocuments
);

// Upload single document
router.post("/document", authenticateToken, uploadSingleDocument);

// Get document types
router.get("/document-types", getDocumentTypes);

export default router;
