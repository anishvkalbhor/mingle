import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Profile completion calculation utilities
export interface ProfileCompletionData {
  // Basic Info
  firstName?: string;
  lastName?: string;
  email?: string;
  fullName?: string;
  dateOfBirth?: string;
  gender?: string;
  sexualOrientation?: string[];
  location?: string;
  profilePhotos?: string[];
  
  // Preferences
  showMe?: string[];
  lookingFor?: string;
  ageRange?: [number, number];
  distanceRange?: number;
  
  // Lifestyle
  jobTitle?: string;
  education?: string;
  drinking?: string;
  smoking?: string;
  religion?: string;
  zodiacSign?: string;
  politics?: string;
  
  // Other sections
  interests?: string[];
  personalityPrompts?: Array<{ prompt: string; answer: string }>;
  partnerPreferences?: Record<string, any>;
  
  // Social links
  socialLinks?: {
    instagram?: string;
    spotify?: string;
    linkedin?: string;
    introVideoUrl?: string;
    livePhotoUrl?: string;
  };
}

export interface CompletionSection {
  name: string;
  weight: number;
  isComplete: boolean;
  completionPercentage: number;
  required: boolean;
}

export function calculateProfileCompletion(data: ProfileCompletionData): {
  overallPercentage: number;
  sections: CompletionSection[];
  isProfileComplete: boolean;
} {
  const sections: CompletionSection[] = [
                // Basic Info - Required (5% weight)
            {
              name: "Basic Info",
              weight: 5,
              isComplete: !!(data.fullName && data.dateOfBirth && data.gender),
              completionPercentage: calculateBasicInfoCompletion(data),
              required: true
            },
    
    // Photos - Required (5% weight)
    {
      name: "Photos",
      weight: 5,
      isComplete: !!(data.profilePhotos && data.profilePhotos.length > 0),
      completionPercentage: data.profilePhotos && data.profilePhotos.length > 0 ? 100 : 0,
      required: true
    },
    
    // Partner Preferences - Required (45% weight)
    {
      name: "Partner Preferences",
      weight: 45,
      isComplete: !!(data.partnerPreferences && Object.keys(data.partnerPreferences).length >= 17),
      completionPercentage: calculatePartnerPreferencesCompletion(data.partnerPreferences),
      required: true
    },
    
    // Preferences - Important (5% weight)
    {
      name: "Preferences",
      weight: 5,
      isComplete: !!(data.showMe && data.showMe.length > 0 && data.lookingFor),
      completionPercentage: calculatePreferencesCompletion(data),
      required: true
    },
    
    // Lifestyle - Optional (5% weight)
    {
      name: "Lifestyle",
      weight: 5,
      isComplete: !!(data.jobTitle || data.education || data.drinking || data.smoking || data.religion),
      completionPercentage: calculateLifestyleCompletion(data),
      required: false
    },
    
    // Interests - Optional (5% weight)
    {
      name: "Interests",
      weight: 5,
      isComplete: !!(data.interests && data.interests.length > 0),
      completionPercentage: data.interests && data.interests.length > 0 ? 100 : 0,
      required: false
    },
    
    // Personality - Optional (5% weight)
    {
      name: "Personality",
      weight: 5,
      isComplete: !!(data.personalityPrompts && data.personalityPrompts.length > 0),
      completionPercentage: data.personalityPrompts && data.personalityPrompts.length > 0 ? 100 : 0,
      required: false
    },
    
    // Live Media - Required (20% weight)
    {
      name: "Live Media",
      weight: 20,
      isComplete: !!(data.socialLinks && (data.socialLinks.introVideoUrl || data.socialLinks.livePhotoUrl)),
      completionPercentage: calculateLiveMediaCompletion(data.socialLinks),
      required: true
    },
    
    // Social Links - Optional (10% weight)
    {
      name: "Social Links",
      weight: 10,
      isComplete: !!(data.socialLinks && (data.socialLinks.instagram || data.socialLinks.spotify || data.socialLinks.linkedin)),
      completionPercentage: calculateSocialLinksCompletion(data.socialLinks),
      required: false
    }
  ];

  // Calculate weighted overall percentage
  const weightedSum = sections.reduce((sum, section) => {
    return sum + (section.completionPercentage * section.weight / 100);
  }, 0);

  const overallPercentage = Math.round(weightedSum);

  // Profile is complete if all required sections are complete
  const requiredSections = sections.filter(section => section.required);
  const isProfileComplete = requiredSections.every(section => section.isComplete);

  return {
    overallPercentage,
    sections,
    isProfileComplete
  };
}

