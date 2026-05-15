import express from 'express';
import { saveAttempt, getAttempts, getAttemptById } from '../controllers/quizAttemptController.js';
import { auth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', auth, saveAttempt);
router.get('/', auth, getAttempts);
router.get('/:id', auth, getAttemptById);

export default router;
