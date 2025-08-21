export interface ProfileData {
  firstName?: string
  lastName?: string
  email?: string
  profilePhotos?: string[]
  partnerPreferences?: Record<string, unknown>
  basicInfo?: Record<string, unknown>
  lifestyle?: Record<string, unknown>
  interests?: string[]
  personality?: Record<string, unknown>
  questionnaire?: Record<string, unknown>
  bio?: string
  socialLinks?: Record<string, unknown>
  occupation?: string
  occupationDetails?: Record<string, unknown>
  phoneNumber?: string
  dateOfBirth?: string
  profilePhoto?: string
  state?: string
  profileComplete?: boolean
  isAdmin?: boolean
}

export interface Match {
  clerkId: string
  profilePhotos?: string[]
  profilePhoto?: string
  fullName?: string
  username?: string
  compatibilityScore?: number
  age?: number
  bio?: string
  interests?: string[]
}

export interface Notification {
  type: string
  message: string
  createdAt: string
  read?: boolean
}

export interface DashboardStats {
  totalMatches?: number
  totalMessages?: number
  totalSuggestions?: number
  [key: string]: unknown
}
