import express, { Request, Response } from 'express';
import { ClerkExpressWithAuth, ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { clerkClient } from '@clerk/clerk-sdk-node';
import User from '../models/User';
import { IUser, IProfileUpdateData, IApiResponse } from '../types';
import MatchInteraction from '../models/MatchInteraction';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../lib/cloudinary';

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
    const { basicInfo } = req.body;
    console.log('PATCH /api/users/me request body:', req.body);
    if (basicInfo && typeof basicInfo === 'object') {
      console.log('basicInfo.profilePhoto:', basicInfo.profilePhoto);
      user.basicInfo = basicInfo;
      user.username = basicInfo.fullName || user.username;
      // Always set main profilePhoto from array if present
      if (Array.isArray(basicInfo.profilePhotos) && basicInfo.profilePhotos.length > 0) {
        user.profilePhoto = basicInfo.profilePhotos[0];
      } else if (basicInfo.profilePhoto) {
        user.profilePhoto = basicInfo.profilePhoto;
      }
    }
    await user.save();
    return res.status(200).json({ status: 'success', data: user });
  } catch (error) {
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
        profilePhoto,
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
    user.profilePhoto = profilePhoto;
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
        user.profilePhoto = basicInfo.profilePhotos[0];
      } else if (basicInfo.profilePhoto) {
        user.profilePhoto = basicInfo.profilePhoto;
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
      'phoneNumber', 'state', 'profilePhoto', 'partnerPreferences'
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
        profilePhoto: user.profilePhoto,
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
        profilePhoto: user.profilePhoto,
        profilePhotos: user.profilePhotos,
      });
    }
  } catch (error) {
    console.error('Error in /:id/profile:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Photo upload endpoint
router.post('/upload-photo', upload.single('photo'), async (req: express.Request & { file?: Express.Multer.File }, res) => {
  if (!req.file) return res.status(400).json({ status: 'error', message: 'No file uploaded' });
  return res.json({ status: 'success', url: req.file.path });
});

export default router; 