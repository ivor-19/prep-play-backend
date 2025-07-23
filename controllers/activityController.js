import { Activities } from "../models/model.js";

export const getAllActivities = async (req, res) => {
	try {
		const activity = await Activities.findAll();
		res.status(200).json({
			success: true,
			message: "Activities fetched successfully",
			data: activity,
		});
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
};

export const createActivity = async (req, res) => {
	const { user, action, type } = req.body;

	try {
		const activity = await Activities.create({ user, action, type });
		res.status(201).json({
			success: true,
			message: "📥 Activity created successfully",
			activity: activity,
		});
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
};
