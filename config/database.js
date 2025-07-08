import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false, // Optional: Turn off SQL logs
  }
);

// Optional: Test the connection
try {
  await sequelize.authenticate();
  console.log('✅ Database connected.');
} catch (error) {
  console.error('❌ Unable to connect:', error);
}
