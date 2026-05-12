import express from "express";
import authRoutes from "./authRoutes.js";
import * as uploadController from "../controllers/uploadController.js";
import * as chatController from "../controllers/chatController.js";
import * as documentController from "../controllers/documentController.js";
import { auth } from "../middlewares/authMiddleware.js";
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

router.use("/auth", authRoutes);

router.get("/documents", auth, documentController.getDocuments);
router.post(
  "/upload",
  auth,
  upload.single("file"),
  uploadController.uploadDocument,
);
router.post("/chat", auth, chatController.askAI);
router.get("/chat/:documentId", auth, chatController.getChatHistory);

export default router;
