import express from "express";
import * as uploadController from "../controllers/uploadController.js";
import * as chatController from "../controllers/chatController.js";
import * as documentController from "../controllers/documentController.js";
import * as questionController from "../controllers/questionController.js";
import { mockAuth } from "../middlewares/authMiddleware.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname) !== ".pdf") {
      return cb(new Error("Only PDFs are allowed"));
    }
    cb(null, true);
  },
});

router.get("/", (req, res) => {
  res.json({ success: true, message: "Server is running👌." });
});

router.get("/documents", mockAuth, documentController.getDocuments);
router.post(
  "/upload",
  mockAuth,
  upload.single("file"),
  uploadController.uploadDocument,
);
router.post("/chat", mockAuth, chatController.askAI);
router.get("/chat/:documentId", mockAuth, chatController.getChatHistory);
router.post("/questions/generate", mockAuth, questionController.generateQuestions);
router.get("/questions/:documentId", mockAuth, questionController.getQuestions);
export default router;
