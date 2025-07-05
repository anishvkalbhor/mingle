
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Heart, ArrowLeft, User, Users, Save, X, Target, Sparkles, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import BasicInfoStep from "@/components/profile-setup/basic-info-step"
import PreferencesStep from "@/components/profile-setup/preferences-step"
import LifestyleStep from "@/components/profile-setup/lifestyle-step"
import InterestsStep from "@/components/profile-setup/interests-step"
import PersonalityStep from "@/components/profile-setup/personality-step"
import QuestionnaireStep from "@/components/profile-setup/questionnaire-step"
import SocialLinksStep from "@/components/profile-setup/social-links-step"

interface ProfileData {
  // Step 1: Basic Info
  fullName: string
  dateOfBirth: string
  gender: string
  sexualOrientation: string[]
  location: string
  profilePhotos: string[] // Changed to string array for base64 images

  // Step 2: Preferences & Intentions
  showMe: string[]
  lookingFor: string
  ageRange: [number, number]
  distanceRange: number

  // Step 3: Lifestyle & Background
  jobTitle: string
  education: string
  drinking: string
  smoking: string
  religion: string
  zodiacSign: string
  politics: string

  // Step 4: Interests
  interests: string[]

  // Step 5: Personality Prompts
  personalityPrompts: Array<{
    prompt: string
    answer: string
  }>

  // Step 6: Partner Preferences (20 questions)
  partnerPreferences: Record<string, any>

  // Step 7: Social Links
  socialLinks: {
    instagram: string
    spotify: string
    linkedin: string
  }
}

// Safe storage utility
const safeSetItem = (key: string, value: string): boolean => {
  try {
    localStorage.setItem(key, value)
    return true
  } catch (error) {
    if (error instanceof DOMException && error.name === "QuotaExceededError") {
      // Try to free up space by removing old data
      const keysToRemove = []
      for (let i = 0; i < localStorage.length; i++) {
        const storageKey = localStorage.key(i)
        if (
          storageKey &&
          (storageKey.includes("_editProfileData") ||
            storageKey.includes("_tempData") ||
            storageKey.includes("_oldProfileData"))
        ) {
          keysToRemove.push(storageKey)
        }
      }

      // Remove old temporary data
      keysToRemove.forEach((key) => {
        try {
          localStorage.removeItem(key)
        } catch (e) {
          console.warn("Failed to remove old data:", e)
        }
      })

      // Try again
      try {
        localStorage.setItem(key, value)
        return true
      } catch (retryError) {
        console.error("Storage quota exceeded even after cleanup:", retryError)
        return false
      }
    }
    console.error("Failed to save to localStorage:", error)
    return false
  }
}

