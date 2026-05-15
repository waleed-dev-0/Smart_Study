import express from 'express';
import { generateQuestions, getQuestions } from '../controllers/questionController.js';
import { auth } from '../middlewares/authMiddleware.js';
import { validateGenerateQuestions } from '../middlewares/validateQuestionRequest.js';

const router = express.Router();

router.post('/generate', auth, validateGenerateQuestions, generateQuestions);
router.get('/:documentId', auth, getQuestions);

export default router;
