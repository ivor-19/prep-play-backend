import { User } from '../models/model.js'

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({ success: true, message: "Data fetched successfully", data: users })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const createUser = async (req, res) => {
  const { first_name, last_name, username, email, password, phone_number, place_of_assignment, role, condition } = req.body;
  try {
    const usernameExists = await User.findOne({username})
    const emailExists = await User.findOne({email})

    if(usernameExists){
      return res.status(409).json({ success: false, error: "Username already exists"})
    }

    if(emailExists){
      return res.status(409).json({ success: false, error: "Email already exists"})
    }

    const user = await User.create({ first_name, last_name, username, email, password, phone_number, place_of_assignment, role, condition });
    res.status(201).json({ success: true, message: "Data created successfully", data: user})
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
