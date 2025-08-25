import mongoose, { Schema } from 'mongoose';

const NotificationSchema = new Schema({
  userId: { type: String, required: true, index: true },
  type: { type: String, required: true }, // e.g. 'match', 'like', 'chat_request', 'chat_expiry'
  message: { type: String, required: true },
  data: { type: Object, default: {} }, // extra info (e.g. userId, roomId)
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Notification = mongoose.model('Notification', NotificationSchema);

export default Notification; 