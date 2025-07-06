"use client";

import { useState, useEffect } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapModal } from "@/components/MapModal";
import {
  Heart,
  Edit,
  MapPin,
  Calendar,
  Settings,
  Camera,
  User,
  Sparkles,
  ArrowRight,
  Target,
  Users,
  Briefcase,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ProfileData {
  // Basic signup data
  firstName?: string;
  lastName?: string;
  email?: string;

  // Complete profile data
  fullName?: string;
  dateOfBirth?: string;
  gender?: string;
  sexualOrientation?: string[];
  location?: string;
  profilePhotos?: string[]; // Changed to string array for base64 images
  showMe?: string[];
  lookingFor?: string;
  ageRange?: [number, number];
  distanceRange?: number;
  jobTitle?: string;
  education?: string;
  drinking?: string;
  smoking?: string;
  religion?: string;
  zodiacSign?: string;
  politics?: string;
  interests?: string[];
  personalityPrompts?: Array<{
    prompt: string;
    answer: string;
  }>;
  partnerPreferences?: Record<string, any>;
  socialLinks?: {
    instagram?: string;
    spotify?: string;
    linkedin?: string;
  };
}

export default function ProfilePage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isCompleteProfile, setIsCompleteProfile] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    // Load account-specific profile data
    const userId = user.id;
    const completeData = localStorage.getItem(
      `user_${userId}_completeProfileData`
    );
    const basicData = localStorage.getItem(`user_${userId}_basicSignupData`);
    const setupData = localStorage.getItem(`user_${userId}_profileSetupData`);

    let data = null;

    try {
      if (completeData) {
        data = JSON.parse(completeData);
      } else if (setupData) {
        data = JSON.parse(setupData);
      } else if (basicData) {
        data = JSON.parse(basicData);
      } else {
        // Initialize with Clerk user data
        data = {
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.emailAddresses[0]?.emailAddress || "",
          fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        };
      }
    } catch (error) {
      console.error("Error parsing profile data:", error);
      // Initialize with Clerk user data as fallback
      data = {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.emailAddresses[0]?.emailAddress || "",
        fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      };
    }

    if (data) {
      setProfileData(data);

      // Check if partner preferences are complete (17 questions)
      const partnerPreferencesComplete =
        data.partnerPreferences &&
        Object.keys(data.partnerPreferences).length >= 17;
      setIsCompleteProfile(partnerPreferencesComplete);
    }
  }, [isLoaded, isSignedIn, user]);

  // Show loading state while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render profile if not signed in (redirect is handled in useEffect)
  if (!isSignedIn) {
    return null;
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-12 w-12 text-pink-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const getFullName = () => {
    if (profileData.fullName) return profileData.fullName;
    return `${profileData.firstName || ""} ${
      profileData.lastName || ""
    }`.trim();
  };

  const getAge = () => {
    if (!profileData.dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(profileData.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const getCompletionPercentage = () => {
    let completed = 0;
    const total = 7; // Total sections

    // Basic info
    if (profileData.fullName && profileData.dateOfBirth && profileData.gender)
      completed++;
    // Preferences
    if (profileData.showMe && profileData.lookingFor) completed++;
    // Lifestyle
    if (profileData.jobTitle || profileData.education) completed++;
    // Interests
    if (profileData.interests && profileData.interests.length > 0) completed++;
    // Personality
    if (
      profileData.personalityPrompts &&
      profileData.personalityPrompts.length > 0
    )
      completed++;
    // Partner Preferences (mandatory)
    if (
      profileData.partnerPreferences &&
      Object.keys(profileData.partnerPreferences).length >= 17
    )
      completed++;
    // Social links
    if (
      profileData.socialLinks &&
      (profileData.socialLinks.instagram || profileData.socialLinks.spotify)
    )
      completed++;

    return Math.round((completed / total) * 100);
  };

  const completionPercentage = getCompletionPercentage();

  const renderPartnerPreferences = () => {
    if (!profileData.partnerPreferences) return null;

    const prefs = profileData.partnerPreferences;

    return (
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm mb-8">
        <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50">
          <CardTitle className="flex items-center text-gray-800">
            <Users className="w-5 h-5 mr-2 text-pink-500" />
            Partner Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Age and Distance */}
          {(prefs["age-range"] || prefs["distance-range"]) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prefs["age-range"] && (
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Preferred Age Range
                  </p>
                  <p className="text-gray-800">
                    {Array.isArray(prefs["age-range"])
                      ? `${prefs["age-range"][0]} - ${prefs["age-range"][1]} years`
                      : `${prefs["age-range"]} years`}
                  </p>
                </div>
              )}
              {prefs["distance-range"] && (
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Maximum Distance
                  </p>
                  <p className="text-gray-800">
                    {Array.isArray(prefs["distance-range"])
                      ? `${prefs["distance-range"][0]} km`
                      : `${prefs["distance-range"]} km`}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Relationship Type */}
          {prefs["relationship-type"] && (
            <div>
              <p className="text-sm text-gray-500 font-medium">Seeking</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {Array.isArray(prefs["relationship-type"]) ? (
                  prefs["relationship-type"].map((type: string) => (
                    <Badge key={type} className="bg-purple-100 text-purple-700">
                      {type}
                    </Badge>
                  ))
                ) : (
                  <Badge className="bg-purple-100 text-purple-700">
                    {prefs["relationship-type"]}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Education Level */}
          {prefs["education-level"] && (
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Education Preference
              </p>
              <p className="text-gray-800">{prefs["education-level"]}</p>
            </div>
          )}

          {/* Lifestyle Preferences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prefs["fitness-lifestyle"] && (
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Fitness Level
                </p>
                <p className="text-gray-800 capitalize">
                  {prefs["fitness-lifestyle"].replace("-", " ")}
                </p>
              </div>
            )}
            {prefs["social-lifestyle"] && (
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Social Style
                </p>
                <p className="text-gray-800 capitalize">
                  {prefs["social-lifestyle"].replace("-", " ")}
                </p>
              </div>
            )}
          </div>

          {/* Habits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prefs["drinking-habits"] && (
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Drinking Preference
                </p>
                <p className="text-gray-800">{prefs["drinking-habits"]}</p>
              </div>
            )}
            {prefs["smoking-habits"] && (
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Smoking Preference
                </p>
                <p className="text-gray-800">{prefs["smoking-habits"]}</p>
              </div>
            )}
          </div>

          {/* Communication Style */}
          {prefs["communication-style"] && (
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Communication Style
              </p>
              <p className="text-gray-800 capitalize">
                {prefs["communication-style"].replace("-", " ")}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-8 px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/dashboard"
            className="text-gray-600 hover:text-pink-500 transition-colors"
          >
            ← Back to Dashboard
          </Link>
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-pink-500 fill-current" />
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Mingle
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              className="border-pink-200 text-pink-600 hover:bg-pink-50 bg-transparent"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            />
          </div>
        </div>

        {/* Profile Incomplete Warning */}
        {!isCompleteProfile && (
          <Card className="shadow-xl border-0 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-amber-800">
                      Complete Partner Preferences
                    </h3>
                    <p className="text-amber-700">
                      You must complete all partner preference questions to see
                      partner profiles!
                    </p>
                  </div>
                </div>
                <Link href="/profile/setup">
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                    <Target className="w-4 h-4 mr-2" />
                    Complete Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Profile Header Card */}
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              {/* Profile Picture */}
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-pink-200">
                  <AvatarImage
                    src={
                      profileData.profilePhotos?.[0] ||
                      "/placeholder.svg?height=128&width=128"
                    }
                    alt={getFullName()}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                    {getFullName()
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>

              {/* Basic Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {getFullName()}
                </h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-600 mb-4">
                  {getAge() && (
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{getAge()} years old</span>
                    </div>
                  )}
                  {profileData.location && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{profileData.location}</span>
                    </div>
                  )}
                  {profileData.gender && (
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      <span className="capitalize">{profileData.gender}</span>
                    </div>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                  {profileData.lookingFor && (
                    <Badge className="bg-pink-100 text-pink-700 hover:bg-pink-200">
                      Looking for {profileData.lookingFor}
                    </Badge>
                  )}
                  {profileData.interests &&
                    profileData.interests.length > 0 && (
                      <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                        {profileData.interests.length} interests
                      </Badge>
                    )}
                  {isCompleteProfile && (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
                      ✓ Ready to Match
                    </Badge>
                  )}
                </div>

                <Link href="/profile/edit">
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 mr-5">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </Link>

                <Button
                  onClick={() => setIsMapOpen(true)}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  View on Map
                </Button>

                <MapModal
                  isOpen={isMapOpen}
                  onClose={() => setIsMapOpen(false)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Photos Gallery */}
        {profileData.profilePhotos && profileData.profilePhotos.length > 1 && (
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm mb-8">
            <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50">
              <CardTitle className="flex items-center text-gray-800">
                <Camera className="w-5 h-5 mr-2 text-pink-500" />
                Photo Gallery
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {profileData.profilePhotos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={photo || "/placeholder.svg"}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    {index === 0 && (
                      <Badge className="absolute top-2 left-2 bg-pink-500 text-white text-xs">
                        Main
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Basic Information */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm mb-8">
          <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50">
            <CardTitle className="flex items-center text-gray-800">
              <User className="w-5 h-5 mr-2 text-pink-500" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 font-medium">Full Name</p>
                <p className="text-gray-800">{getFullName()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Email</p>
                <p className="text-gray-800">
                  {profileData.email || user?.emailAddresses[0]?.emailAddress}
                </p>
              </div>
            </div>

            {profileData.gender && (
              <div>
                <p className="text-sm text-gray-500 font-medium">Gender</p>
                <p className="text-gray-800 capitalize">{profileData.gender}</p>
              </div>
            )}

            {profileData.sexualOrientation &&
              profileData.sexualOrientation.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Sexual Orientation
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {profileData.sexualOrientation.map((orientation) => (
                      <Badge
                        key={orientation}
                        variant="outline"
                        className="border-pink-200 text-pink-700"
                      >
                        {orientation}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
          </CardContent>
        </Card>

        {/* Professional Information */}
        {(profileData.jobTitle || profileData.education) && (
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm mb-8">
            <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50">
              <CardTitle className="flex items-center text-gray-800">
                <Briefcase className="w-5 h-5 mr-2 text-pink-500" />
                Professional & Education
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profileData.jobTitle && (
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Job Title
                    </p>
                    <p className="text-gray-800">{profileData.jobTitle}</p>
                  </div>
                )}
                {profileData.education && (
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Education
                    </p>
                    <p className="text-gray-800">{profileData.education}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dating Preferences */}
        {(profileData.showMe ||
          profileData.lookingFor ||
          profileData.ageRange) && (
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm mb-8">
            <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50">
              <CardTitle className="flex items-center text-gray-800">
                <Heart className="w-5 h-5 mr-2 text-pink-500" />
                My Dating Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {profileData.showMe && profileData.showMe.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 font-medium">Show Me</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {profileData.showMe.map((option) => (
                      <Badge key={option} className="bg-pink-100 text-pink-700">
                        {option}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {profileData.lookingFor && (
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Looking For
                  </p>
                  <p className="text-gray-800">{profileData.lookingFor}</p>
                </div>
              )}

              {profileData.ageRange && (
                <div>
                  <p className="text-sm text-gray-500 font-medium">Age Range</p>
                  <p className="text-gray-800">
                    {profileData.ageRange[0]} - {profileData.ageRange[1]} years
                  </p>
                </div>
              )}

              {profileData.distanceRange && (
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Distance Range
                  </p>
                  <p className="text-gray-800">
                    Up to {profileData.distanceRange} km
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Partner Preferences */}
        {renderPartnerPreferences()}

        {/* Lifestyle Information */}
        {(profileData.drinking ||
          profileData.smoking ||
          profileData.religion) && (
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm mb-8">
            <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50">
              <CardTitle className="flex items-center text-gray-800">
                <Sparkles className="w-5 h-5 mr-2 text-pink-500" />
                Lifestyle
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {profileData.drinking && (
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Drinking
                    </p>
                    <p className="text-gray-800">{profileData.drinking}</p>
                  </div>
                )}
                {profileData.smoking && (
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Smoking</p>
                    <p className="text-gray-800">{profileData.smoking}</p>
                  </div>
                )}
                {profileData.religion && (
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Religion
                    </p>
                    <p className="text-gray-800">{profileData.religion}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Interests */}
        {profileData.interests && profileData.interests.length > 0 && (
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm mb-8">
            <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50">
              <CardTitle className="flex items-center text-gray-800">
                <Target className="w-5 h-5 mr-2 text-pink-500" />
                Interests & Hobbies
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-2">
                {profileData.interests.map((interest) => (
                  <Badge
                    key={interest}
                    className="bg-purple-100 text-purple-700 hover:bg-purple-200"
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Personality Prompts */}
        {profileData.personalityPrompts &&
          profileData.personalityPrompts.length > 0 && (
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm mb-8">
              <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50">
                <CardTitle className="flex items-center text-gray-800">
                  <Heart className="w-5 h-5 mr-2 text-pink-500" />
                  About Me
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {profileData.personalityPrompts.map((prompt, index) => (
                  <div key={index} className="border-l-4 border-pink-300 pl-4">
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {prompt.prompt}
                    </p>
                    <p className="text-gray-800">{prompt.answer}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

        {/* Social Links */}
        {profileData.socialLinks &&
          (profileData.socialLinks.instagram ||
            profileData.socialLinks.spotify ||
            profileData.socialLinks.linkedin) && (
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm mb-8">
              <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50">
                <CardTitle className="flex items-center text-gray-800">
                  <Sparkles className="w-5 h-5 mr-2 text-pink-500" />
                  Social Links
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {profileData.socialLinks.instagram && (
                    <div>
                      <p className="text-sm text-gray-500 font-medium">
                        Instagram
                      </p>
                      <p className="text-gray-800">
                        {profileData.socialLinks.instagram}
                      </p>
                    </div>
                  )}
                  {profileData.socialLinks.spotify && (
                    <div>
                      <p className="text-sm text-gray-500 font-medium">
                        Spotify
                      </p>
                      <p className="text-gray-800">
                        {profileData.socialLinks.spotify}
                      </p>
                    </div>
                  )}
                  {profileData.socialLinks.linkedin && (
                    <div>
                      <p className="text-sm text-gray-500 font-medium">
                        LinkedIn
                      </p>
                      <p className="text-gray-800">
                        {profileData.socialLinks.linkedin}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

        {/* Partner Preferences Status */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm mb-8">
          <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50">
            <CardTitle className="flex items-center text-gray-800">
              <Users className="w-5 h-5 mr-2 text-pink-500" />
              Partner Matching Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {isCompleteProfile
                    ? "Ready to Find Matches!"
                    : "Complete Your Partner Preferences"}
                </h3>
                <p className="text-gray-600">
                  {isCompleteProfile
                    ? "You've completed all partner preference questions and can now see partner profiles!"
                    : "Complete all partner preference questions to unlock partner browsing."}
                </p>
                {profileData.partnerPreferences && (
                  <p className="text-sm text-gray-500 mt-2">
                    Partner preferences:{" "}
                    {Object.keys(profileData.partnerPreferences).length}/17
                    completed
                  </p>
                )}
              </div>
              <div className="text-right">
                <div className="w-20 h-20 relative">
                  <svg
                    className="w-20 h-20 transform -rotate-90"
                    viewBox="0 0 36 36"
                  >
                    <path
                      className="text-gray-200"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className={
                        isCompleteProfile ? "text-green-500" : "text-pink-500"
                      }
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray={`${
                        isCompleteProfile
                          ? 100
                          : (Object.keys(profileData.partnerPreferences || {})
                              .length /
                              17) *
                            100
                      }, 100`}
                      strokeLinecap="round"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-semibold text-gray-800">
                      {isCompleteProfile
                        ? "100%"
                        : `${Math.round(
                            (Object.keys(profileData.partnerPreferences || {})
                              .length /
                              17) *
                              100
                          )}%`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {!isCompleteProfile && (
              <div className="mt-4">
                <Link href="/profile/setup">
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                    <Target className="w-4 h-4 mr-2" />
                    Complete Partner Preferences
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Profile Completion Status */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Profile Completion
                </h3>
                <p className="text-gray-600">
                  Your profile is {completionPercentage}% complete. Keep adding
                  details to attract better matches!
                </p>
              </div>
              <div className="text-right">
                <div className="w-20 h-20 relative">
                  <svg
                    className="w-20 h-20 transform -rotate-90"
                    viewBox="0 0 36 36"
                  >
                    <path
                      className="text-gray-200"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-pink-500"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray={`${completionPercentage}, 100`}
                      strokeLinecap="round"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-semibold text-gray-800">
                      {completionPercentage}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {completionPercentage < 100 && (
              <div className="mt-4">
                <Link href="/profile/edit">
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                    <Edit className="w-4 h-4 mr-2" />
                    Continue Editing Profile
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
