import mongoose, { Schema } from 'mongoose';

const ChatRoomSchema = new Schema({
  roomId: { type: String, required: true, unique: true },
  userIds: { type: [String], required: true },
  startDate: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
});

const ChatRoom = mongoose.model('ChatRoom', ChatRoomSchema);

export default ChatRoom; 