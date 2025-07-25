import express from 'express';
import { getUsers, createUser, updateCondition, updateInfo, deleteUser, updateProfilePicture, removeProfilePicture } from '../controllers/userController.js';
import { authorize, verifyToken } from '../middleware/authMiddleware.js';
import upload from '../middleware/cloudinaryUploader.js';

const router = express.Router();

// Public route
router.post('/create', createUser);

// Protected route
// router.get('/get', verifyToken, authorize('admin'), getUsers); 
router.get('/get', verifyToken, authorize('admin'), getUsers); 
router.put('/update/:id/condition', verifyToken, authorize('admin'), updateCondition);
router.delete('/delete/:id', verifyToken, authorize('admin'), deleteUser);

router.put('/update/:id/info', verifyToken, updateInfo);
router.put('/update/:id/profile_picture', upload.single("image"), verifyToken, updateProfilePicture)
router.delete('/remove/:id/profile_picture', verifyToken, removeProfilePicture)

export default router;