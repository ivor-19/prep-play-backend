import { Videos } from "../models/model.js";

export const addVideo = async (req, res) => {
	try {
		const { id, ...videoData } = req.body;

		// // Verify social worker exists
		// const videoId = await Videos.findByPk(id);
		// if (!videoId) {
		// 	return res.status(400).json({ error: "Video already exists" });
		// }

		const data = await Videos.create({
			...videoData,
		});

		res.status(201).json({
			success: true,
			message: "Video added successfully",
			data: data,
		});
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
};

export const getAllVideos = async (req, res) => {
	try {
		const videos = await Videos.findAll();
		res.status(200).json({
			success: true,
			message: "Videos fetched successfully",
			data: videos,
		});
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
};
