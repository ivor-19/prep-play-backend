import bcrypt from "bcrypt";
import { User } from "../models/model.js";
import dotenv from "dotenv";
dotenv.config();

export const createDefaultAdmin = async () => {
	try {
		const adminEmail = process.env.ADMIN_EMAIL;
		const adminPassword = process.env.ADMIN_PASSWORD;

		const existingAdmin = await User.findOne({ where: { email: adminEmail } });

		if (!existingAdmin) {

			await User.create({
				first_name: "Admin",
				last_name: "Prep001",
				username: "admin_pr001",
				email: adminEmail,
				password: adminPassword,
				phone_number: "09123456789",
				place_of_assignment: "Bontoc",
				role: "admin",
				condition: "approved",
			});

			console.log("✅ Default admin user created.");
		} else {
			console.log("ℹ️ Admin user already exists.");
		}
	} catch (error) {
		console.error("❌ Failed to create default admin:", error);
	}
};
