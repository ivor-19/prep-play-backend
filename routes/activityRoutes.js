import express from "express";
import {
	createActivity,
	getAllActivities,
} from "../controllers/activityController.js";

const router = express.Router();

router.get("/get", getAllActivities);
router.post("/create", createActivity);

export default router;
