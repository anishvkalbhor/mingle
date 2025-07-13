import mongoose, { Schema } from 'mongoose';

const MatchSchema = new Schema({
  userId1: {
    type: String,
    required: true,
    index: true,
  },
  userId2: {
    type: String,
    required: true,
    index: true,
  },
  compatibilityScore: {
    type: Number,
    required: true,
  },
  aiInsights: {
    type: String,
    default: '',
  },
  conversationStarters: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    enum: ['pending', 'mutual', 'rejected', 'expired'],
    default: 'pending',
  },
  expiresAt: {
    type: Date,
    required: true,
  },
}, { timestamps: true });

MatchSchema.index({ userId1: 1, userId2: 1 }, { unique: true });

const Match = mongoose.model('Match', MatchSchema);

export default Match; 