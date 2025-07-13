import mongoose, { Schema } from 'mongoose';

const MatchInteractionSchema = new Schema({
  fromUserId: {
    type: String,
    required: true,
    index: true,
  },
  toUserId: {
    type: String,
    required: true,
    index: true,
  },
  action: {
    type: String,
    enum: ['like', 'pass'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'mutual'],
    default: 'pending',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

MatchInteractionSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

const MatchInteraction = mongoose.model('MatchInteraction', MatchInteractionSchema);

export default MatchInteraction; 