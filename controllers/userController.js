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
    const usernameExists = await User.findOne({ where: {username}})
    const emailExists = await User.findOne({ where: {email}})

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

export const updateCondition = async (req, res) => {
  const { id } = req.params;
  const { condition } = req.body;
  try {
    const user = await User.findByPk(id)

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    const previousCondition = user.condition

    await user.update({condition: condition})

    res.status(200).json({ 
      success: true, 
      message: `User condition updated from ${previousCondition} to ${condition}`, 
      data: {
        id: user.id,
        condition: user.condition
      }
    
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message})
  }
}

export const updateInfo = async (req, res) => {
  const { id } = req.params;
  const { password, ...dataToUpdate } = req.body; //exlude the password for now
  try {
    const user = await User.findByPk(id)

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    await user.update(dataToUpdate)

    res.status(200).json({ success: true, message: `User's info updated successfully`, data: user})
  } catch (err) {
    res.status(500).json({ success: false, error: err.message})
  }
}

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id)

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    await user.destroy()

    res.status(200).json({ success: true, message: `Deleted successfully`})
  } catch (err) {
    res.status(500).json({ success: false, error: err.message})
  }
}

