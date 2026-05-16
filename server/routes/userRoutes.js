import express from 'express';
import multer from 'multer';
import path from 'path';
import { updateProfile, getProfile, changePassword, uploadAvatar } from '../controllers/userController.js';
import { auth } from '../middlewares/authMiddleware.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/avatars');
  },
  filename: (req, file, cb) => {
    cb(null, `avatar-${req.user._id}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|gif|webp)$/i;
    if (!allowed.test(path.extname(file.originalname))) {
      return cb(new Error('Only image files (jpg, jpeg, png, gif, webp) are allowed'));
    }
    cb(null, true);
  },
});

const router = express.Router();
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.put('/password', auth, changePassword);
router.post('/avatar', auth, upload.single('avatar'), uploadAvatar);

export default router;
