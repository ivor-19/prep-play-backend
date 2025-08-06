import { endOfWeek, startOfWeek } from "date-fns";
import { Op } from "sequelize";
import { Activities, User } from "../models/model.js";
import cloudinary from "../config/cloudinary.js";

export const getUsers = async (req, res) => {
	try {
		const {
			search,
			page = 1,
			rowsPerPage = 10,
			role,
			condition,
			place_of_assignment,
		} = req.query;

		const currentPage = parseInt(page);
		const limit = parseInt(rowsPerPage);
		const offset = (currentPage - 1) * limit;

		const whereClause = {};

		// Search filters
		if (search) {
			whereClause[Op.or] = [
				{ first_name: { [Op.like]: `%${search}%` } },
				{ last_name: { [Op.like]: `%${search}%` } },
				{ username: { [Op.like]: `%${search}%` } },
				{ email: { [Op.like]: `%${search}%` } },
			];
		}

		if (role) whereClause.role = role;
		if (condition) whereClause.condition = condition;
		if (place_of_assignment)
			whereClause.place_of_assignment = place_of_assignment;

		const totalCount = await User.count({ where: whereClause });
		const users = await User.findAll({
			where: whereClause,
			limit,
			offset,
			order: [["createdAt", "DESC"]],
			attributes: { exclude: ["password"] },
		});

		// If no users found
		if (users.length === 0) {
			return res.status(200).json({
				success: true,
				message: "No users found matching your criteria.",
				data: [],
				pagination: {
					currentPage,
					rowsPerPage: limit,
					totalPages: Math.ceil(totalCount / limit),
					totalCount,
				},
			});
		}

		const startWeek = startOfWeek(new Date());
		const endWeek = endOfWeek(new Date());

		const newThisWeek = await User.count({
			where: {
				createdAt: {
					[Op.between]: [startWeek, endWeek],
				},
			},
		});

    const adminCount = await User.count({ where: { role: "admin" } });
    const socialWorkerCount = await User.count({ where: { role: "social_worker" } });
		const pendingCount = await User.count({ where: { condition: "pending" } });
		const blockedCount = await User.count({ where: { condition: "blocked" } });
		const rejectedCount = await User.count({ where: { condition: "rejected" } });
		const approvedCount = await User.count({ where: { condition: "approved" },});
		const approvalRate = totalCount > 0 ? (approvedCount / totalCount) * 100 : 0;

		res.status(200).json({
			success: true,
			message: "Data fetched successfully",
			data: users,
			statistics: {
        totalUsers: totalCount,
        adminCount,
        socialWorkerCount,
        newThisWeek,
        approvedCount,
        approvalRate,
        rejectedCount,
        blockedCount,
				needForApprovalCount: pendingCount,
			},
			pagination: {
				currentPage,
				rowsPerPage: limit,
				totalPages: Math.ceil(totalCount / limit),
				totalCount,
			},
		});
	} catch (err) {
		res.status(500).json({ success: false, error: err.message });
	}
};

export const createUser = async (req, res) => {
	const {
		first_name,
		last_name,
		username,
		email,
		password,
		phone_number,
		place_of_assignment,
		role,
		condition,
	} = req.body;
	try {
		const usernameExists = await User.findOne({ where: { username } });
		const emailExists = await User.findOne({ where: { email } });

		if (usernameExists) {
			return res
				.status(409)
				.json({ success: false, error: "Username already exists" });
		}

		if (emailExists) {
			return res
				.status(409)
				.json({ success: false, error: "Email already exists" });
		}

		const user = await User.create({
			first_name,
			last_name,
			username,
			email,
			password,
			phone_number,
			place_of_assignment,
			role,
			condition,
		});
		const activity = await Activities.create({
			user: username,
			action: "📥 New registration",
			type: "registration",
		});
		res.status(201).json({
			success: true,
			message: "Data created successfully",
			data: user,
			activity: activity,
		});
	} catch (err) {
		res.status(500).json({ success: false, error: err.message });
	}
};

