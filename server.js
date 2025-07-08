import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { sequelize } from './config/database.js';
import { UserSW , Post } from './models/model.js';

import userSWRoutes from './routes/userSWRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// app.use(cors({ // For production
//   origin: 'live.com',
//   credentials: true
// }));


// 🧩 Setup relationships
UserSW.hasMany(Post, { foreignKey: 'userId' });
Post.belongsTo(UserSW, { foreignKey: 'userId' });

// 🛣️ Routes
app.use('/api/sw', userSWRoutes);
app.use('/api/auth', authRoutes);

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '✅ Exists' : '❌ Missing');
console.log('🧠 Final DB_HOST at runtime:', process.env.DB_HOST);

// 🚀 Sync and start server
try {
  await sequelize.sync();
  // await sequelize.sync({ alter: true }); // Alters existing tables to match models
  // await sequelize.sync({ force: true }); // use { force: true } 	Drops and recreates all tables
  console.log('✅ DB synced');

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
} catch (err) {
  console.error('❌ Error connecting to DB:', err);
}