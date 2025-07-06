"use client"

import { useEffect, useState } from "react"
import { useUser, UserButton } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Heart, Users, MessageCircle, Settings, Edit, Sparkles, ArrowRight, CheckCircle, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface ProfileData {
  firstName?: string
  lastName?: string
  email?: string
  profilePhotos?: string[]
  partnerPreferences?: any
  basicInfo?: any
  lifestyle?: any
  interests?: any
  personality?: any
  questionnaire?: any
}

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser()
  const router = useRouter()
  const [showSetupPopup, setShowSetupPopup] = useState(false)
  const [userData, setUserData] = useState<ProfileData | null>(null)
  const [isProfileComplete, setIsProfileComplete] = useState(false)

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in')
    }
  }, [isLoaded, isSignedIn, router])

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return

    // Load user data from localStorage (will be migrated to backend later)
    const userId = user.id
    const completeData = localStorage.getItem(`user_${userId}_completeProfileData`)
    const basicData = localStorage.getItem(`user_${userId}_basicSignupData`)
    const setupData = localStorage.getItem(`user_${userId}_profileSetupData`)

    let profileData: ProfileData | null = null

    try {
      if (completeData) {
        profileData = JSON.parse(completeData)
      } else if (setupData) {
        profileData = JSON.parse(setupData)
      } else if (basicData) {
        profileData = JSON.parse(basicData)
      } else {
        // Initialize with Clerk user data
        profileData = {
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.emailAddresses[0]?.emailAddress || ''
        }
      }
    } catch (error) {
      console.error("Error parsing profile data:", error)
      // Initialize with Clerk user data as fallback
      profileData = {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.emailAddresses[0]?.emailAddress || ''
      }
    }

    setUserData(profileData)

    // Check if profile is complete
    if (profileData) {
      const isComplete = checkProfileCompletion(profileData)
      setIsProfileComplete(isComplete)

      // Only show popup if profile is not complete
      const showPopup = localStorage.getItem(`user_${userId}_showProfileSetupPopup`)
      if (showPopup === "true" && !isComplete) {
        setShowSetupPopup(true)
        localStorage.removeItem(`user_${userId}_showProfileSetupPopup`)
      }
    }
  }, [isLoaded, isSignedIn, user])

  const checkProfileCompletion = (data: ProfileData): boolean => {
    // Check basic info
    const hasBasicInfo = data.firstName && data.lastName && data.email

    // Check photos (at least 1 photo)
    const hasPhotos = data.profilePhotos && data.profilePhotos.length > 0

    // Check partner preferences (should have at least some preferences set)
    const hasPartnerPreferences = data.partnerPreferences && Object.keys(data.partnerPreferences).length > 0

    // Check additional profile sections
    const hasLifestyle = data.lifestyle && Object.keys(data.lifestyle).length > 0
    const hasInterests = data.interests && Object.keys(data.interests).length > 0
    const hasPersonality = data.personality && Object.keys(data.personality).length > 0

    // Profile is complete if it has basic info, photos, and partner preferences
    // Additional sections are nice to have but not required for "complete" status
    return !!(hasBasicInfo && hasPhotos && hasPartnerPreferences)
  }

  const getProfileCompletionPercentage = (): number => {
    if (!userData) return 0

    let completedSections = 0
    const totalSections = 6

    // Basic info
    if (userData.firstName && userData.lastName && userData.email) {
      completedSections++
    }

    // Photos
    if (userData.profilePhotos && userData.profilePhotos.length > 0) {
      completedSections++
    }

    // Partner preferences
    if (userData.partnerPreferences && Object.keys(userData.partnerPreferences).length > 0) {
      completedSections++
    }

    // Lifestyle
    if (userData.lifestyle && Object.keys(userData.lifestyle).length > 0) {
      completedSections++
    }

    // Interests
    if (userData.interests && Object.keys(userData.interests).length > 0) {
      completedSections++
    }

    // Personality
    if (userData.personality && Object.keys(userData.personality).length > 0) {
      completedSections++
    }

    return Math.round((completedSections / totalSections) * 100)
  }

  const handleCompleteSetup = () => {
    setShowSetupPopup(false)
    window.location.href = "/profile/setup"
  }

  const handleSkipForNow = () => {
    setShowSetupPopup(false)
  }

  const completionPercentage = getProfileCompletionPercentage()

  // Show loading state while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render dashboard if not signed in (redirect is handled in useEffect)
  if (!isSignedIn) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-4 sm:py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8 gap-4">
          <div className="flex items-center space-x-2">
            <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-pink-500 fill-current" />
            <Link href="/" className="text-2xl sm:text-3xl font-bold text-gray-800">
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Mingle
            </span>
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <Link href="/profile">
              <Button
                variant="outline"
                className="w-full sm:w-auto border-pink-200 text-pink-600 hover:bg-pink-50 bg-transparent text-sm sm:text-base"
              >
                <Edit className="w-4 h-4 mr-2" />
                View Profile
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full sm:w-auto border-gray-200 text-gray-600 hover:bg-gray-50 bg-transparent text-sm sm:text-base"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8 sm:w-10 sm:h-10"
                }
              }}
            />
          </div>
        </div>

        {/* Welcome Message */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm mb-6 sm:mb-8">
          <CardContent className="p-6 sm:p-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
              Welcome to Mingle, {userData?.firstName || user?.firstName || "there"}! 🎉
            </h1>
            {isProfileComplete ? (
              <div>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-2">
                  Your profile is complete! Start discovering amazing matches and connecting with people.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-sm sm:text-base">
                    <Users className="w-4 h-4 mr-2" />
                    Discover Matches
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto border-pink-200 text-pink-600 hover:bg-pink-50 bg-transparent text-sm sm:text-base"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    View Messages
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-2">
                  You're now part of the Mingle community! Complete your profile to start finding amazing matches.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <Link href="/profile/setup">
                    <Button className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-sm sm:text-base">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Complete Profile Setup
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto border-pink-200 text-pink-600 hover:bg-pink-50 bg-transparent text-sm sm:text-base"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Browse Profiles
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Profile Completion Status */}
        {!isProfileComplete && (
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm mb-6 sm:mb-8">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl text-gray-800 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Profile Completion
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <span className="text-sm text-gray-600">Progress</span>
                <span className="text-sm font-medium text-gray-800">{completionPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3 sm:mb-4">
                <div
                  className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              <p className="text-xs sm:text-sm text-gray-600">
                Complete your profile to unlock all features and start finding matches!
              </p>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">0</h3>
              <p className="text-sm sm:text-base text-gray-600">Matches</p>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">0</h3>
              <p className="text-sm sm:text-base text-gray-600">Profile Views</p>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">0</h3>
              <p className="text-sm sm:text-base text-gray-600">Messages</p>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps - Only show if profile is not complete */}
        {!isProfileComplete && (
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl text-gray-800">Complete Your Journey</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border border-pink-200 rounded-lg bg-pink-50/50 gap-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 text-sm sm:text-base">Complete your detailed profile</h4>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Add photos, interests, and preferences to find better matches
                    </p>
                  </div>
                  <Link href="/profile/setup">
                    <Button className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-sm">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Continue Setup
                    </Button>
                  </Link>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg opacity-50 gap-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 text-sm sm:text-base">Start discovering matches</h4>
                    <p className="text-xs sm:text-sm text-gray-600">Browse profiles and start making connections</p>
                  </div>
                  <Button size="sm" disabled className="w-full sm:w-auto bg-gray-300 text-gray-500 text-sm">
                    Complete Profile First
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions for Complete Profiles */}
        {isProfileComplete && (
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl text-gray-800 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                Ready to Mingle!
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border border-green-200 rounded-lg bg-green-50/50 gap-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 text-sm sm:text-base">Discover Matches</h4>
                    <p className="text-xs sm:text-sm text-gray-600">Find people who match your preferences</p>
                  </div>
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-sm">
                    <Users className="w-4 h-4 mr-2" />
                    Browse
                  </Button>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border border-blue-200 rounded-lg bg-blue-50/50 gap-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 text-sm sm:text-base">Update Profile</h4>
                    <p className="text-xs sm:text-sm text-gray-600">Keep your profile fresh and up-to-date</p>
                  </div>
                  <Link href="/profile/edit">
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent text-sm"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Profile Setup Popup - Only show if profile is not complete */}
        <Dialog open={showSetupPopup} onOpenChange={setShowSetupPopup}>
          <DialogContent className="mx-4 max-w-md">
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
              </div>
              <DialogTitle className="text-center text-lg sm:text-xl font-bold">Welcome to Mingle! 🎉</DialogTitle>
              <DialogDescription className="text-center text-sm sm:text-base">
                Complete your profile setup to start finding your perfect matches. It only takes a few minutes!
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3 mt-4 sm:mt-6">
              <Button
                onClick={handleCompleteSetup}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-sm sm:text-base"
              >
                Complete Profile Setup
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                onClick={handleSkipForNow}
                className="w-full border-gray-200 text-gray-600 hover:bg-gray-50 bg-transparent text-sm sm:text-base"
              >
                Skip for now
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
