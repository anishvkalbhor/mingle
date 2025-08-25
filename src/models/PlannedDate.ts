import mongoose, { Document, Schema } from 'mongoose';

export interface IPlannedDate extends Document {
  userId: string;
  date: Date;
  time: string;
  state: string;
  city: string;
  venueType: string;
  venueName: string;
  venueAddress: string;
  venueRating?: number;
  venueCategory?: string;
  venueMapsUrl?: string;
  status: 'planned' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const PlannedDateSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  venueType: {
    type: String,
    required: true
  },
  venueName: {
    type: String,
    required: true
  },
  venueAddress: {
    type: String,
    required: true
  },
  venueRating: {
    type: Number,
    min: 0,
    max: 5
  },
  venueCategory: {
    type: String
  },
  venueMapsUrl: {
    type: String
  },
  status: {
    type: String,
    enum: ['planned', 'completed', 'cancelled'],
    default: 'planned'
  }
}, {
  timestamps: true
});

// Create indexes for efficient querying
PlannedDateSchema.index({ userId: 1, date: 1 });
PlannedDateSchema.index({ userId: 1, status: 1 });

export default mongoose.model<IPlannedDate>('PlannedDate', PlannedDateSchema);
