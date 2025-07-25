import express from 'express';
import { getUsers, createUser, updateCondition, updateInfo, deleteUser, updateProfilePicture, removeProfilePicture } from '../controllers/userController.js';
import { authorize, verifyToken } from '../middleware/authMiddleware.js';
import upload from '../middleware/cloudinaryUploader.js';

const router = express.Router();

// Public route
router.post('/create', createUser);

// Protected route
// router.get('/get', verifyToken, authorize('admin'), getUsers); // add auth for admin only
router.get('/get', getUsers); // add auth for admin only
router.put('/update/:id/condition', updateCondition);
router.put('/update/:id/info', updateInfo);
router.put('/update/:id/profile_picture', upload.single("image"), updateProfilePicture)
router.delete('/remove/:id/profile_picture', removeProfilePicture)
router.delete('/delete/:id', deleteUser);

export default router;