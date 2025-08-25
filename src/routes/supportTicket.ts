import express from 'express';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import SupportTicket from '../models/SupportTicket';
import { sendEmail } from '../lib/utils';
import User from '../models/User';
import Notification from '../models/Notification'; // Added import for Notification
// import nodemailer from 'nodemailer'; // Uncomment and configure for real email

const router = express.Router();

// POST /api/support-ticket - Create a new support ticket
router.post('/', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { issueType, description } = req.body;
    if (!issueType || !description) {
      return res.status(400).json({ message: 'Issue type and description are required' });
    }
    const ticket = await SupportTicket.create({ userId, issueType, description });

    // Email acknowledgement (placeholder)
    const user = await User.findOne({ clerkId: userId });
    if (user && user.email) {
      sendEmail({
        to: user.email,
        subject: 'Support Ticket Received',
        text: 'We have received your support ticket and will get back to you soon.',
      }).catch(console.error);
    }

    // Notify all admins of new support ticket
    const admins = await User.find({ isAdmin: true });
    for (const admin of admins) {
      await Notification.create({
        userId: admin.clerkId,
        type: 'support-ticket',
        message: `New support ticket submitted by ${user?.email || userId}: ${issueType}`,
        data: { ticketId: ticket._id, userId, issueType, description }
      });
    }

    return res.status(201).json({ message: 'Support ticket submitted', ticket });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/support-ticket - List all tickets (admin only, simple for now)
router.get('/', ClerkExpressRequireAuth(), async (_req, res) => {
  // TODO: Add admin check
  try {
    const tickets = await SupportTicket.find().sort({ createdAt: -1 });
    return res.status(200).json({ tickets });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/support-ticket/:id/resolve - Mark ticket as resolved (admin only)
router.put('/:id/resolve', ClerkExpressRequireAuth(), async (req, res) => {
  // TODO: Add admin check
  try {
    const ticket = await SupportTicket.findByIdAndUpdate(
      req.params.id,
      { status: 'resolved' },
      { new: true }
    );
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    // Notify the user via notification and email
    const userResolved = await User.findOne({ clerkId: ticket.userId });
    if (userResolved) {
      // In-app notification
      await Notification.create({
        userId: userResolved.clerkId,
        type: 'support-resolved',
        message: 'Your support ticket has been resolved by the admin.',
        data: { ticketId: ticket._id }
      });
      // Email notification
      if (userResolved.email) {
        try {
          await sendEmail({
            to: userResolved.email,
            subject: 'Your Support Ticket Has Been Resolved',
            text: 'Hello,\n\nYour Issue has been resolved by the admin. If you have further questions, please reply or open a new ticket.\n\nThank you!'
          });
        } catch (emailError) {
          console.error('Failed to send support resolved email:', emailError);
          // Do not throw, just log
        }
      }
    }

    return res.status(200).json({ message: 'Ticket marked as resolved', ticket });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router; 