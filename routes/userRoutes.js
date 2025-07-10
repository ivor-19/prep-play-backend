import express from 'express';
import { getUsers, createUser, updateCondition, updateInfo, deleteUser } from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/get', verifyToken, getUsers);
router.post('/create', createUser);
router.put('/update/:id/condition', updateCondition);
router.put('/update/:id/info', updateInfo);
router.delete('/delete/:id', deleteUser);

export default router;