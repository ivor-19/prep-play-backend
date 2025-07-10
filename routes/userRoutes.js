import express from 'express';
import { getUsers, createUser, updateCondition, updateInfo, deleteUser } from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route
router.post('/create', createUser);

// Protected route
router.get('/get', verifyToken, getUsers); // add auth for admin only
router.put('/update/:id/condition', updateCondition);
router.put('/update/:id/info', updateInfo);
router.delete('/delete/:id', deleteUser);

export default router;