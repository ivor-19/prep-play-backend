import { UserSW } from '../models/model.js'

export const getUsers = async (req, res) => {
  try {
    const users = await UserSW.findAll();
    res.status(200).json({
      status: "Success",
      message: "Data fetched successfully",
      data: users
    })
  } catch (err) {
    res.status(500).json({ 
      status: "Failed",
      error: err.message 
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    const user = await UserSW.create({ first_name, last_name, email, password });
    res.status(201).json({
      status: "Success",
      message: "Data created successfully",
      data: user
    })
  } catch (err) {
    res.status(500).json({ 
      status: "Failed",
      error: err.message 
    });
  }
};
