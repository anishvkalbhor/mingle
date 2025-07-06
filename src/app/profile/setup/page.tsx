"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Heart, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
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
  profilePhotos: File[]

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

  // Step 6: Partner Preferences
  partnerPreferences: Record<string, any>

  // Step 7: Social Links
  socialLinks: {
    instagram: string
    spotify: string
    linkedin: string
  }
}

const steps = [
  { id: "basic-info", title: "Basic Info", component: BasicInfoStep },
  { id: "preferences", title: "Preferences", component: PreferencesStep },
  { id: "lifestyle", title: "Lifestyle", component: LifestyleStep },
  { id: "interests", title: "Interests", component: InterestsStep },
  { id: "personality", title: "Personality", component: PersonalityStep },
  { id: "partner-preferences", title: "Partner Preferences", component: QuestionnaireStep },
  { id: "social-links", title: "Social Links", component: SocialLinksStep },
]

export default function ProfileSetupPage() {
  const { isLoaded, isSignedIn, user } = useUser()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
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

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in')
    }
  }, [isLoaded, isSignedIn, router])

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return

    // Load account-specific data
    const userId = user.id
    const basicData = localStorage.getItem(`user_${userId}_basicSignupData`)
    const completeData = localStorage.getItem(`user_${userId}_completeProfileData`)
    const setupData = localStorage.getItem(`user_${userId}_profileSetupData`)

    if (completeData) {
      const data = JSON.parse(completeData)
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
    } else if (basicData) {
      const data = JSON.parse(basicData)
      setProfileData((prev) => ({
        ...prev,
        fullName: `${data.firstName || ""} ${data.lastName || ""}`.trim(),
        dateOfBirth: data.dateOfBirth || "",
        gender: data.gender || "",
      }))
    } else {
      // Initialize with Clerk user data if no existing data
      setProfileData((prev) => ({
        ...prev,
        fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      }))
    }
  }, [isLoaded, isSignedIn, user])

  const updateProfileData = (stepData: Partial<ProfileData>) => {
    setProfileData((prev) => ({ ...prev, ...stepData }))

    // Auto-save to localStorage with user-specific key
    if (user) {
      const userId = user.id
      const updatedData = { ...profileData, ...stepData }
      localStorage.setItem(`user_${userId}_profileSetupData`, JSON.stringify(updatedData))
    }
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      // Final step - save and redirect
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleComplete = () => {
    if (!user) return

    // Save complete profile data with user-specific key
    const userId = user.id
    const basicData = JSON.parse(localStorage.getItem(`user_${userId}_basicSignupData`) || "{}")
    const completeProfileData = {
      ...basicData,
      ...profileData,
    }

    localStorage.setItem(`user_${userId}_completeProfileData`, JSON.stringify(completeProfileData))

    // Legacy user account status update (can be removed when migrating to backend)
    const userAccounts = JSON.parse(localStorage.getItem("userAccounts") || "{}")
    if (userAccounts[userId]) {
      userAccounts[userId].profileComplete = true
      localStorage.setItem("userAccounts", JSON.stringify(userAccounts))
    }

    // Redirect to profile page
    router.push("/profile")
  }

  const canGoNext = () => {
    const currentStepId = steps[currentStep].id

    switch (currentStepId) {
      case "basic-info":
        return (
          profileData.fullName && profileData.dateOfBirth && profileData.gender && profileData.profilePhotos.length > 0
        )
      case "preferences":
        return profileData.showMe.length > 0 && profileData.lookingFor
      case "lifestyle":
        return true // Optional step
      case "interests":
        return profileData.interests.length > 0
      case "personality":
        return profileData.personalityPrompts.length > 0
      case "partner-preferences":
        return Object.keys(profileData.partnerPreferences).length >= 17 // Total questions in partner preferences
      case "social-links":
        return true // Optional step
      default:
        return true
    }
  }

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

  // Don't render setup if not signed in (redirect is handled in useEffect)
  if (!isSignedIn) {
    return null
  }

  const progress = ((currentStep + 1) / steps.length) * 100
  const CurrentStepComponent = steps[currentStep].component

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-8 px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-8 w-8 text-pink-500 fill-current" />
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Mingle
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Complete Your Profile</h1>
          <p className="text-gray-600">
            Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2 mb-4" />
            <div className="flex justify-between">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex items-center space-x-2 ${index <= currentStep ? "text-pink-600" : "text-gray-400"}`}
                >
                  {index < currentStep ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        index === currentStep
                          ? "border-pink-500 bg-pink-500"
                          : index < currentStep
                            ? "border-pink-500 bg-pink-500"
                            : "border-gray-300"
                      }`}
                    />
                  )}
                  <span className="text-xs font-medium hidden md:block">{step.title}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm mb-8">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-800">{steps[currentStep].title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CurrentStepComponent data={profileData} onUpdate={updateProfileData} />
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 bg-transparent border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>

          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep ? "bg-pink-500" : index < currentStep ? "bg-pink-300" : "bg-gray-200"
                }`}
              />
            ))}
          </div>

          <Button
            onClick={handleNext}
            disabled={!canGoNext()}
            className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
          >
            <span>{currentStep === steps.length - 1 ? "Complete Profile" : "Next"}</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
