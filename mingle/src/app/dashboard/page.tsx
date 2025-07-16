"use client"

import { useEffect, useState } from "react"
import { useUser, UserButton, useAuth } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Heart, Users, MessageCircle, Settings, Edit, Sparkles, ArrowRight, CheckCircle, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useRef } from "react";

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
  bio?: string
  socialLinks?: any
  occupation?: string
  occupationDetails?: any
  phoneNumber?: string
  dateOfBirth?: string
  profilePhoto?: string
  state?: string
  profileComplete?: boolean
}

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser()
  const { getToken } = useAuth();
  const router = useRouter()
  const [showSetupPopup, setShowSetupPopup] = useState(false)
  const [userData, setUserData] = useState<ProfileData | null>(null)
  const [isProfileComplete, setIsProfileComplete] = useState(false)
  const [mutualMatches, setMutualMatches] = useState<any[]>([])
  const [matchesLoading, setMatchesLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [likedSuggestions, setLikedSuggestions] = useState<{ [clerkId: string]: boolean }>({});
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportIssueType, setSupportIssueType] = useState("");
  const [supportMessage, setSupportMessage] = useState("");
  const [supportLoading, setSupportLoading] = useState(false);
  const [supportFeedback, setSupportFeedback] = useState<string|null>(null);
  const supportTypes = [
    { value: "Bug", label: "🐞 Bug" },
    { value: "Feedback", label: "💬 Feedback" },
    { value: "Account", label: "🔒 Account" },
  ];
  const supportDropdownRef = useRef<HTMLDivElement>(null);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        supportDropdownRef.current &&
        event.target instanceof Node &&
        !supportDropdownRef.current.contains(event.target)
      ) {
        setShowSettingsDropdown(false);
      }
    }
    if (showSettingsDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSettingsDropdown]);

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in')
    }
  }, [isLoaded, isSignedIn, router])

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return

    // Fetch user data from backend with Clerk token
    const fetchUserData = async () => {
      try {
        const token = await getToken();
        const res = await fetch('http://localhost:5000/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!res.ok) throw new Error('Failed to fetch user data')
        const result = await res.json()
        if (result.status === 'success' && result.data) {
          setUserData(result.data)
          setIsProfileComplete(result.data.profileComplete)
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }
    fetchUserData()
  }, [isLoaded, isSignedIn, user, getToken])

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;
    // Fetch mutual matches from backend
    const fetchMutualMatches = async () => {
      setMatchesLoading(true);
      try {
        const token = await getToken();
        const res = await fetch('http://localhost:5000/api/matches/mutual', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.mutualMatches) setMutualMatches(data.mutualMatches);
      } catch (err) {
        setMutualMatches([]);
      } finally {
        setMatchesLoading(false);
      }
    };
    fetchMutualMatches();
  }, [isLoaded, isSignedIn, user, getToken]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;
    // Fetch match suggestions from backend
    const fetchSuggestions = async () => {
      setSuggestionsLoading(true);
      try {
        const token = await getToken();
        const res = await fetch('http://localhost:5000/api/matches/suggestions', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.suggestions) setSuggestions(data.suggestions);
      } catch (err) {
        setSuggestions([]);
      } finally {
        setSuggestionsLoading(false);
      }
    };
    fetchSuggestions();
  }, [isLoaded, isSignedIn, user, getToken]);

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

  const handleBrowseClick = () => {
    setShowSuggestions(true);
  };
  const handleCloseSuggestions = () => setShowSuggestions(false);

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
            <div className="relative">
              <Button
                variant="outline"
                className="w-full sm:w-auto border-gray-200 text-gray-600 hover:bg-gray-50 bg-transparent text-sm sm:text-base"
                onClick={() => setShowSettingsDropdown((v) => !v)}
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              {showSettingsDropdown && (
                <div
                  ref={supportDropdownRef}
                  className="absolute right-0 mt-2 w-48 bg-white border rounded shadow z-50"
                >
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                    onClick={() => {
                      setShowSupportModal(true);
                      setShowSettingsDropdown(false);
                    }}
                  >
                    🛠️ Support Ticket
                  </button>
                </div>
              )}
            </div>
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
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                {suggestions.length}
              </h3>
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
                  <Button
                    className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-sm"
                    onClick={handleBrowseClick}
                  >
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

        {/* Add this section where you want to show matches, e.g. after profile completion cards */}
        {isProfileComplete && (
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm mb-8">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl text-gray-800 flex items-center">
                <Users className="w-5 h-5 mr-2 text-pink-500" />
                Your Matches
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {matchesLoading ? (
                <div className="text-center text-gray-500 py-6">Loading matches...</div>
              ) : mutualMatches.length === 0 ? (
                <div className="text-center text-gray-500 py-6">No matches yet. Start liking profiles to find matches!</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {mutualMatches.map(match => (
                    <Link key={match.clerkId} href={`/profile-reveal/${match.clerkId}`} className="hover:shadow-xl transition-shadow">
                      <div className="bg-white rounded-2xl shadow-lg p-5 flex flex-col items-center transition-transform hover:scale-105 cursor-pointer border border-pink-100" style={{ minHeight: 320 }}>
                        <div className="relative mb-3 w-full h-48 rounded-t-2xl overflow-hidden flex items-center justify-center">
                          <img
                            src={(match.profilePhotos && match.profilePhotos.length > 0) ? match.profilePhotos[0] : (match.profilePhoto || '/default-avatar.png')}
                            alt={match.fullName || match.username}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-3 right-4 bg-pink-500 text-white text-xs px-3 py-1 rounded-full shadow">
                            {match.compatibilityScore}% Match
                          </span>
                        </div>
                        <div className="text-xl font-bold text-gray-800 mb-1 text-center">{match.fullName || match.username}</div>
                        {match.age && <div className="text-gray-500 text-sm mb-4">{match.age} years old</div>}
                        <button className="mt-auto bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-6 rounded-full shadow transition">
                          View Profile
                        </button>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Add a modal or section to show suggestions when showSuggestions is true */}
        {showSuggestions && (
          <Dialog open={showSuggestions} onOpenChange={setShowSuggestions}>
            <DialogContent className="max-w-4xl bg-pink-50">
              <DialogHeader>
                <DialogTitle className="text-center text-2xl font-bold text-pink-600">Match Suggestions</DialogTitle>
                <DialogDescription className="text-center text-base text-gray-600 mb-4">
                  People who match your partner preferences
                </DialogDescription>
              </DialogHeader>
              {suggestionsLoading ? (
                <div className="text-center text-gray-500 py-6">Loading suggestions...</div>
              ) : suggestions.length === 0 ? (
                <div className="text-center text-gray-500 py-6">No suggestions found. Try updating your preferences!</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {suggestions.map((s, idx) => (
                    <Card key={s.clerkId} className="bg-white rounded-2xl shadow-lg p-0 border-0 flex flex-col justify-between min-h-[320px]">
                      <CardContent className="p-0">
                        <div className="relative w-full h-48 flex items-center justify-center overflow-hidden rounded-t-2xl">
                          <img
                            src={(s.profilePhotos && s.profilePhotos.length > 0) ? s.profilePhotos[0] : (s.profilePhoto || '/default-avatar.png')}
                            alt={s.fullName || s.username}
                            className={`w-full h-full object-cover ${s.blurred ? 'blur-md grayscale' : ''}`}
                          />
                          <span className="absolute top-3 right-4 text-pink-500 font-semibold text-sm bg-white/80 px-3 py-1 rounded-full shadow">{s.compatibilityScore}% Match</span>
                        </div>
                        <div className="px-6 py-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-lg text-gray-800">{s.fullName || s.username}{s.age ? `, ${s.age}` : ''}</span>
                          </div>
                          <div className="text-sm text-gray-600 mb-2 truncate">{s.bio || 'No bio yet.'}</div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex gap-2 pb-4 pt-0 justify-center bg-white rounded-b-2xl">
                        {likedSuggestions[s.clerkId] ? (
                          <button
                            className="flex-1 bg-pink-400 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 cursor-not-allowed opacity-80"
                            disabled
                          >
                            <CheckCircle className="w-5 h-5 mr-1" /> Liked
                          </button>
                        ) : (
                          <button
                            className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2 shadow"
                            onClick={async () => {
                              const token = await getToken();
                              const res = await fetch('http://localhost:5000/api/matches/interact', {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                  Authorization: `Bearer ${token}`,
                                },
                                body: JSON.stringify({ toUserId: s.clerkId, action: 'like' }),
                              });
                              const data = await res.json();
                              setLikedSuggestions(prev => ({ ...prev, [s.clerkId]: true }));
                              if (data.isMutual) {
                                router.push(`/profile-reveal/${s.clerkId}`);
                              }
                            }}
                          >
                            <Heart className="w-5 h-5 mr-1" /> Like
                          </button>
                        )}
                        <button
                          className="flex-1 border border-pink-400 text-pink-500 font-semibold py-2 rounded-lg transition-colors hover:bg-pink-50 flex items-center justify-center gap-2"
                          onClick={async () => {
                            const token = await getToken();
                            await fetch('http://localhost:5000/api/matches/interact', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`,
                              },
                              body: JSON.stringify({ toUserId: s.clerkId, action: 'pass' }),
                            });
                            // Optionally, you can disable the Pass button or mark as passed
                          }}
                        >
                          Pass
                        </button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
              <div className="flex justify-end mt-4">
                <Button variant="outline" onClick={handleCloseSuggestions}>Close</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Support Ticket Modal */}
        {showSupportModal && (
          <Dialog open={showSupportModal} onOpenChange={setShowSupportModal}>
            <DialogContent className="max-w-md mx-auto p-0 bg-transparent shadow-none flex items-center justify-center">
              <div className="w-full bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
                <div className="flex flex-col items-center w-full">
                  <span className="text-3xl mb-2">🛠️</span>
                  <DialogTitle className="text-center text-2xl font-bold mb-1">Support Ticket Form</DialogTitle>
                  <DialogDescription className="text-center text-base text-gray-500 mb-6">Select issue type and describe your issue.</DialogDescription>
                </div>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setSupportLoading(true);
                    setSupportFeedback(null);
                    try {
                      const token = await getToken();
                      const res = await fetch("http://localhost:5000/api/support-ticket", {
                        method: "POST",
                        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                        body: JSON.stringify({ issueType: supportIssueType, description: supportMessage }),
                      });
                      if (res.ok) {
                        setSupportFeedback("Support ticket submitted successfully!");
                        setSupportIssueType("");
                        setSupportMessage("");
                        setTimeout(() => setShowSupportModal(false), 1500);
                      } else {
                        const data = await res.json();
                        setSupportFeedback(data.message || "Failed to submit ticket.");
                      }
                    } catch (err) {
                      setSupportFeedback("Failed to submit ticket.");
                    } finally {
                      setSupportLoading(false);
                    }
                  }}
                  className="flex flex-col gap-6 w-full"
                >
                  <div className="w-full">
                    <label className="block text-base font-medium mb-2 text-gray-700">Select Issue Type</label>
                    <select
                      className="w-full border-2 border-gray-200 focus:border-purple-500 rounded-lg px-4 py-2 text-base outline-none transition-colors"
                      value={supportIssueType}
                      onChange={e => setSupportIssueType(e.target.value)}
                      required
                    >
                      <option value="">-- Choose an issue --</option>
                      {supportTypes.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-full">
                    <label className="block text-base font-medium mb-2 text-gray-700">Message</label>
                    <textarea
                      className="w-full border-2 border-gray-200 focus:border-purple-500 rounded-lg px-4 py-2 text-base outline-none transition-colors resize-none"
                      rows={4}
                      placeholder="Describe the issue in detail..."
                      value={supportMessage}
                      onChange={e => setSupportMessage(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-lg text-lg font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all shadow-md mt-2"
                    disabled={supportLoading}
                  >
                    {supportLoading ? "Submitting..." : "Submit"}
                  </button>
                  {supportFeedback && <div className="text-center text-base mt-2 text-purple-600">{supportFeedback}</div>}
                </form>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
