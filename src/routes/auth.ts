import express, { Request, Response } from 'express';
import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/clerk-sdk-node';
import User from '../models/User';
import { sendEmail } from '../lib/utils';

const router = express.Router();

// Webhook handler for Clerk events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req: Request, res: Response) => {
  try {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    
    if (!WEBHOOK_SECRET) {
      throw new Error('Please add CLERK_WEBHOOK_SECRET to .env file');
    }

    // Get the headers
    const svix_id = req.headers['svix-id'] as string;
    const svix_timestamp = req.headers['svix-timestamp'] as string;
    const svix_signature = req.headers['svix-signature'] as string;

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return res.status(400).json({ error: 'Missing webhook headers' });
    }

    // Create a new Svix instance with your secret
    const wh = new Webhook(WEBHOOK_SECRET);
    
    let evt: WebhookEvent;

    try {
      evt = wh.verify(JSON.stringify(req.body), {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error('Webhook verification failed:', err);
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }

    // Handle the webhook
    const { type, data } = evt;
    
    switch (type) {
      case 'user.created': {
        // Create a new user in our database
        const newUser = new User({
          clerkId: data.id,
          email: data.email_addresses[0]?.email_address,
          username: data.username || `user_${data.id}`,
          // Set required fields with default values
          occupation: 'working', // Default value
          phoneNumber: 'pending', // Will be updated during profile completion
          dateOfBirth: new Date(), // Will be updated during profile completion
          profilePhoto: data.image_url || 'default-avatar.png', // Default avatar
          state: 'pending' // Will be updated during profile completion
        });

        await newUser.save();
        console.log('New user created:', newUser);
        // Send welcome email with verification prompt
        if (newUser.email) {
          sendEmail({
            to: newUser.email,
            subject: 'Welcome to [App Name]! Please verify your email',
            text: 'Welcome to [App Name]! Verify your email to activate your account and start meeting new people.',
          }).catch(console.error);
        }
        break;
      }
      // Add more cases as needed
    }

    return res.status(200).json({ success: true });
    
  } catch (error) {
    console.error('Webhook Error:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    });
  }
});

export default router; 