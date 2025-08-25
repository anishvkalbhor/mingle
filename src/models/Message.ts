import mongoose, { Schema } from 'mongoose';

const MessageSchema = new Schema({
  roomId: { type: String, required: true, index: true },
  senderId: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model('Message', MessageSchema);

export default Message; 