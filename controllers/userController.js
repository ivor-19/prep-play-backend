import { User } from '../models/model.js'

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({ status: "Success", message: "Data fetched successfully", data: users })
  } catch (err) {
    res.status(500).json({ status: "Failed", error: err.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { first_name, last_name, username, email, password, phone_number, place_of_assignment, role, condition } = req.body;
    const user = await User.create({ first_name, last_name, username, email, password, phone_number, place_of_assignment, role, condition });
    res.status(201).json({ state: "Success", message: "Data created successfully", data: user})
  } catch (err) {
    res.status(500).json({ state: "Failed", error: err.message });
  }
};
