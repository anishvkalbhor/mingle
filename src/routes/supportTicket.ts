import express from 'express';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import SupportTicket from '../models/SupportTicket';
// import User from '../models/User'; // Removed unused import
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
    // const user = await User.findOne({ clerkId: userId });
    // if (user && user.email) {
    //   // Send email logic here
    // }

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
    return res.status(200).json({ message: 'Ticket marked as resolved', ticket });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router; 