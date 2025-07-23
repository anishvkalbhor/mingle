import express from 'express';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import User from '../models/User';
import MatchInteraction from '../models/MatchInteraction';
import Notification from '../models/Notification';
import { sendEmail } from '../lib/utils';

const router = express.Router();

// Utility: Map partnerPreferences answers to keywords
function partnerPrefsToKeywords(prefs: Record<string, any>): string[] {
  if (!prefs) return [];
  const keywords: string[] = [];
  for (const [key, value] of Object.entries(prefs)) {
    if (Array.isArray(value)) {
      value.forEach(v => keywords.push(`${key}:${v}`));
    } else {
      keywords.push(`${key}:${value}`);
    }
  }
  return keywords;
}

// Utility: Calculate compatibility score based on matching keywords
function calculatePartnerPreferenceKeywordCompatibility(userPrefs: Record<string, any>, otherPrefs: Record<string, any>): { matchCount: number, score: number } {
  const userKeywords = partnerPrefsToKeywords(userPrefs);
  const otherKeywords = partnerPrefsToKeywords(otherPrefs);
  const setA = new Set(userKeywords);
  const setB = new Set(otherKeywords);
  const matches = [...setA].filter(x => setB.has(x));
  const matchCount = matches.length;
  let score = 0;
  if (matchCount >= 12) score = 80 + Math.floor(Math.random() * 16); // 80-95%
  else if (matchCount >= 10) score = 70 + Math.floor(Math.random() * 11); // 70-80%
  else if (matchCount >= 8) score = 50 + Math.floor(Math.random() * 21); // 50-70%
  return { matchCount, score };
}

