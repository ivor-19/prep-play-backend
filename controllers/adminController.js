import { ChildSession, User } from "../models/model";

// Get all sessions (for admins)
export const getAllSessions = async (req, res) => {
  try {
    const sessions = await ChildSession.findAll({
      include: [{
        model: User,
        as: 'social_worker',
        attributes: ['first_name', 'last_name', 'email']
      }],
      order: [['created_at', 'DESC']]
    });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

