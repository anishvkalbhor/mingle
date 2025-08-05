import { Document } from 'mongoose';

// Extend Express Request to include Clerk auth
declare global {
  namespace Express {
    interface Request {
      auth: {
        userId: string;
        sessionClaims?: {
          email?: string;
          username?: string;
          image_url?: string;
        };
      };
    }
  }
}

export interface ProfileView {
  viewerId: string;
  timestamp: Date;
}

export interface IUser extends Document {
  clerkId: string;
  email: string;
  username: string;
  bio: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    introVideoUrl?: string;
    livePhotoUrl?: string;
    others?: string;
  };
  occupation: 'working' | 'student' | 'self employed';
  occupationDetails: {
    organizationName?: string;
    instituteName?: string;
    degree?: string;
  };
  phoneNumber: string;
  dateOfBirth?: Date | null;
  profilePhotos: string[];
  state: string;
  profileComplete: boolean;
  isVerified: boolean;
  isBanned: boolean;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
  keywords: string[];
  preferences: {
    ageRange: {
      min: number;
      max: number;
    };
    gender: string;
    maxDistance: number;
  };
  coordinates: {
    type: 'Point';
    coordinates: [number, number];
  };
  likedUsers: string[];
  matchedUsers: string[];
  blockedUsers: string[];
  reportedUsers: string[];
  partnerPreferences: Record<string, any>;
  basicInfo: Record<string, any>;
  lifestyle: Record<string, any>;
  interests: string[];
  personalityPrompts: Array<{ prompt: string; answer: string }>;
  profileViews?: ProfileView[];
}

export interface IProfileUpdateData {
  bio?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    others?: string;
  };
  occupation?: 'working' | 'student' | 'self employed';
  occupationDetails?: {
    organizationName?: string;
    instituteName?: string;
    degree?: string;
  };
  phoneNumber?: string;
  state?: string;
  profilePhoto?: string;
}

export interface IClerkWebhookEvent {
  type: string;
  data: {
    id: string;
    email_addresses: Array<{
      email_address: string;
    }>;
    username?: string;
  };
}

export interface IApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
}

export interface IQuestionnaireResponse extends Document {
  userId: string;
  answers: {
    // Basic Information
    gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
    sexualOrientation: 'heterosexual' | 'homosexual' | 'bisexual' | 'asexual' | 'other';
    relationshipGoal: 'marriage' | 'long_term' | 'life_partner' | 'not_sure';
    height: 'below_5' | '5_to_5_4' | '5_5_to_5_9' | '5_10_to_6' | 'above_6';
    catchphrase: string;

    // Lifestyle Preferences
    profession: string;
    dailyRoutine: 'morning_person' | 'night_owl' | 'balanced';
    alcoholConsumption: 'frequently' | 'occasionally' | 'rarely' | 'never';
    smoking: 'yes' | 'occasionally' | 'no';
    exerciseFrequency: 'daily' | '3_4_times_week' | 'occasionally' | 'never';

    // Personal Values
    religion: 'hindu' | 'muslim' | 'christian' | 'sikh' | 'atheist' | 'other';
    religionImportance: 'very_important' | 'somewhat_important' | 'not_important';
    personalValues: string[];
    openToDifferentCulture: 'yes' | 'maybe' | 'no';
    conflictHandling: 'calm_discussions' | 'emotional_response' | 'avoidance' | 'assertive_communication';

    // Relationship & Compatibility Preferences
    loveLanguage: 'words_of_affirmation' | 'acts_of_service' | 'quality_time' | 'gifts' | 'physical_touch';
    weekendPreference: 'indoors' | 'outdoors' | 'balanced';
    longDistanceOpinion: 'comfortable' | 'prefer_local' | 'not_interested';
    relocationPlans: 'yes' | 'maybe' | 'no';
    partnerType: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IMatch extends Document {
  userId1: string;
  userId2: string;
  compatibilityScore: number;
  aiInsights?: string;
  conversationStarters?: string[];
  status: 'pending' | 'mutual' | 'rejected' | 'expired';
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IChatRequest extends Document {
  senderId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: Date;
}

export interface IChatRoom extends Document {
  roomId: string;
  userIds: string[];
  startDate: Date;
  expiresAt: Date;
}

export interface IMessage extends Document {
  roomId: string;
  senderId: string;
  content: string;
  timestamp: Date;
}

export interface INotification {
  userId: string;
  type: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: Date;
} 