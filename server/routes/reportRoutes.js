import express from 'express';
import { getReportsData } from '../controllers/reportController.js';
import { auth } from '../middlewares/authMiddleware.js';
import { admin } from '../middlewares/adminMiddleware.js';

const router = express.Router();

router.get('/', auth, admin, getReportsData);

export default router;
