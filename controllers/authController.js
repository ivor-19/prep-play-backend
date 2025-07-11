import { User } from '../models/model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ state: "Failed", error: 'Invalid email or password' });
    }

    if (user.condition !== 'approved') {
      let errorMessage = 'Account not approved';
      if (user.condition === 'blocked') {
        errorMessage = 'Account is blocked. Please contact support.';
      } else if (user.condition === 'rejected') {
        errorMessage = 'Account was rejected. Please contact support.';
      } else if (user.condition === 'pending') {
        errorMessage = 'Account is pending approval. Please wait or contact support.';
      }
      return res.status(403).json({ success: true, error: errorMessage });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: true, error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: { 
        id: user.id, 
        email: user.email, 
        first_name: user.first_name, 
        last_name: user.last_name,
        place_of_assignment: user.place_of_assignment,
        role: user.role,
        condition: user.condition,
      }
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};