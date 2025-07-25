import bcrypt from "bcrypt";
import { User } from "../models/model.js";

export const createDefaultAdmin = async () => {
	try {
		const adminEmail = process.env.ADMIN_EMAIL;
		const adminPassword = process.env.ADMIN_PASSWORD;

		const existingAdmin = await User.findOne({ where: { email: adminEmail } });

		if (!existingAdmin) {
			const hashedPassword = await bcrypt.hash(adminPassword, 10);

			await User.create({
				first_name: "Admin",
				last_name: "Prep001",
				username: "admin_pr001",
				email: adminEmail,
				password: hashedPassword,
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