export default function EditProfilePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("basic-info")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [storageError, setStorageError] = useState<string | null>(null)
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    sexualOrientation: [],
    location: "",
    profilePhotos: [],
    showMe: [],
    lookingFor: "",
    ageRange: [18, 35],
    distanceRange: 25,
    jobTitle: "",
    education: "",
    drinking: "",
    smoking: "",
    religion: "",
    zodiacSign: "",
    politics: "",
    interests: [],
    personalityPrompts: [],
    partnerPreferences: {},
    socialLinks: {
      instagram: "",
      spotify: "",
      linkedin: "",
    },
  })

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("currentUser")
    const isLoggedIn = localStorage.getItem("isLoggedIn")

    if (!user || !isLoggedIn) {
      router.push("/login")
      return
    }

    setCurrentUser(user)

    // Load account-specific existing profile data
    const accountKey = `account_${user}`
    const completeData = localStorage.getItem(`${accountKey}_completeProfileData`)
    const setupData = localStorage.getItem(`${accountKey}_profileSetupData`)
    const basicData = localStorage.getItem(`${accountKey}_basicSignupData`)

    let data = null

    try {
      if (completeData) {
        data = JSON.parse(completeData)
      } else if (setupData) {
        data = JSON.parse(setupData)
      } else if (basicData) {
        data = JSON.parse(basicData)
      }
    } catch (error) {
      console.error("Error parsing profile data:", error)
    }

    if (data) {
      setProfileData({
        fullName: data.fullName || `${data.firstName || ""} ${data.lastName || ""}`.trim(),
        dateOfBirth: data.dateOfBirth || "",
        gender: data.gender || "",
        sexualOrientation: data.sexualOrientation || [],
        location: data.location || "",
        profilePhotos: data.profilePhotos || [],
        showMe: data.showMe || [],
        lookingFor: data.lookingFor || "",
        ageRange: data.ageRange || [18, 35],
        distanceRange: data.distanceRange || 25,
        jobTitle: data.jobTitle || "",
        education: data.education || "",
        drinking: data.drinking || "",
        smoking: data.smoking || "",
        religion: data.religion || "",
        zodiacSign: data.zodiacSign || "",
        politics: data.politics || "",
        interests: data.interests || [],
        personalityPrompts: data.personalityPrompts || [],
        partnerPreferences: data.partnerPreferences || {},
        socialLinks: {
          instagram: data.socialLinks?.instagram || "",
          spotify: data.socialLinks?.spotify || "",
          linkedin: data.socialLinks?.linkedin || "",
        },
      })
    }
  }, [router])

  const handleSaveAndExit = () => {
    if (!currentUser) return

    // Save all changes with account-specific key and redirect to profile
    const accountKey = `account_${currentUser}`
    const basicData = JSON.parse(localStorage.getItem(`${accountKey}_basicSignupData`) || "{}")
    const completeProfileData = {
      ...basicData,
      ...profileData,
    }

    const success = safeSetItem(`${accountKey}_completeProfileData`, JSON.stringify(completeProfileData))

    if (success) {
      setHasUnsavedChanges(false)
      setStorageError(null)
      router.push("/profile")
    } else {
      setStorageError("Unable to save profile data. Storage is full. Please remove some photos and try again.")
    }
  }

  const handleDiscardChanges = () => {
    if (hasUnsavedChanges) {
      const confirmDiscard = window.confirm("You have unsaved changes. Are you sure you want to discard them?")
      if (confirmDiscard) {
        router.push("/profile")
      }
    } else {
      router.push("/profile")
    }
  }

  const updateProfileData = (stepData: Partial<ProfileData>) => {
    setProfileData((prev) => ({ ...prev, ...stepData }))
    setHasUnsavedChanges(true)
    setStorageError(null) // Clear any previous storage errors

    // Auto-save to localStorage with account-specific key
    if (currentUser) {
      const accountKey = `account_${currentUser}`
      const updatedData = { ...profileData, ...stepData }

      // Try to save, but don't show error for auto-save failures
      const success = safeSetItem(`${accountKey}_editProfileData`, JSON.stringify(updatedData))

      if (!success) {
        // Only show error if it's a significant change (like adding photos)
        if (stepData.profilePhotos) {
          setStorageError("Storage is getting full. Consider removing some photos or saving your changes.")
        }
      }
    }
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Heart className="h-12 w-12 text-pink-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-4 sm:py-6 px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Storage Error Alert */}
        {storageError && (
          <Alert className="border-red-200 bg-red-50 mb-4 sm:mb-6">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 text-sm">{storageError}</AlertDescription>
          </Alert>
        )}

        {/* Header - Responsive layout */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={handleDiscardChanges}
              className="border-gray-200 text-gray-600 hover:bg-gray-50 bg-transparent text-sm sm:text-base px-3 sm:px-4"
            >
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Back to </span>Profile
            </Button>
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-pink-500 fill-current" />
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Mingle
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto justify-end">
            {hasUnsavedChanges && (
              <Badge variant="outline" className="border-orange-200 text-orange-600 text-xs sm:text-sm">
                Unsaved Changes
              </Badge>
            )}
            <Button
              onClick={handleSaveAndExit}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-sm sm:text-base px-3 sm:px-4"
            >
              <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Save & Exit
            </Button>
          </div>
        </div>

        {/* Edit Profile Header */}
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm mb-6 sm:mb-8">
          <CardHeader className="text-center p-4 sm:p-6">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Edit Your Profile</CardTitle>
            <p className="text-gray-600 text-sm sm:text-base">Update your information to help us find better matches for you</p>
          </CardHeader>
        </Card>

        {/* Tabbed Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 sm:space-y-8">
          <div className="flex justify-center overflow-x-auto">
            <TabsList className="grid w-full max-w-4xl grid-cols-7 bg-white/80 backdrop-blur-sm min-w-max sm:min-w-0">
              <TabsTrigger value="basic-info" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-1 text-xs px-2 sm:px-3 py-2">
                <User className="w-3 h-3" />
                <span className="hidden sm:inline">Basic</span>
                <span className="sm:hidden">Info</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-1 text-xs px-2 sm:px-3 py-2">
                <Heart className="w-3 h-3" />
                <span className="hidden sm:inline">Preferences</span>
                <span className="sm:hidden">Pref</span>
              </TabsTrigger>
              <TabsTrigger value="lifestyle" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-1 text-xs px-2 sm:px-3 py-2">
                <Sparkles className="w-3 h-3" />
                <span className="hidden sm:inline">Lifestyle</span>
                <span className="sm:hidden">Life</span>
              </TabsTrigger>
              <TabsTrigger value="interests" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-1 text-xs px-2 sm:px-3 py-2">
                <Target className="w-3 h-3" />
                <span className="hidden sm:inline">Interests</span>
                <span className="sm:hidden">Int</span>
              </TabsTrigger>
              <TabsTrigger value="personality" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-1 text-xs px-2 sm:px-3 py-2">
                <Heart className="w-3 h-3" />
                <span className="hidden sm:inline">Personality</span>
                <span className="sm:hidden">Pers</span>
              </TabsTrigger>
              <TabsTrigger value="partner-preferences" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-1 text-xs px-2 sm:px-3 py-2">
                <Users className="w-3 h-3" />
                <span className="hidden sm:inline">Partner</span>
                <span className="sm:hidden">Part</span>
              </TabsTrigger>
              <TabsTrigger value="social" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-1 text-xs px-2 sm:px-3 py-2">
                <Sparkles className="w-3 h-3" />
                <span className="hidden sm:inline">Social</span>
                <span className="sm:hidden">Soc</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Basic Information Tab */}
          <TabsContent value="basic-info">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center text-gray-800 text-lg sm:text-xl">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-pink-500" />
                  Basic Information
                </CardTitle>
                <p className="text-gray-600 text-sm sm:text-base">Update your personal details and contact information</p>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <BasicInfoStep data={profileData} onUpdate={updateProfileData} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center text-gray-800 text-lg sm:text-xl">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-pink-500" />
                  Dating Preferences
                </CardTitle>
                <p className="text-gray-600 text-sm sm:text-base">Update what you're looking for in a partner</p>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <PreferencesStep data={profileData} onUpdate={updateProfileData} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Lifestyle Tab */}
          <TabsContent value="lifestyle">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center text-gray-800 text-lg sm:text-xl">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-pink-500" />
                  Lifestyle & Background
                </CardTitle>
                <p className="text-gray-600 text-sm sm:text-base">Update your lifestyle and background information</p>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <LifestyleStep data={profileData} onUpdate={updateProfileData} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Interests Tab */}
          <TabsContent value="interests">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center text-gray-800 text-lg sm:text-xl">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-pink-500" />
                  Interests & Hobbies
                </CardTitle>
                <p className="text-gray-600 text-sm sm:text-base">Update your interests and hobbies</p>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <InterestsStep data={profileData} onUpdate={updateProfileData} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Personality Tab */}
          <TabsContent value="personality">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center text-gray-800 text-lg sm:text-xl">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-pink-500" />
                  Personality Prompts
                </CardTitle>
                <p className="text-gray-600 text-sm sm:text-base">Update your personality prompts and answers</p>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <PersonalityStep data={profileData} onUpdate={updateProfileData} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Partner Preferences Tab */}
          <TabsContent value="partner-preferences">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center text-gray-800 text-lg sm:text-xl">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-pink-500" />
                  Partner Preferences
                </CardTitle>
                <p className="text-gray-600 text-sm sm:text-base">Update your ideal partner preferences</p>
              </CardHeader>
              <CardContent className="p-0">
                <QuestionnaireStep data={profileData} onUpdate={updateProfileData} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Links Tab */}
          <TabsContent value="social">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center text-gray-800 text-lg sm:text-xl">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-pink-500" />
                  Social Links
                </CardTitle>
                <p className="text-gray-600 text-sm sm:text-base">Update your social media connections</p>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <SocialLinksStep data={profileData} onUpdate={updateProfileData} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Reminder - Responsive positioning */}
        {hasUnsavedChanges && (
          <div className="fixed bottom-4 left-4 right-4 sm:bottom-6 sm:left-auto sm:right-6 sm:w-auto z-50">
            <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-700">You have unsaved changes</span>
                  </div>
                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleDiscardChanges}
                      className="border-gray-200 text-gray-600 hover:bg-gray-50 bg-transparent flex-1 sm:flex-none"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Discard
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveAndExit}
                      className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 flex-1 sm:flex-none"
                    >
                      <Save className="w-3 h-3 mr-1" />
                      Save
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
