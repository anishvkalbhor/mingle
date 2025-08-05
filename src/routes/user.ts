import express, { Request, Response } from 'express';
import { ClerkExpressWithAuth, ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { clerkClient } from '@clerk/clerk-sdk-node';
import User from '../models/User';
import { IUser, IProfileUpdateData, IApiResponse } from '../types';
import MatchInteraction from '../models/MatchInteraction';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../lib/cloudinary';
import Notification from '../models/Notification';
import { sendEmail } from '../lib/utils';

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (_req: express.Request, _file: Express.Multer.File) => ({
    folder: 'profile_photos',
    format: 'png',
  }),
});
const upload = multer({ storage });

const router = express.Router();

// Apply Clerk authentication to all routes
router.use(ClerkExpressWithAuth());

// Add or update the PATCH endpoint for /api/users/me
router.patch('/me', async (req: Request, res: Response) => {
  try {
    if (!req.auth || !req.auth.userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
    const clerkId = req.auth.userId;
    let user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    
    console.log('PATCH /api/users/me request body:', req.body);
    
    // Handle basicInfo
    if (req.body.basicInfo && typeof req.body.basicInfo === 'object') {
      console.log('Updating basicInfo:', req.body.basicInfo);
      user.basicInfo = req.body.basicInfo;
      user.username = req.body.basicInfo.fullName || user.username;
      // Always set main profilePhoto from array if present
      if (Array.isArray(req.body.basicInfo.profilePhotos) && req.body.basicInfo.profilePhotos.length > 0) {
        user.profilePhotos = req.body.basicInfo.profilePhotos;
      }
    }
    
    // Handle preferences
    if (req.body.preferences && typeof req.body.preferences === 'object') {
      console.log('Updating preferences:', req.body.preferences);
      user.preferences = req.body.preferences;
    }
    
    // Handle lifestyle
    if (req.body.lifestyle && typeof req.body.lifestyle === 'object') {
      console.log('Updating lifestyle:', req.body.lifestyle);
      user.lifestyle = req.body.lifestyle;
    }
    
    // Handle interests
    if (req.body.interests && Array.isArray(req.body.interests)) {
      console.log('Updating interests:', req.body.interests);
      user.interests = req.body.interests;
    }
    
    // Handle personalityPrompts
    if (req.body.personalityPrompts && Array.isArray(req.body.personalityPrompts)) {
      console.log('Updating personalityPrompts:', req.body.personalityPrompts);
      user.personalityPrompts = req.body.personalityPrompts;
    }
    
    // Handle partnerPreferences
    if (req.body.partnerPreferences && typeof req.body.partnerPreferences === 'object') {
      console.log('Updating partnerPreferences:', req.body.partnerPreferences);
      console.log('Current user partnerPreferences:', user.partnerPreferences);
      user.partnerPreferences = req.body.partnerPreferences;
      console.log('Updated user partnerPreferences:', user.partnerPreferences);
    }
    
    // Handle socialLinks
    if (req.body.socialLinks && typeof req.body.socialLinks === 'object') {
      console.log('Updating socialLinks:', req.body.socialLinks);
      user.socialLinks = { ...user.socialLinks, ...req.body.socialLinks };
    }
    
    await user.save();
    console.log('User saved successfully');
    return res.status(200).json({ status: 'success', data: user });
  } catch (error) {
    console.error('PATCH /api/users/me error:', error);
    return res.status(500).json({ status: 'error', message: error instanceof Error ? error.message : 'Unknown error occurred' });
  }
});

// Get current user profile
router.get('/me', async (req: Request, res: Response<IApiResponse<IUser>>) => {
  try {
    console.log('GET /api/users/me called. Auth:', req.auth);
    if (!req.auth || !req.auth.userId) {
      console.log('No userId in auth. Returning 401.');
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized'
      });
    }

    const clerkId = req.auth.userId;
    let user = await User.findOne({ clerkId });
    if (user) {
      console.log('User found in DB:', user.email);
      console.log('User data structure:', {
        basicInfo: user.basicInfo,
        preferences: user.preferences,
        lifestyle: user.lifestyle,
        interests: user.interests,
        personalityPrompts: user.personalityPrompts,
        partnerPreferences: user.partnerPreferences,
        socialLinks: user.socialLinks
      });
      return res.status(200).json({
        status: 'success',
        data: user
      });
    }

    // User not found, fetch Clerk user info
    let clerkUser;
    try {
      clerkUser = await clerkClient.users.getUser(clerkId);
      console.log('Fetched Clerk user:', clerkUser);
    } catch (clerkErr) {
      console.error('Error fetching Clerk user:', clerkErr);
      return res.status(500).json({ status: 'error', message: 'Failed to fetch Clerk user' });
    }
    const email = clerkUser.emailAddresses[0]?.emailAddress || '';
    const username = clerkUser.username || email || clerkId;
    const profilePhoto = clerkUser.imageUrl || 'default-avatar.png';

    // Create a new user
    try {
      user = new User({
        clerkId,
        email,
        username,
        occupation: '',
        phoneNumber: '',
        dateOfBirth: null,
        profilePhotos: [profilePhoto],
        state: '',
        bio: '',
        profileComplete: false,
        isVerified: false,
        basicInfo: {},
        preferences: {},
        lifestyle: {},
        interests: [],
        personalityPrompts: [],
        partnerPreferences: {},
        socialLinks: {},
      });
      await user.save();
      console.log('Created new user with email:', user.email);
    } catch (creationErr) {
      console.error('Error during user creation:', creationErr);
      return res.status(500).json({ status: 'error', message: `User creation failed: ${creationErr.message}` });
    }
    return res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (error) {
    console.error('Get Profile Error:', error);
    return res.status(500).json({ 
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

// Complete user profile
router.post('/complete-profile', async (req: Request, res: Response<IApiResponse<IUser>>) => {
  try {
    console.log('Received profile data:', req.body); // Debug log
    const {
      bio, socialLinks, occupation, occupationDetails,
      phoneNumber, dateOfBirth, profilePhoto, state,
      basicInfo, preferences, lifestyle, interests, personalityPrompts, partnerPreferences
    } = req.body;
    
    const user = await User.findOne({ clerkId: req.auth.userId });
    
    if (!user) {
      return res.status(404).json({ 
        status: 'error',
        message: 'User not found' 
      });
    }
    
    // Update user profile
    user.bio = bio;
    user.socialLinks = socialLinks;
    user.occupation = occupation;
    user.occupationDetails = occupationDetails;
    user.phoneNumber = phoneNumber;
    user.dateOfBirth = new Date(dateOfBirth);
    user.profilePhotos = [profilePhoto];
    user.state = state;
    user.profileComplete = true;
    // Save profilePhotos array if present in request or in basicInfo
    if (Array.isArray(req.body.profilePhotos) && req.body.profilePhotos.length > 0) {
      user.profilePhotos = req.body.profilePhotos;
    } else if (basicInfo && Array.isArray(basicInfo.profilePhotos) && basicInfo.profilePhotos.length > 0) {
      user.profilePhotos = basicInfo.profilePhotos;
    }
    // Always save the full basicInfo object
    if (basicInfo && typeof basicInfo === 'object') {
      user.basicInfo = basicInfo;
      user.username = req.body.basicInfo?.fullName || user.username;
      // Always set main profilePhoto from array if present
      if (Array.isArray(basicInfo.profilePhotos) && basicInfo.profilePhotos.length > 0) {
        user.profilePhotos = basicInfo.profilePhotos;
      }
    }
    if (preferences) user.preferences = preferences;
    if (lifestyle) user.lifestyle = lifestyle;
    if (interests) user.interests = interests;
    if (personalityPrompts) user.personalityPrompts = personalityPrompts;
    let keywords: string[] = [];
    if (partnerPreferences && typeof partnerPreferences === 'object') {
      user.partnerPreferences = partnerPreferences;
      // Store partner preference keywords in keywords field
      for (const [key, value] of Object.entries(partnerPreferences)) {
        if (Array.isArray(value)) {
          value.forEach(v => keywords.push(`${key}:${v}`));
        } else {
          keywords.push(`${key}:${value}`);
        }
      }
    }
    user.keywords = keywords;
    console.log('Saving keywords:', keywords);
    
    await user.save();
    
    return res.status(200).json({
      status: 'success',
      message: 'Profile completed successfully',
      data: user
    });
    
  } catch (error) {
    console.error('Complete Profile Error:', error);
    return res.status(500).json({ 
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

// Update user profile
router.put('/profile', async (req: Request<{}, {}, IProfileUpdateData & { partnerPreferences?: Record<string, any> }>, res: Response<IApiResponse<IUser>>) => {
  try {
    const updates = req.body;
    const user = await User.findOne({ clerkId: req.auth.userId });
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    // Only allow updating certain fields
    const allowedUpdates = [
      'bio', 'socialLinks', 'occupation', 'occupationDetails',
      'phoneNumber', 'state', 'profilePhotos', 'partnerPreferences'
    ] as const;
    
    (Object.keys(updates) as Array<keyof IProfileUpdateData | 'partnerPreferences'>).forEach(key => {
      if (allowedUpdates.includes(key as any)) {
        (user as any)[key] = updates[key];
      }
    });
    
    await user.save();
    
    return res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: user
    });
    
  } catch (error) {
    console.error('Update Profile Error:', error);
    return res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

interface IVerifyPhoneRequest {
  verificationCode: string;
}

// Verify user's phone number
router.post('/verify-phone', async (req: Request<{}, {}, IVerifyPhoneRequest>, res: Response<IApiResponse<IUser>>) => {
  try {
    const user = await User.findOne({ clerkId: req.auth.userId });
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    // Here you would typically verify the code with your SMS provider
    // For now, we'll just mark the user as verified
    user.isVerified = true;
    await user.save();
    
    return res.status(200).json({
      status: 'success',
      message: 'Phone number verified successfully',
      data: user
    });
    
  } catch (error) {
    console.error('Phone Verification Error:', error);
    return res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

// Delete user account
router.delete('/account', async (req: Request, res: Response<IApiResponse>) => {
  try {
    const user = await User.findOneAndDelete({ clerkId: req.auth.userId });
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    // Note: The actual Clerk user deletion should be handled through Clerk's dashboard
    // or through their API if needed
    
    return res.status(200).json({
      status: 'success',
      message: 'Account deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete Account Error:', error);
    return res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

// Block a user
router.post('/block', ClerkExpressRequireAuth(), async (req: Request, res: Response) => {
  try {
    const userId = req.auth.userId;
    const { targetUserId } = req.body;
    if (!targetUserId) return res.status(400).json({ message: 'Target user ID required' });
    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.blockedUsers.includes(targetUserId)) {
      user.blockedUsers.push(targetUserId);
      await user.save();
    }
    return res.status(200).json({ message: 'User blocked' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Unblock a user
router.post('/unblock', ClerkExpressRequireAuth(), async (req: Request, res: Response) => {
  try {
    const userId = req.auth.userId;
    const { targetUserId } = req.body;
    if (!targetUserId) return res.status(400).json({ message: 'Target user ID required' });
    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.blockedUsers = user.blockedUsers.filter((id: string) => id !== targetUserId);
    await user.save();
    return res.status(200).json({ message: 'User unblocked' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Report a user
router.post('/report', ClerkExpressRequireAuth(), async (req: Request, res: Response) => {
  try {
    const userId = req.auth.userId;
    const { targetUserId } = req.body;
    if (!targetUserId) return res.status(400).json({ message: 'Target user ID required' });
    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.reportedUsers.includes(targetUserId)) {
      user.reportedUsers.push(targetUserId);
      await user.save();
    }
    return res.status(200).json({ message: 'User reported' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/users/:id/profile
router.get('/:id/profile', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const currentUserId = req.auth.userId;
    const targetUserId = req.params.id;
    if (!targetUserId) return res.status(400).json({ message: 'User ID required' });
    const user = await User.findOne({ clerkId: targetUserId });
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Check for mutual match
    const mutual = await MatchInteraction.findOne({
      $or: [
        { fromUserId: currentUserId, toUserId: targetUserId, status: 'mutual' },
        { fromUserId: targetUserId, toUserId: currentUserId, status: 'mutual' }
      ]
    });
    // Calculate age
    let age = null;
    if (user.dateOfBirth) {
      const dob = new Date(user.dateOfBirth);
      const diffMs = Date.now() - dob.getTime();
      const ageDt = new Date(diffMs);
      age = Math.abs(ageDt.getUTCFullYear() - 1970);
    }
    // Get full name from basicInfo if present
    let fullName = user.basicInfo && user.basicInfo.fullName ? user.basicInfo.fullName : undefined;
    // Calculate top interests
    const topInterests = Array.isArray(user.interests) ? user.interests.slice(0, 5) : [];
    // If mutual, return full profile
    if (mutual) {
      return res.status(200).json({
        mutual: true,
        clerkId: user.clerkId,
        username: fullName || user.username,
        fullName: fullName || user.username,
        age,
        bio: user.bio,
        interests: topInterests,
        compatibilityScore: 96, // TODO: calculate real score if needed
        socialLinks: user.socialLinks,
        profilePhotos: user.profilePhotos,
      });
    } else {
      // If not mutual, return limited info and set blurred flag
      return res.status(200).json({
        mutual: false,
        clerkId: user.clerkId,
        username: fullName || user.username,
        fullName: fullName || user.username,
        age,
        bio: user.bio,
        interests: topInterests.slice(0, 3),
        compatibilityScore: 96, // TODO: calculate real score if needed
        blurred: true,
        profilePhotos: user.profilePhotos,
      });
    }
  } catch (error) {
    console.error('Error in /:id/profile:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Increment profile view for a user
router.post('/:id/view', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const viewerId = req.auth.userId;
    const targetUserId = req.params.id;
    if (!targetUserId || viewerId === targetUserId) {
      return res.status(400).json({ message: 'Invalid target user' });
    }
    const user = await User.findOne({ clerkId: targetUserId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.profileViews = user.profileViews || [];
    user.profileViews.push({ viewerId, timestamp: new Date() });
    await user.save();
    return res.status(200).json({ message: 'Profile view recorded' });
  } catch (error) {
    console.error('Error recording profile view:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Dashboard stats aggregation endpoint
router.get('/:id/dashboard-stats', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) return res.status(400).json({ message: 'User ID required' });
    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Profile Views Per Day (last 7 days)
    const now = new Date();
    const days = [...Array(7)].map((_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (6 - i));
      d.setHours(0, 0, 0, 0);
      return d;
    });
    const profileViewsPerDay = days.map((date) => {
      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);
      const count = (user.profileViews || []).filter(v => v.timestamp >= date && v.timestamp < nextDate).length;
      return { date: date.toISOString().slice(0, 10), count };
    });

    // Likes Given/Received Per Month (last 6 months)
    const MatchInteraction = require('../models/MatchInteraction').default;
    const months = [...Array(6)].map((_, i) => {
      const d = new Date(now);
      d.setMonth(now.getMonth() - (5 - i), 1);
      d.setHours(0, 0, 0, 0);
      return d;
    });
    const likesGivenPerMonth = await Promise.all(months.map(async (date) => {
      const nextMonth = new Date(date);
      nextMonth.setMonth(date.getMonth() + 1);
      const count = await MatchInteraction.countDocuments({
        fromUserId: userId,
        action: 'like',
        timestamp: { $gte: date, $lt: nextMonth }
      });
      return { month: date.toLocaleString('default', { month: 'short', year: 'numeric' }), count };
    }));
    const likesReceivedPerMonth = await Promise.all(months.map(async (date) => {
      const nextMonth = new Date(date);
      nextMonth.setMonth(date.getMonth() + 1);
      const count = await MatchInteraction.countDocuments({
        toUserId: userId,
        action: 'like',
        timestamp: { $gte: date, $lt: nextMonth }
      });
      return { month: date.toLocaleString('default', { month: 'short', year: 'numeric' }), count };
    }));

    // Messages Per Month (last 6 months)
    const Message = require('../models/Message').default;
    const messagesPerMonth = await Promise.all(months.map(async (date) => {
      const nextMonth = new Date(date);
      nextMonth.setMonth(date.getMonth() + 1);
      const count = await Message.countDocuments({
        senderId: userId,
        timestamp: { $gte: date, $lt: nextMonth }
      });
      return { month: date.toLocaleString('default', { month: 'short', year: 'numeric' }), count };
    }));

    // Matches Per Month (last 6 months)
    const matchesPerMonth = await Promise.all(months.map(async (date) => {
      const nextMonth = new Date(date);
      nextMonth.setMonth(date.getMonth() + 1);
      const count = await MatchInteraction.countDocuments({
        $or: [
          { fromUserId: userId },
          { toUserId: userId }
        ],
        status: 'mutual',
        timestamp: { $gte: date, $lt: nextMonth }
      });
      return { month: date.toLocaleString('default', { month: 'short', year: 'numeric' }), count };
    }));

    return res.status(200).json({
      profileViewsPerDay,
      likesGivenPerMonth,
      likesReceivedPerMonth,
      messagesPerMonth,
      matchesPerMonth
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Recent Match Events endpoint
router.get('/:id/recent-events', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) return res.status(400).json({ message: 'User ID required' });
    const UserModel = require('../models/User').default;
    const MatchInteraction = require('../models/MatchInteraction').default;
    const Message = require('../models/Message').default;

    // Get recent match interactions (likes, matches)
    const matchEvents = await MatchInteraction.find({
      $or: [
        { fromUserId: userId },
        { toUserId: userId }
      ]
    }).sort({ timestamp: -1 }).limit(20);

    // Get recent messages (sent or received)
    const messageEvents = await Message.find({
      $or: [
        { senderId: userId },
      ]
    }).sort({ timestamp: -1 }).limit(20);

    // Collect unique user IDs to fetch avatars/names
    const userIds = new Set();
    matchEvents.forEach((e: any) => {
      userIds.add(e.fromUserId);
      userIds.add(e.toUserId);
    });
    messageEvents.forEach((e: any) => {
      userIds.add(e.senderId);
    });
    userIds.delete(userId); // Remove self
    const users = await UserModel.find({ clerkId: { $in: Array.from(userIds) } });
    const userMap: { [key: string]: any } = {};
    users.forEach((u: any) => {
      userMap[u.clerkId] = {
        name: u.basicInfo?.fullName || u.username || u.email,
        avatar: u.profilePhotos && u.profilePhotos.length > 0 ? u.profilePhotos[0] : '',
      };
    });

    // Format match events
    const formattedMatchEvents = matchEvents.map((e: any) => {
      const isOutgoing = e.fromUserId === userId;
      const otherId = isOutgoing ? e.toUserId : e.fromUserId;
      if (!userMap[otherId]) {
        console.log('Missing user in DB for event:', otherId);
        return null;
      }
      let type = 'like';
      let action = isOutgoing ? 'You liked' : 'Liked you';
      if (e.status === 'mutual') {
        type = 'match';
        action = 'New match!';
      }
      return {
        type,
        name: userMap[otherId].name,
        avatar: userMap[otherId].avatar,
        time: e.timestamp,
        action,
      };
    }).filter((e: any) => e !== null);

    // Format message events
    const formattedMessageEvents = messageEvents.map((e: any) => {
      if (!userMap[e.senderId]) {
        console.log('Missing user in DB for message event:', e.senderId);
        return null;
      }
      return {
        type: 'message',
        name: userMap[e.senderId].name,
        avatar: userMap[e.senderId].avatar,
        time: e.timestamp,
        action: 'Sent you a message',
      };
    }).filter((e: any) => e !== null);

    // Combine and sort all events by time desc
    const allEvents = [...formattedMatchEvents, ...formattedMessageEvents]
      .sort((a: any, b: any) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 20)
      .map((e: any) => ({ ...e, time: timeAgo(e.time) }));

    // Deduplicate: keep only the most recent event per user (by name)
    const uniqueEventsMap = new Map();
    allEvents.forEach((event: any) => {
      if (!uniqueEventsMap.has(event.name)) {
        uniqueEventsMap.set(event.name, event);
      }
    });
    const uniqueEvents = Array.from(uniqueEventsMap.values());

    function timeAgo(date: any) {
      const now = new Date();
      const diff = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
      if (diff < 60) return `${diff}s ago`;
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      return `${Math.floor(diff / 86400)}d ago`;
    }

    return res.status(200).json({ events: uniqueEvents });
  } catch (error) {
    console.error('Recent events error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Photo upload endpoint
router.post('/upload-photo', upload.single('photo'), async (req: express.Request & { file?: Express.Multer.File }, res) => {
  if (!req.file) return res.status(400).json({ status: 'error', message: 'No file uploaded' });
  return res.json({ status: 'success', url: req.file.path });
});

// Get notifications for current user
router.get('/notifications', ClerkExpressRequireAuth(), async (req: Request, res: Response) => {
  try {
    const userId = req.auth.userId;
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 }).limit(100);
    return res.status(200).json({ notifications });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});
// Mark notifications as read
router.post('/notifications/read', ClerkExpressRequireAuth(), async (req: Request, res: Response) => {
  try {
    const userId = req.auth.userId;
    await Notification.updateMany({ userId, read: false }, { $set: { read: true } });
    return res.status(200).json({ message: 'Notifications marked as read' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Password reset request (send email)
router.post('/password-reset', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Generate a reset token (for demo, use a random string)
    const resetToken = Math.random().toString(36).substr(2, 10);
    // In production, store the token and expiry in DB and send a real link
    // For now, just send a placeholder email
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      text: `Click here to reset your password: https://your-app.com/reset-password?token=${resetToken}`,
    });
    return res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router; 