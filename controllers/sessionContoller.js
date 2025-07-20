import { ChildSession, User } from "../models/model.js";

export const createSession = async (req, res) => {
	try {
		const { social_worker_id, ...sessionData } = req.body;

		// Verify social worker exists
		const socialWorker = await User.findByPk(social_worker_id);
		if (!socialWorker || socialWorker.role !== "social_worker") {
			return res.status(400).json({ error: "Invalid social worker ID" });
		}

		const session = await ChildSession.create({
			social_worker_id,
			...sessionData,
		});

		res.status(201).json({
			success: true,
			message: "Session created successfully",
			data: session,
		});
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
};

export const updateSession = async (req, res) => {
	const { session_id } = req.params;
	const { social_worker_id, ...sessionToUpdate } = req.body;

	try {
		const session = await ChildSession.findByPk(session_id);

		if (!session_id) {
			return res
				.status(404)
				.json({ success: false, message: "Session not found" });
		}

		await session.update(sessionToUpdate);

		res.status(200).json({
			success: true,
			message: `Sessions's info updated successfully`,
			data: session,
		});
	} catch (err) {
		res.status(500).json({ success: false, error: err.message });
	}
};

// Get sessions for a specific social worker
export const getSessionsBySocialWorker = async (req, res) => {
	try {
		// Verify social worker exists
		const socialWorker = await User.findByPk(req.params.social_worker_id);
		if (!socialWorker || socialWorker.role !== "social_worker") {
			return res
				.status(404)
				.json({ success: false, error: "Sessions not found" });
		}

		// Fetch all sessions
		const sessions = await ChildSession.findAll({
			where: { social_worker_id: req.params.social_worker_id },
			include: [
				{
					model: User,
					as: "user",
					attributes: ["first_name", "last_name"],
				},
			],
			order: [["created_at", "DESC"]],
		});

		// Count by status
		const scheduledCount = sessions.filter(
			(session) => session.status === "scheduled",
		).length;
		const inProgressCount = sessions.filter(
			(session) => session.status === "in_progress",
		).length;
		const completedCount = sessions.filter(
			(session) => session.status === "completed",
		).length;
		const archivedCount = sessions.filter(
			(session) => session.status === "archived",
		).length;
		const rescheduledCount = sessions.filter(
			(session) => session.status === "rescheduled",
		).length;

		res.status(200).json({
			success: true,
			message: "Sessions fetched successfully",
			data: sessions,
			counts: {
				scheduled: scheduledCount,
				in_progress: inProgressCount,
				completed: completedCount,
				archived: archivedCount,
				rescheduled: rescheduledCount,
			},
		});
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
};

export const getSpecificSessionInfo = async (req, res) => {
	const { session_id } = req.params;
	try {
		const session = await ChildSession.findByPk(session_id);

		if (!session) {
			return res
				.status(404)
				.json({ success: false, message: "Session not found" });
		}

		res.status(200).json({
			success: true,
			message: `Session fetched successfully`,
			data: session,
		});
	} catch (err) {
		res.status(500).json({ success: false, error: err.message });
	}
};

// Admin
export const getAllSessions = async (req, res) => {
	try {
		const sessions = await ChildSession.findAll({
			include: [
				{
					model: User,
					as: "user",
					attributes: ["first_name", "last_name", "email"],
				},
			],
			order: [["created_at", "DESC"]],
		});
		res.status(200).json({
			success: true,
			message: "Sessions fetched successfully",
			data: sessions,
		});
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
};

export const deleteSession = async (req, res) => {
	const { session_id } = req.params;
	try {
		const session = await ChildSession.findByPk(session_id);

		if (!session) {
			return res
				.status(404)
				.json({ success: false, message: "Session not found" });
		}

		await session.destroy();

		res
			.status(200)
			.json({ success: true, message: `Deleted successfully`, data: session });
	} catch (err) {
		res.status(500).json({ success: false, error: err.message });
	}
};
