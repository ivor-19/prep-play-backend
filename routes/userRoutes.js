import express from 'express';
import { getUsers, createUser } from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getUsers);
router.post('/', createUser);

export default router;