import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import connectDB from './config/db.js';
import routes from './routes/index.js';
import reportRoutes from './routes/reportRoutes.js';
import errorHandler from './middlewares/errorHandler.js';

dotenv.config();

['uploads', 'uploads/avatars'].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));

app.use('/api', routes);
app.use('/api/reports', reportRoutes);

app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`);
  });
}

export default app;
