import mongoose, { Schema } from 'mongoose';

const ChatRequestSchema = new Schema({
  senderId: { type: String, required: true, index: true },
  receiverId: { type: String, required: true, index: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  timestamp: { type: Date, default: Date.now },
});

ChatRequestSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });

const ChatRequest = mongoose.model('ChatRequest', ChatRequestSchema);

export default ChatRequest; 