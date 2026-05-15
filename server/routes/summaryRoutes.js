import * as summaryController from "../controllers/summaryController.js";
import express from "express";

const router = express.Router();

router.get("/:documentId",summaryController.getSummary);
router.post("/:documentId",summaryController.generateSummary);

export default router;