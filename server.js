import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { sequelize } from './config/database.js';

import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// app.use(cors({ // For production
//   origin: 'live.com',
//   credentials: true
// }));

// 🛣️ Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);

// 🚀 Sync and start server
try {
  await sequelize.sync();
  // await sequelize.sync({ alter: true }); // Alters existing tables to match models
  // await sequelize.sync({ force: true }); // use { force: true } 	Drops and recreates all tables
  console.log('✅ DB synced');

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
} catch (err) {
  console.error('❌ Error connecting to DB:', err);
}