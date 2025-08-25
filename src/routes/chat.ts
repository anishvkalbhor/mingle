import express from 'express';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import ChatRequest from '../models/ChatRequest';
import ChatRoom from '../models/ChatRoom';
import Message from '../models/Message';
import MatchInteraction from '../models/MatchInteraction';
import Notification from '../models/Notification';
import { v4 as uuidv4 } from 'uuid';
import { sendEmail } from '../lib/utils';
import User from '../models/User';

const router = express.Router();

// POST /api/chat/request - Send chat request (only if mutual match)
router.post('/request', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const senderId = req.auth.userId;
    const { receiverId } = req.body;
    if (!receiverId) return res.status(400).json({ message: 'Receiver ID required' });
    if (senderId === receiverId) return res.status(400).json({ message: 'Cannot chat with yourself' });
    // Check for mutual match
    const mutual = await MatchInteraction.findOne({
      $or: [
        { fromUserId: senderId, toUserId: receiverId, status: 'mutual' },
        { fromUserId: receiverId, toUserId: senderId, status: 'mutual' }
      ]
    });
    if (!mutual) return res.status(403).json({ message: 'No mutual match. Cannot send chat request.' });
    // Upsert chat request
    const chatRequest = await ChatRequest.findOneAndUpdate(
      { senderId, receiverId },
      { status: 'pending', timestamp: new Date() },
      { new: true, upsert: true }
    );
    // Notify receiver
    await Notification.create({ userId: receiverId, type: 'chat_request', message: 'You have a new chat request!', data: { from: senderId } });
    // Send email notification for new chat request
    const receiver = await User.findOne({ clerkId: receiverId });
    if (receiver?.email) {
      sendEmail({
        to: receiver.email,
        subject: 'You have a new chat request! 💬',
        text: 'You have a new chat request! Open the app to start chatting.',
      }).catch(console.error);
    }
    return res.status(200).json({ message: 'Chat request sent', chatRequest });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/chat/accept - Accept chat request, create chat room
router.post('/accept', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const receiverId = req.auth.userId;
    const { senderId } = req.body;
    if (!senderId) return res.status(400).json({ message: 'Sender ID required' });
    // Find chat request
    const chatRequest = await ChatRequest.findOne({ senderId, receiverId, status: 'pending' });
    if (!chatRequest) return res.status(404).json({ message: 'No pending chat request found' });
    // Accept request
    chatRequest.status = 'accepted';
    await chatRequest.save();
    // Create chat room (expires in 4 days)
    const roomId = uuidv4();
    const startDate = new Date();
    const expiresAt = new Date(startDate.getTime() + 4 * 24 * 60 * 60 * 1000);
    const chatRoom = new ChatRoom({ roomId, userIds: [senderId, receiverId], startDate, expiresAt });
    await chatRoom.save();
    // Notify sender
    await Notification.create({ userId: senderId, type: 'chat_accept', message: 'Your chat request was accepted!', data: { by: receiverId } });
    return res.status(200).json({ message: 'Chat request accepted', chatRoom });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Utility: Send chat expiry notifications for each day left
async function sendChatExpiryNotifications(chatRoom: any, userIds: any[]) {
  const now = new Date();
  const expiresAt = new Date(chatRoom.expiresAt);
  const msInDay = 24 * 60 * 60 * 1000;
  const daysLeft = Math.ceil((expiresAt.getTime() - now.getTime()) / msInDay);
  if (daysLeft > 0 && daysLeft <= 4) {
    for (const userId of userIds) {
      // Only send if not already sent for this day
      const already = await Notification.findOne({ userId, type: 'chat_expiry', 'data.roomId': chatRoom.roomId, 'data.daysLeft': daysLeft });
      if (!already) {
        await Notification.create({
          userId,
          type: 'chat_expiry',
          message: `Your chat will expire in ${daysLeft} day${daysLeft > 1 ? 's' : ''}. Upgrade to keep chatting!`,
          data: { roomId: chatRoom.roomId, daysLeft },
        });
        // Send email notification for chat expiry warning
        const user = await User.findOne({ clerkId: userId });
        if (user?.email) {
          sendEmail({
            to: user.email,
            subject: 'Chat Expiry Warning ⏰',
            text: `Your chat with someone is expiring in ${daysLeft} hour(s). Upgrade to continue chatting!`,
          }).catch(console.error);
        }
      }
    }
  }
}

// GET /api/chat/room/:userId - Get or create chat room for two users (if accepted)
router.get('/room/:userId', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const userId1 = req.auth.userId;
    const userId2 = req.params.userId;
    if (!userId2) return res.status(400).json({ message: 'User ID required' });
    // Find accepted chat request
    const chatRequest = await ChatRequest.findOne({
      $or: [
        { senderId: userId1, receiverId: userId2, status: 'accepted' },
        { senderId: userId2, receiverId: userId1, status: 'accepted' }
      ]
    });
    if (!chatRequest) return res.status(403).json({ message: 'No accepted chat request.' });
    // Find chat room
    const chatRoom = await ChatRoom.findOne({ userIds: { $all: [userId1, userId2] } });
    if (!chatRoom) return res.status(404).json({ message: 'No chat room found.' });
    // Check if expired
    const now = new Date();
    const expired = now > chatRoom.expiresAt;
    // Send chat expiry notifications for each day left (if not expired)
    if (!expired) {
      await sendChatExpiryNotifications(chatRoom, [userId1, userId2]);
    }
    return res.status(200).json({ chatRoom, expired });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/chat/messages/:roomId - Get messages for a room
router.get('/messages/:roomId', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const { roomId } = req.params;
    if (!roomId) return res.status(400).json({ message: 'Room ID required' });
    const messages = await Message.find({ roomId }).sort({ timestamp: 1 });
    return res.status(200).json({ messages });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/chat/message - Send a message (text/emoji only, only if room not expired)
router.post('/message', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const senderId = req.auth.userId;
    const { roomId, content } = req.body;
    if (!roomId || !content) return res.status(400).json({ message: 'Room ID and content required' });
    // Check room
    const chatRoom = await ChatRoom.findOne({ roomId });
    if (!chatRoom) return res.status(404).json({ message: 'Chat room not found' });
    // Check if expired
    const now = new Date();
    if (now > chatRoom.expiresAt) return res.status(403).json({ message: 'Chat expired' });
    // Only allow text and emoji (no media)
    if (/https?:\/\//.test(content) || /<img|<video|<audio|<a /.test(content)) {
      return res.status(400).json({ message: 'Media not allowed' });
    }
    const message = new Message({ roomId, senderId, content, timestamp: now });
    await message.save();
    return res.status(200).json({ message: 'Message sent', data: message });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/chat/request-status/:otherUserId
router.get('/request-status/:otherUserId', ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  const otherUserId = req.params.otherUserId;
  const chatRequest = await ChatRequest.findOne({
    $or: [
      { senderId: userId, receiverId: otherUserId },
      { senderId: otherUserId, receiverId: userId }
    ]
  });
  if (!chatRequest) return res.status(200).json({ status: 'none' });
  return res.status(200).json({
    status: chatRequest.status,
    senderId: chatRequest.senderId,
    receiverId: chatRequest.receiverId
  });
});

export default router; 