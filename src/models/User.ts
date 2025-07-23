import mongoose, { Schema } from 'mongoose';
import { IUser } from '../types';

const userSchema = new Schema<IUser>({
  clerkId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    default: '',
    required: false,
  },
  socialLinks: {
    type: Object,
    default: {},
    required: false,
  },
  occupation: {
    type: String,
    required: false,
  },
  occupationDetails: {
    organizationName: { type: String, required: false },
    instituteName: { type: String, required: false },
    degree: { type: String, required: false },
  },
  phoneNumber: {
    type: String,
    default: '',
    required: false,
  },
  dateOfBirth: {
    type: Date,
    required: false,
  },
  profilePhotos: {
    type: [String],
    default: [],
    required: false,
  },
  state: {
    type: String,
    default: '',
    required: false,
  },
  profileComplete: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isBanned: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      default: [0, 0],
      index: '2dsphere',
    },
  },
  keywords: {
    type: [String],
    default: [],
    index: true,
  },
  basicInfo: {
    type: Object,
    default: {},
    required: false,
  },
  preferences: {
    type: Object,
    default: {},
    required: false,
  },
  lifestyle: {
    type: Object,
    default: {},
    required: false,
  },
  interests: {
    type: [String],
    default: [],
    required: false,
  },
  personalityPrompts: {
    type: [Object],
    default: [],
    required: false,
  },
  partnerPreferences: {
    type: Object,
    default: {},
    required: false,
  },
  likedUsers: [{
    type: String,
    default: [],
  }],
  matchedUsers: [{
    type: String,
    default: [],
  }],
  blockedUsers: [{
    type: String,
    default: [],
  }],
  reportedUsers: [{
    type: String,
    default: [],
  }],
  profileViews: [{
    viewerId: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }],
});

// Update the updatedAt timestamp before saving
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const User = mongoose.model<IUser>('User', userSchema);

export default User; 