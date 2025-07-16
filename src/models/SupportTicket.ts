import mongoose, { Schema, Document } from 'mongoose';

export interface ISupportTicket extends Document {
  userId: string;
  issueType: 'Bug' | 'Feedback' | 'Account';
  description: string;
  status: 'open' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
}

const SupportTicketSchema = new Schema<ISupportTicket>({
  userId: { type: String, required: true, index: true },
  issueType: { type: String, enum: ['Bug', 'Feedback', 'Account'], required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['open', 'resolved'], default: 'open' },
}, { timestamps: true });

const SupportTicket = mongoose.model<ISupportTicket>('SupportTicket', SupportTicketSchema);

export default SupportTicket; 