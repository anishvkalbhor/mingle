import express from 'express';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import mongoose from 'mongoose';
import Questionnaire from '../models/Questionnaire';
import User from '../models/User';

const router = express.Router();

// POST /api/questionnaire
router.post('/', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const userId = req.auth.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dating-app');

    // Create or update the questionnaire
    const questionnaire = await Questionnaire.findOneAndUpdate(
      { userId },
      {
        userId,
        answers: req.body,
        updatedAt: new Date()
      },
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );

    // After saving questionnaire, extract keywords and update user profile
    const keywords = extractKeywordsFromAnswers(req.body);
    const userUpdateResult = await User.findOneAndUpdate(
      { clerkId: userId },
      { $set: { keywords } },
      { new: true }
    );
    console.log('Tried to update user keywords for clerkId:', userId, 'Result:', userUpdateResult);

    return res.status(200).json({
      message: 'Questionnaire submitted successfully',
      data: questionnaire
    });
  } catch (error) {
    console.error('Error submitting questionnaire:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        errors: Object.values(error.errors).map((err: any) => err.message)
      });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/questionnaire/:userId
router.get('/:userId', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const userId = req.auth.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dating-app');

    const questionnaire = await Questionnaire.findOne({ userId });
    
    if (!questionnaire) {
      return res.status(404).json({ message: 'Questionnaire not found' });
    }

    return res.status(200).json({
      message: 'Questionnaire retrieved successfully',
      data: questionnaire
    });
  } catch (error) {
    console.error('Error fetching questionnaire:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Utility: Map questionnaire answers to keywords
function extractKeywordsFromAnswers(answers: any): string[] {
  const keywords: string[] = [];

  // Simple direct mapping for all MCQ answers
  if (answers.gender) keywords.push(`gender-${answers.gender}`);
  if (answers.sexualOrientation) keywords.push(`sexualOrientation-${answers.sexualOrientation}`);
  if (answers.relationshipGoal) keywords.push(`relationshipGoal-${answers.relationshipGoal}`);
  if (answers.height) keywords.push(`height-${answers.height}`);
  if (answers.catchphrase) keywords.push(`catchphrase-${answers.catchphrase}`);
  if (answers.profession) keywords.push(`profession-${answers.profession.toLowerCase().replace(/\s+/g, '-')}`);
  if (answers.dailyRoutine) keywords.push(`dailyRoutine-${answers.dailyRoutine}`);
  if (answers.alcoholConsumption) keywords.push(`alcoholConsumption-${answers.alcoholConsumption}`);
  if (answers.smoking) keywords.push(`smoking-${answers.smoking}`);
  if (answers.exerciseFrequency) keywords.push(`exerciseFrequency-${answers.exerciseFrequency}`);
  if (answers.religion) keywords.push(`religion-${answers.religion}`);
  if (answers.religionImportance) keywords.push(`religionImportance-${answers.religionImportance}`);
  if (Array.isArray(answers.personalValues)) {
    answers.personalValues.forEach((val: string) => {
      keywords.push(`personalValues-${val}`);
    });
  }
  if (answers.openToDifferentCulture) keywords.push(`openToDifferentCulture-${answers.openToDifferentCulture}`);
  if (answers.conflictHandling) keywords.push(`conflictHandling-${answers.conflictHandling}`);
  if (answers.loveLanguage) keywords.push(`loveLanguage-${answers.loveLanguage}`);
  if (answers.weekendPreference) keywords.push(`weekendPreference-${answers.weekendPreference}`);
  if (answers.longDistanceOpinion) keywords.push(`longDistanceOpinion-${answers.longDistanceOpinion}`);
  if (answers.relocationPlans) keywords.push(`relocationPlans-${answers.relocationPlans}`);
  if (answers.partnerType) keywords.push(`partnerType-${answers.partnerType.toLowerCase().replace(/\s+/g, '-')}`);

  return keywords;
}

export default router; 