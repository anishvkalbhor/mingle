import express from 'express';
import User from '../../models/User';
import MatchInteraction from '../../models/MatchInteraction';
import Notification from '../../models/Notification';

const router = express.Router();

// GET /api/admin/users?search=&page=&limit=
router.get('/', async (req, res) => {
  try {
    const { search = '', page = 1, limit = 20 } = req.query;
    const query: any = {};
    if (search) {
      query['$or'] = [
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
      ];
    }
    const users = await User.find(query)
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .sort({ createdAt: -1 });
    const total = await User.countDocuments(query);
    res.status(200).json({ users, total });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error instanceof Error ? error.message : error });
  }
});

// GET /api/admin/users/:id
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Get matches
    const matches = await MatchInteraction.find({
      $or: [
        { fromUserId: user.clerkId },
        { toUserId: user.clerkId },
      ],
      status: 'mutual',
    });
    return res.status(200).json({ user, matches });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching user details', error: error instanceof Error ? error.message : error });
  }
});

// POST /api/admin/users/block
router.post('/block', async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ message: 'userId is required' });
  try {
    const user = await User.findByIdAndUpdate(userId, { isBanned: true }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json({ message: 'User blocked', user });
  } catch (error) {
    return res.status(500).json({ message: 'Error blocking user', error: error instanceof Error ? error.message : error });
  }
});

// POST /api/admin/users/unblock
router.post('/unblock', async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ message: 'userId is required' });
  try {
    const user = await User.findByIdAndUpdate(userId, { isBanned: false }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json({ message: 'User unblocked', user });
  } catch (error) {
    return res.status(500).json({ message: 'Error unblocking user', error: error instanceof Error ? error.message : error });
  }
});

// POST /api/admin/users/warn
router.post('/warn', async (req, res) => {
  const { userId, message } = req.body;
  if (!userId || !message) return res.status(400).json({ message: 'userId and message are required' });
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Create a notification for the user
    await Notification.create({
      userId: user.clerkId,
      type: 'warn',
      message,
      data: {},
    });
    return res.status(200).json({ message: 'Warning sent to user' });
  } catch (error) {
    return res.status(500).json({ message: 'Error sending warning', error: error instanceof Error ? error.message : error });
  }
});

export default router; 