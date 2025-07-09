import { ChildSession, User } from "../models/model";

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

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
        as: 'social_worker',
        attributes: ['first_name', 'last_name']
      }],
      order: [['created_at', 'DESC']]
    });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};