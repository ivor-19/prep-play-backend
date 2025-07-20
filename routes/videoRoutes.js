import express from "express";
import { addVideo, getAllVideos } from "../controllers/videoController.js";

const router = express.Router();

// Public route
router.post("/add", addVideo);
router.get("/get", getAllVideos);

export default router;