export const updateCondition = async (req, res) => {
	const { id } = req.params;
	const { condition } = req.body;
	try {
		const user = await User.findByPk(id);

		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}

		const previousCondition = user.condition;

		await user.update({ condition: condition });
		const activity = await Activities.create({
			user: user.username,
			action: `✏️ Account condition updated from ${previousCondition} ➡️ ${condition}`,
			type: `update`,
		});
		res.status(200).json({
			success: true,
			message: `User condition updated from ${previousCondition} to ${condition}`,
			data: {
				id: user.id,
				condition: user.condition,
			},
			activity: activity,
		});
	} catch (err) {
		res.status(500).json({ success: false, error: err.message });
	}
};

export const updateInfo = async (req, res) => {
	const { id } = req.params;
	const { password, ...dataToUpdate } = req.body; //exlude the password for now
	try {
		const user = await User.findByPk(id);

		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}

		await user.update(dataToUpdate);
		const activity = await Activities.create({
			user: user.username,
			action: `✏️ Profile updated`,
			type: `update`,
		});
		res.status(200).json({
			success: true,
			message: `User's info updated successfully`,
			data: user,
			activity: activity,
		});
	} catch (err) {
		res.status(500).json({ success: false, error: err.message });
	}
};

export const deleteUser = async (req, res) => {
	const { id } = req.params;
	try {
		const user = await User.findByPk(id);

		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}

		await user.destroy();
		const activity = await Activities.create({
			user: user.username,
			action: `❌ Account deleted`,
			type: `delete`,
		});
		res.status(200).json({
			success: true,
			message: `Deleted successfully`,
			activity: activity,
		});
	} catch (err) {
		res.status(500).json({ success: false, error: err.message });
	}
};

export const updateArchive = async (req, res) => {
	const { id } = req.params;

	try {
		const user = await User.findByPk(id)

		if(!user){
			return res.status(404).json({success: false, message: 'User not found'})
		}

		const previousCondition = user.condition;

		await user.update({condition: 'archived'})
		const activity = await Activities.create({
			user: user.username,
			action: `✏️ User archived`,
			type: `update`,
		});
		res.status(200).json({
			success: true,
			message: `User condition updated from ${previousCondition} to archived`,
			data: {
				id: user.id,
				condition: user.condition,
			},
			activity: activity,
		});
	}
	catch (err){
		res.status(500).json({success: false, error: err.message})
	}
}

export const updateProfilePicture = async (req, res) => {
	const { id } = req.params;
	try {
		const user = await User.findByPk(id);

		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}

		// image file is uploaded by multer
		if (!req.file || !req.file.path) {
			return res.status(400).json({ success: false, message: "No image uploaded" });
		}

		// Save Cloudinary image URL to user
		user.profile_picture = req.file.path;
		await user.save();

		res.status(200).json({
			success: true,
			message: `Profile picture changed`,
			data: { profile_picture: user.profile_picture },
		});
	} catch (err) {
		res.status(500).json({ success: false, error: err.message });
	}
}

export const removeProfilePicture = async (req, res) => {
	const { id } = req.params;
	try {
		const user = await User.findByPk(id);

		if (!user || !user.profile_picture) {
			return res.status(404).json({
				success: false,
				message: "User not found or no profile picture set",
			});
		}

		// Extract public_id from URL
		const urlParts = user.profile_picture.split("/");
		const filename = urlParts.pop(); // last item
		const folder = urlParts.pop();   // second last item
		const publicId = `${folder}/${filename.split(".")[0]}`;

		await cloudinary.uploader.destroy(publicId);

		// Clear from DB
		user.profile_picture = null;
		await user.save();

		res.status(200).json({
			success: true,
			message: `Profile picture removed`,
		});
	} catch (err) {
		res.status(500).json({ success: false, error: err.message });
	}
}
