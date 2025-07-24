import express from "express";
import {
	addVideo,
	deleteVideo,
	getAllVideos,
} from "../controllers/videoController.js";

const router = express.Router();

// Public route
router.post("/add", addVideo);
router.get("/get", getAllVideos);
router.delete("/delete/:id", deleteVideo);

export default router;
