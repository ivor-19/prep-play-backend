import { ChildSession, User } from "../models/model.js";

export const createSession = async (req, res) => {
  try {
    const { social_worker_id, ...sessionData } = req.body;
    
    // Verify social worker exists
    const socialWorker = await User.findByPk(social_worker_id);
    if (!socialWorker || socialWorker.role !== 'social_worker') {
      return res.status(400).json({ error: 'Invalid social worker ID' });
    }

    const session = await ChildSession.create({
      social_worker_id,
      ...sessionData
    });

    res.status(201).json({ status: "Success", data: session});
  } catch (error) {
    res.status(500).json({ status: "Failed", error: error.message });
  }
};

// Get sessions for a specific social worker
export const getSessionsBySocialWorker = async (req, res) => {
  try {
    // Verify social worker exists
    const socialWorker = await User.findByPk(req.params.social_worker_id);
    if (!socialWorker || socialWorker.role !== 'social_worker') {
      return res.status(404).json({ error: 'Social worker not found' });
    }

    const sessions = await ChildSession.findAll({
      where: { social_worker_id: req.params.social_worker_id },
      include: [{
        model: User,
        as: 'user',
        attributes: ['first_name', 'last_name']
      }],
      order: [['created_at', 'DESC']]
    });
    res.status(200).json({ status: "Success", data: sessions});
  } catch (error) {
    res.status(500).json({ status: "Failed", error: error.message });
  }
};

export const getAllSessions = async (req, res) => {
  try {
    const sessions = await ChildSession.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: ['first_name', 'last_name', 'email']
      }],
      order: [['created_at', 'DESC']]
    });
    res.status().json({ status: "Success", data: sessions });
  } catch (error) {
    res.status(500).json({ status: "Failed", error: error.message });
  }
};