function calculateBasicInfoCompletion(data: ProfileCompletionData): number {
  const fields = [
    data.fullName,
    data.dateOfBirth,
    data.gender
  ];
  
  const completedFields = fields.filter(field => field && field !== "").length;
  return Math.round((completedFields / fields.length) * 100);
}

function calculatePartnerPreferencesCompletion(partnerPreferences?: Record<string, any>): number {
  if (!partnerPreferences) return 0;
  
  const totalQuestions = 17; // Total expected questions
  const answeredQuestions = Object.keys(partnerPreferences).filter(key => {
    const value = partnerPreferences[key];
    return value !== null && value !== undefined && value !== "" && 
           (!Array.isArray(value) || value.length > 0);
  }).length;
  
  return Math.round((answeredQuestions / totalQuestions) * 100);
}

function calculatePreferencesCompletion(data: ProfileCompletionData): number {
  const fields = [
    data.showMe && data.showMe.length > 0,
    data.lookingFor,
    data.ageRange,
    data.distanceRange
  ];
  
  const completedFields = fields.filter(Boolean).length;
  return Math.round((completedFields / fields.length) * 100);
}

function calculateLifestyleCompletion(data: ProfileCompletionData): number {
  const fields = [
    data.jobTitle,
    data.education,
    data.drinking,
    data.smoking,
    data.religion,
    data.zodiacSign,
    data.politics
  ];
  
  const completedFields = fields.filter(field => field && field !== "").length;
  return Math.round((completedFields / fields.length) * 100);
}

function calculateLiveMediaCompletion(socialLinks?: ProfileCompletionData['socialLinks']): number {
  if (!socialLinks) return 0;
  
  const fields = [
    socialLinks.introVideoUrl,
    socialLinks.livePhotoUrl
  ];
  
  const completedFields = fields.filter(field => field && field !== "").length;
  return Math.round((completedFields / fields.length) * 100);
}

function calculateSocialLinksCompletion(socialLinks?: ProfileCompletionData['socialLinks']): number {
  if (!socialLinks) return 0;
  
  const fields = [
    socialLinks.instagram,
    socialLinks.spotify,
    socialLinks.linkedin
  ];
  
  const completedFields = fields.filter(field => field && field !== "").length;
  return Math.round((completedFields / fields.length) * 100);
}

// Step-based completion calculation for profile setup
export interface ProfileSetupStep {
  id: string;
  name: string;
  weight: number;
  isComplete: boolean;
  required: boolean;
}

export function calculateProfileSetupProgress(profileData: ProfileCompletionData, currentStep: number): {
  overallPercentage: number;
  completedSteps: ProfileSetupStep[];
  currentStepData: ProfileSetupStep;
} {
  const steps: ProfileSetupStep[] = [
    {
      id: "basic-info",
      name: "Basic Info",
      weight: 5,
      isComplete: !!(profileData.fullName && profileData.dateOfBirth && profileData.gender && profileData.profilePhotos && profileData.profilePhotos.length > 0),
      required: true
    },
    {
      id: "preferences",
      name: "Preferences",
      weight: 5,
      isComplete: !!(profileData.showMe && profileData.showMe.length > 0 && profileData.lookingFor),
      required: true
    },
    {
      id: "lifestyle",
      name: "Lifestyle",
      weight: 5,
      isComplete: !!(profileData.jobTitle || profileData.education || profileData.drinking || profileData.smoking || profileData.religion),
      required: false
    },
    {
      id: "interests",
      name: "Interests",
      weight: 5,
      isComplete: !!(profileData.interests && profileData.interests.length > 0),
      required: false
    },
    {
      id: "personality",
      name: "Personality",
      weight: 5,
      isComplete: !!(profileData.personalityPrompts && profileData.personalityPrompts.length > 0),
      required: false
    },
    {
      id: "partner-preferences",
      name: "Partner Preferences",
      weight: 45,
      isComplete: !!(profileData.partnerPreferences && Object.keys(profileData.partnerPreferences).length >= 17),
      required: true
    },
    {
      id: "social-links",
      name: "Social Links",
      weight: 30, // 20% for live media + 10% for social links
      isComplete: !!(profileData.socialLinks && (profileData.socialLinks.introVideoUrl || profileData.socialLinks.livePhotoUrl)),
      required: true
    }
  ];

  // Calculate cumulative percentage based on completed steps
  // Include the current step if it's completed
  const completedSteps = steps.slice(0, currentStep + 1).filter(step => step.isComplete);
  const overallPercentage = completedSteps.reduce((sum, step) => sum + step.weight, 0);

  return {
    overallPercentage,
    completedSteps,
    currentStepData: steps[currentStep] || steps[0]
  };
}
