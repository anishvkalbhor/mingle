"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, MapPin, Briefcase, Heart, MessageCircle, User, GraduationCap, Wine, Cigarette, Landmark, Star, Ruler, Activity, Eye, Scissors } from "lucide-react";
import Link from "next/link";

interface UserProfile {
  clerkId: string;
  username?: string;
  fullName?: string;
  email?: string;
  bio?: string;
  socialLinks?: {
    instagram?: string;
    spotify?: string;
    linkedin?: string;
    introVideoUrl?: string;
    livePhotoUrl?: string;
  };
  occupation?: string;
  occupationDetails?: {
    organizationName?: string;
    instituteName?: string;
    degree?: string;
  };
  dateOfBirth?: string;
  profilePhotos?: string[];
  state?: string;
  gender?: string;
  sexualOrientation?: string[];
  lookingFor?: string;
  education?: string;
  drinking?: string;
  smoking?: string;
  religion?: string;
  zodiacSign?: string;
  politics?: string;
  interests?: string[];
  personalityPrompts?: Array<{ prompt: string; answer: string }>;
  age?: number;
  mutual?: boolean;
}

export default function UserProfileDetail() {
  const params = useParams();
  const userId = params.id as string;
  const router = useRouter();
  const { getToken } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        setLoading(true);
        const token = await getToken();
        const response = await fetch(`http://localhost:5000/api/users/${userId}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const data = await response.json();
        
        // The profile endpoint already provides the age
        // No need to calculate it manually
        
        setProfile(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchUserProfile();
    }
  }, [userId, getToken]);

  const handleGoBack = () => {
    router.back();
  };

  const handleMessage = () => {
    router.push(`/profile-reveal/${userId}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex justify-start mb-4">
          <Button variant="ghost" onClick={handleGoBack}>
            <ArrowLeft className="mr-2" size={16} /> Back
          </Button>
        </div>
        <div className="text-center py-20">
          <div className="animate-pulse h-8 w-40 bg-gray-200 rounded mx-auto mb-8"></div>
          <div className="animate-pulse h-64 w-full bg-gray-200 rounded mb-8"></div>
          <div className="animate-pulse h-4 w-3/4 bg-gray-200 rounded mx-auto mb-4"></div>
          <div className="animate-pulse h-4 w-1/2 bg-gray-200 rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex justify-start mb-4">
          <Button variant="ghost" onClick={handleGoBack}>
            <ArrowLeft className="mr-2" size={16} /> Back
          </Button>
        </div>
        <Card className="w-full">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-2">Error</h2>
            <p className="text-gray-600">{error || "User profile not found"}</p>
            <Button className="mt-4" onClick={handleGoBack}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl bg-gray-50">
      <div className="flex justify-start mb-4">
        <Button variant="ghost" onClick={handleGoBack} className="bg-white shadow-sm hover:bg-gray-100">
          <ArrowLeft className="mr-2" size={16} /> Back
        </Button>
      </div>

      {/* Main Content Container */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 max-w-4xl mx-auto">
        {/* Cover Image */}
        <div className="relative h-48 bg-gradient-to-r from-purple-500 to-indigo-500">
          {/* Profile Photo */}
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
            <div className="relative">
              {profile.profilePhotos && profile.profilePhotos.length > 0 ? (
                <img
                  src={profile.profilePhotos[0]}
                  alt={profile.username || profile.fullName}
                  className="w-24 h-24 rounded-full border-4 border-white object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No photo</span>
                </div>
              )}
              {profile.mutual === false && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <Heart size={24} className="text-white" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Username and Follow Button */}
        <div className="pt-14 pb-2 px-4 text-center"> {/* Extra padding top for profile picture */}
          <h1 className="text-xl font-semibold text-gray-800">
            {profile.username || profile.fullName}
            <span className="text-gray-500 text-sm ml-1">•</span>
          </h1>
          
          <div className="flex justify-center items-center mt-1 text-sm text-gray-500">
            <span>24, Group, Miami, FL</span>
            <span className="mx-1">•</span>
            <span>Match: 75%</span>
          </div>
          
          <div className="flex justify-center space-x-2 mt-3">
            {profile.mutual !== false ? (
              <Button onClick={handleMessage} className="bg-pink-500 hover:bg-pink-600 text-white text-xs px-3 py-1 h-8 rounded-full">
                Message
              </Button>
            ) : (
              <Button className="bg-pink-500 hover:bg-pink-600 text-white text-xs px-3 py-1 h-8 rounded-full">
                Match
              </Button>
            )}
            <Button className="border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 text-xs px-3 py-1 h-8 rounded-full">
              Like
            </Button>
          </div>
        </div>
        
        {/* Section Headers */}
        <div className="border-t border-gray-200 pt-4 px-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Photos</h2>
            <h2 className="text-xl font-semibold text-gray-800">About</h2>
          </div>
        </div>

        {/* Content Sections - Side by Side */}
        <div className="px-6 py-5 grid grid-cols-2 gap-8">          
          {/* Photos Section */}
          <div>
            <div className="grid grid-cols-2 gap-2">
              {profile.profilePhotos && profile.profilePhotos.length > 0 ? (
                profile.profilePhotos.map((photo, index) => (
                  <div key={index} className="aspect-square rounded-md overflow-hidden">
                    <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))
              ) : (
                <div className="col-span-2 py-10 text-center text-gray-500">
                  No photos available
                </div>
              )}
            </div>
          </div>

          {/* About Section */}
          <div>
            <div className="mb-6">
              <h2 className="text-base font-semibold text-gray-800 mb-2">About</h2>
              <p className="text-sm text-gray-600">
                I am deeply in love with travel, good food, and unforgettable experiences. I'm a foodie, traveler, and outdoor enthusiast who loves to explore. I'm also a big fan of live music and trying new things. Let's meet for coffee and see if we hit it off!
              </p>
            </div>

          {/* I am Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">I am</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <User className="text-blue-500" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="text-gray-700">Female</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                  <Heart className="text-purple-500" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Sexual Orientation</p>
                  <p className="text-gray-700">Straight</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <GraduationCap className="text-green-500" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Education</p>
                  <p className="text-gray-700">Bachelor's Degree</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                  <Wine className="text-yellow-500" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Drinking</p>
                  <p className="text-gray-700">Social Drinker</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                  <Cigarette className="text-red-500" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Smoking</p>
                  <p className="text-gray-700">Never</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                  <Landmark className="text-indigo-500" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Religion</p>
                  <p className="text-gray-700">Spiritual</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center mr-3">
                  <Star className="text-pink-500" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Zodiac Sign</p>
                  <p className="text-gray-700">Pisces</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interests Section */}
          <div className="mb-6">
            <h2 className="text-base font-semibold text-gray-800 mb-2">Interests</h2>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-1 rounded-full text-xs">
                Travel
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-1 rounded-full text-xs">
                Cooking
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-1 rounded-full text-xs">
                Hiking
              </Badge>
            </div>
          </div>

          {/* Interests Section */}
          <div className="mb-6">
            <h2 className="text-base font-semibold text-gray-800 mb-2">Interests</h2>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-1 rounded-full text-xs">
                Travel
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-1 rounded-full text-xs">
                Cooking
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-1 rounded-full text-xs">
                Hiking
              </Badge>
            </div>
          </div>

          {/* Physical Details Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Physical Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <Ruler className="text-blue-500" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Height</p>
                  <p className="text-gray-700">5'6" (168 cm)</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <Activity className="text-green-500" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Body Type</p>
                  <p className="text-gray-700">Athletic</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                  <Eye className="text-purple-500" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Eye Color</p>
                  <p className="text-gray-700">Blue</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                  <Scissors className="text-yellow-500" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Hair Color</p>
                  <p className="text-gray-700">Blonde</p>
                </div>
              </div>
            </div>
          </div>

          {/* I'm Looking For Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">I'm Looking For</h2>
            <p className="text-gray-700">Someone who is kind, honest, and has a good sense of humor. I value deep conversations and shared interests. Looking for a long-term relationship with someone who enjoys outdoor activities and traveling.</p>
          </div>

          {/* Current Goal Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Current Goal</h2>
            <p className="text-gray-700">Looking for a serious relationship</p>
          </div>
        </div>
      </div>
      </div>

      {/* Match Predictor */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Match Predictor</h2>
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full bg-pink-500 flex items-center justify-center text-white text-xl font-bold">96%</div>
            <div className="ml-4">
              <p className="text-gray-700">You and Ivonne have a high compatibility score!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 mt-6 mb-10">
        <Button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full">
          <MessageCircle className="mr-2" size={16} />
          Message
        </Button>
        <Button className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full">
          <Heart className="mr-2" size={16} />
          Like
        </Button>
      </div>
    </div>
  );
}