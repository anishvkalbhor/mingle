import mongoose, { Schema } from 'mongoose';
import { IQuestionnaireResponse } from '../types';

const QuestionnaireSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  answers: {
    // Basic Information
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer_not_to_say'],
      required: true
    },
    sexualOrientation: {
      type: String,
      enum: ['heterosexual', 'homosexual', 'bisexual', 'asexual', 'other'],
      required: true
    },
    relationshipGoal: {
      type: String,
      enum: ['marriage', 'long_term', 'life_partner', 'not_sure'],
      required: true
    },
    height: {
      type: String,
      enum: ['below_5', '5_to_5_4', '5_5_to_5_9', '5_10_to_6', 'above_6'],
      required: true
    },
    catchphrase: {
      type: String,
      required: true,
      trim: true
    },

    // Lifestyle Preferences
    profession: {
      type: String,
      required: true,
      trim: true
    },
    dailyRoutine: {
      type: String,
      enum: ['morning_person', 'night_owl', 'balanced'],
      required: true
    },
    alcoholConsumption: {
      type: String,
      enum: ['frequently', 'occasionally', 'rarely', 'never'],
      required: true
    },
    smoking: {
      type: String,
      enum: ['yes', 'occasionally', 'no'],
      required: true
    },
    exerciseFrequency: {
      type: String,
      enum: ['daily', '3_4_times_week', 'occasionally', 'never'],
      required: true
    },

    // Personal Values
    religion: {
      type: String,
      enum: ['hindu', 'muslim', 'christian', 'sikh', 'atheist', 'other'],
      required: true
    },
    religionImportance: {
      type: String,
      enum: ['very_important', 'somewhat_important', 'not_important'],
      required: true
    },
    personalValues: [{
      type: String,
      enum: ['honesty', 'loyalty', 'ambition', 'humor', 'kindness', 'family-oriented'],
      required: true
    }],
    openToDifferentCulture: {
      type: String,
      enum: ['yes', 'maybe', 'no'],
      required: true
    },
    conflictHandling: {
      type: String,
      enum: ['calm_discussions', 'emotional_response', 'avoidance', 'assertive_communication'],
      required: true
    },

    // Relationship & Compatibility Preferences
    loveLanguage: {
      type: String,
      enum: ['words_of_affirmation', 'acts_of_service', 'quality_time', 'gifts', 'physical_touch'],
      required: true
    },
    weekendPreference: {
      type: String,
      enum: ['indoors', 'outdoors', 'balanced'],
      required: true
    },
    longDistanceOpinion: {
      type: String,
      enum: ['comfortable', 'prefer_local', 'not_interested'],
      required: true
    },
    relocationPlans: {
      type: String,
      enum: ['yes', 'maybe', 'no'],
      required: true
    },
    partnerType: {
      type: String,
      required: true,
      trim: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
QuestionnaireSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create indexes for better query performance
QuestionnaireSchema.index({ 'answers.gender': 1 });
QuestionnaireSchema.index({ 'answers.relationshipGoal': 1 });
QuestionnaireSchema.index({ 'answers.personalValues': 1 });

// Create the model
const Questionnaire = mongoose.model<IQuestionnaireResponse>('Questionnaire', QuestionnaireSchema);

export default Questionnaire; 