// GET /api/matches/suggestions
router.get('/suggestions', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const userId = req.auth.userId;
    const user = await User.findOne({ clerkId: userId });
    if (!user || !user.partnerPreferences) {
      return res.status(400).json({ message: 'Complete your profile and partner preferences first.' });
    }

    // Find users the current user has already interacted with
    const interactions = await MatchInteraction.find({ fromUserId: userId });
    const interactedIds = new Set(interactions.map(i => i.toUserId));
    interactedIds.add(userId); // Exclude self

    // Find all other users not yet interacted with
    const candidates = await User.find({
      clerkId: { $nin: Array.from(interactedIds) },
      partnerPreferences: { $exists: true, $not: { $size: 0 } }
    });

    // Calculate compatibility and filter
    const suggestions = candidates
      .map(candidate => {
        const { matchCount, score } = calculatePartnerPreferenceKeywordCompatibility(user.partnerPreferences, candidate.partnerPreferences);
        // Calculate age from dateOfBirth
        let age = null;
        if (candidate.dateOfBirth) {
          const dob = new Date(candidate.dateOfBirth);
          const diffMs = Date.now() - dob.getTime();
          const ageDt = new Date(diffMs);
          age = Math.abs(ageDt.getUTCFullYear() - 1970);
        }
        return { candidate, matchCount, score, age };
      })
      .filter(item => item.matchCount >= 8)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20)
      .map(item => ({
        clerkId: item.candidate.clerkId,
        username: item.candidate.username,
        bio: item.candidate.bio,
        profilePhoto: item.candidate.profilePhoto,
        profilePhotos: item.candidate.profilePhotos,
        partnerPreferences: item.candidate.partnerPreferences,
        compatibilityScore: item.score,
        matchCount: item.matchCount,
        age: item.age,
        interests: Array.isArray(item.candidate.interests) ? item.candidate.interests.slice(0, 5) : [],
        blurred: true // Always blurred for suggestions
      }));

    return res.status(200).json({ suggestions });
  } catch (error) {
    console.error('Error fetching match suggestions:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/matches/interact
router.post('/interact', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const fromUserId = req.auth.userId;
    const { toUserId, action } = req.body;
    if (!toUserId || !['like', 'pass'].includes(action)) {
      return res.status(400).json({ message: 'Invalid request' });
    }
    if (fromUserId === toUserId) {
      return res.status(400).json({ message: 'Cannot interact with yourself' });
    }

    // Upsert MatchInteraction
    await MatchInteraction.findOneAndUpdate(
      { fromUserId, toUserId },
      { action, timestamp: new Date() },
      { new: true, upsert: true }
    );

    // Check for mutual like
    let isMutual = false;
    if (action === 'like') {
      const reciprocal = await MatchInteraction.findOne({ fromUserId: toUserId, toUserId: fromUserId, action: 'like' });
      if (reciprocal) {
        // Update both interactions to mutual
        await MatchInteraction.updateOne({ fromUserId, toUserId }, { status: 'mutual' });
        await MatchInteraction.updateOne({ fromUserId: toUserId, toUserId: fromUserId }, { status: 'mutual' });
        isMutual = true;
        // Update matchedUsers arrays for both users
        await User.updateOne({ clerkId: fromUserId }, { $addToSet: { matchedUsers: toUserId } });
        await User.updateOne({ clerkId: toUserId }, { $addToSet: { matchedUsers: fromUserId } });
        // Notify both users of mutual match
        await Notification.create({ userId: fromUserId, type: 'match', message: 'You have a new match!', data: { with: toUserId } });
        await Notification.create({ userId: toUserId, type: 'match', message: 'You have a new match!', data: { with: fromUserId } });
        // Send email notifications for new match
        const fromUser = await User.findOne({ clerkId: fromUserId });
        const toUser = await User.findOne({ clerkId: toUserId });
        if (fromUser?.email) {
          sendEmail({
            to: fromUser.email,
            subject: 'You have a new match! 🎉',
            text: 'You have a new match! Come say hi on the app.',
          }).catch(console.error);
        }
        if (toUser?.email) {
          sendEmail({
            to: toUser.email,
            subject: 'You have a new match! 🎉',
            text: 'You have a new match! Come say hi on the app.',
          }).catch(console.error);
        }
      }
      // Add to likedUsers
      await User.updateOne({ clerkId: fromUserId }, { $addToSet: { likedUsers: toUserId } });
      // Notify liked user
      await Notification.create({ userId: toUserId, type: 'like', message: 'Someone liked you!', data: { from: fromUserId } });
      // Send email notification for like
      const likedUser = await User.findOne({ clerkId: toUserId });
      if (likedUser?.email) {
        sendEmail({
          to: likedUser.email,
          subject: 'Someone liked your profile! ❤️',
          text: 'Someone liked your profile! Check who inside the app.',
        }).catch(console.error);
      }
    }
    return res.status(200).json({ message: 'Interaction recorded', isMutual });
  } catch (error) {
    console.error('Error in /interact:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/matches/mutual
router.get('/mutual', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const userId = req.auth.userId;
    const user = await User.findOne({ clerkId: userId });
    if (!user || !user.partnerPreferences) {
      return res.status(400).json({ message: 'Complete your profile and partner preferences first.' });
    }
    // Find all mutual matches where the user is either userId1 or userId2
    const mutualMatches = await MatchInteraction.find({
      $or: [
        { fromUserId: userId },
        { toUserId: userId }
      ],
      status: 'mutual'
    });
    // Collect the IDs of the other user in each mutual match
    const matchedUserIds = mutualMatches.map(m =>
      m.fromUserId === userId ? m.toUserId : m.fromUserId
    );
    // Fetch user profiles (limited info)
    const users = await User.find({ clerkId: { $in: matchedUserIds } });
    // Add compatibility score and age for each match
    const enrichedUsers = users.map(u => {
      let age = null;
      if (u.dateOfBirth) {
        const dob = new Date(u.dateOfBirth);
        const diffMs = Date.now() - dob.getTime();
        const ageDt = new Date(diffMs);
        age = Math.abs(ageDt.getUTCFullYear() - 1970);
      }
      return {
        clerkId: u.clerkId,
        username: u.username,
        fullName: u.basicInfo?.fullName || u.username,
        bio: u.bio,
        profilePhoto: u.profilePhoto,
        profilePhotos: u.profilePhotos,
        partnerPreferences: u.partnerPreferences,
        compatibilityScore: calculatePartnerPreferenceKeywordCompatibility(user.partnerPreferences, u.partnerPreferences).score,
        age
      };
    });
    return res.status(200).json({ mutualMatches: enrichedUsers });
  } catch (error) {
    console.error('Error fetching mutual matches:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/matches/chat-request
router.post('/chat-request', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const fromUserId = req.auth.userId;
    const { toUserId } = req.body;
    if (!toUserId) {
      return res.status(400).json({ message: 'Target user ID required' });
    }
    // Check for mutual match
    const mutual = await MatchInteraction.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId }
      ],
      status: 'mutual'
    });
    if (!mutual) {
      return res.status(403).json({ message: 'No mutual match. Cannot initiate chat.' });
    }
    // For now, just return success (chat logic can be implemented later)
    return res.status(200).json({ message: 'Chat request initiated.' });
  } catch (error) {
    console.error('Error in /chat-request:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router; 