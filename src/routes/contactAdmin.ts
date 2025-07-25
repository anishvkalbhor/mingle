import express from 'express';
import User from '../models/User';
import Notification from '../models/Notification';

const router = express.Router();

// POST /api/contact-admin - Banned user sends message to admin
router.post('/', async (req, res) => {
  try {
    const { message, email } = req.body;
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }
    // Create notification for all admins
    const admins = await User.find({ isAdmin: true });
    const notifMsg = `Unban request: ${message}${email ? ` (Email: ${email})` : ''}`;
    await Promise.all(admins.map(admin =>
      Notification.create({
        userId: admin.clerkId,
        type: 'unban-request',
        message: notifMsg,
        data: { email: email || null },
        read: false,
      })
    ));

    return res.status(200).json({ message: 'Message sent to admin' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to send message to admin' });
  }
});

export default router; 