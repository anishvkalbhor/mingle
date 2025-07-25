import express from 'express';
import User from '../../models/User';
import Notification from '../../models/Notification';
import { sendEmail } from '../../lib/utils';

const router = express.Router();

// GET /api/admin/flagged-users
// Returns users who have been reported by others
router.get('/', async (req, res) => {
  try {
    const { deleted } = req.query;
    // Find users who have been reported by at least one user
    const filter: any = { reportedUsers: { $exists: true, $not: { $size: 0 } } };
    if (deleted === 'true') {
      filter.isDeleted = true;
    }
    const flaggedUsers = await User.find(filter);
    res.status(200).json({ flaggedUsers });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching flagged users', error: error instanceof Error ? error.message : error });
  }
});

// POST /api/admin/flagged-users/ban
router.post('/ban', async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ message: 'userId is required' });
  try {
    const user = await User.findByIdAndUpdate(userId, { isBanned: true }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Send email notification if user has email
    if (user.email) {
      try {
        await sendEmail({
          to: user.email,
          subject: 'Account Banned',
          text: 'Your account has been banned by the admin. If you believe this is a mistake, please contact support.'
        });
      } catch (emailError) {
        console.error('Failed to send ban email:', emailError);
        // Do not throw, just log
      }
    }
    return res.status(200).json({ message: 'User banned', user });
  } catch (error) {
    return res.status(500).json({ message: 'Error banning user', error: error instanceof Error ? error.message : error });
  }
});

// POST /api/admin/flagged-users/warn
router.post('/warn', async (req, res) => {
  const { userId, message } = req.body;
  if (!userId || !message) return res.status(400).json({ message: 'userId and message are required' });
  try {
    await Notification.create({ userId, type: 'admin-warning', message, read: false });
    // Send email notification if user has email
    const user = await User.findById(userId);
    if (user && user.email) {
      try {
        await sendEmail({
          to: user.email,
          subject: 'Admin Warning',
          text: `You have received a warning from the admin: ${message}`
        });
      } catch (emailError) {
        console.error('Failed to send warning email:', emailError);
        // Do not throw, just log
      }
    }
    return res.status(200).json({ message: 'Warning sent to user' });
  } catch (error) {
    return res.status(500).json({ message: 'Error warning user', error: error instanceof Error ? error.message : error });
  }
});

// POST /api/admin/flagged-users/unban
router.post('/unban', async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ message: 'userId is required' });
  try {
    const user = await User.findByIdAndUpdate(userId, { isBanned: false }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Send email notification if user has email
    if (user.email) {
      await sendEmail({
        to: user.email,
        subject: 'Account Unbanned',
        text: 'Your account has been unbanned by the admin. You can now access the platform again.'
      });
    }
    return res.status(200).json({ message: 'User unbanned', user });
  } catch (error) {
    return res.status(500).json({ message: 'Error unbanning user', error: error instanceof Error ? error.message : error });
  }
});

export default router; 