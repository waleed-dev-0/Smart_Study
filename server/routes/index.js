import express from "express";
import authRoutes from "./authRoutes.js";
import summaryRoutes from "./summaryRoutes.js";
import * as uploadController from "../controllers/uploadController.js";
import * as chatController from "../controllers/chatController.js";
import * as documentController from "../controllers/documentController.js";
import * as profileController from "../controllers/profileController.js";
import { auth } from "../middlewares/authMiddleware.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import questionRoutes from "./questionRoutes.js";
import quizAttemptRoutes from "./quizAttemptRoutes.js";

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
<<<<<<< HEAD
router.use("/summary",auth,summaryRoutes);
=======
import userRoutes from "./userRoutes.js";
router.use("/user", userRoutes);
>>>>>>> dab8ccbf1e9308b705706a8dfce33177cbb807ad

router.get("/documents", auth, documentController.getDocuments);
router.get("/userProfile",auth,profileController.getProfile);
router.post(
  "/upload",
  auth,
  upload.single("file"),
  uploadController.uploadDocument,
);


router.post("/chat", auth, chatController.askAI);
router.post("/chat/stream", auth, chatController.askAIStream);
router.post("/chat/free", auth, chatController.freeChat);
router.post("/chat/free/stream", auth, chatController.freeChatStream);
router.get("/chat/:documentId", auth, chatController.getChatHistory);
router.put("/chat/session/:documentId", auth, chatController.renameSession);
router.delete("/documents/:id", auth, documentController.deleteDocument);
router.use("/questions", questionRoutes);
router.use("/attempts", quizAttemptRoutes);
export default router;
