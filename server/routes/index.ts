import express, { Router, Request, Response } from 'express';
import * as testController from '../controllers/testController';

const router: Router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.json({ success: true, message: 'Server is running! API v1' });
});

router.get('/test-db', testController.testDb);
router.get('/test-relations', testController.testRelations);

export default router;
