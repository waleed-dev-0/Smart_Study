import * as summaryController from "../controllers/summaryController.js";
import { auth } from '../middlewares/authMiddleware.js';
import express from "express";

const router = express.Router();

router.get("/:documentId",auth,summaryController.getSummary);
router.post("/:documentId",auth,summaryController.generateSummary);

export default router;