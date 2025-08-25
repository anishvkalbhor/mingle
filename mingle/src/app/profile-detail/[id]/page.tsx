"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, MapPin, Briefcase, Heart, MessageCircle, User, GraduationCap, Wine, Cigarette, Landmark, Star, Ruler, Activity, Eye, Scissors, Linkedin, Instagram, Music } from "lucide-react";
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
  jobTitle?: string;
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
  likedByCount?: number;
  likedUsers?: string[];
  matchPercentage?: number;
}

// Dynamic About Me description generator
const generateAboutDescription = (profile: UserProfile): string => {
  const name = profile.fullName || profile.username || "User";
  const location = profile.state || "a wonderful place";
  const job = profile.occupation || "";
  const edu = profile.education || "";
  const jobOrEdu = job || edu || "pursuing my passions";
  const interests = profile.interests && profile.interests.length > 0 
    ? profile.interests.slice(0, 3).join(", ") 
    : "music, movies, and gaming";
  const lookingFor = profile.lookingFor || "a meaningful, long-term connection";
  
  return `Hi, I'm ${name}! I live in ${location} and I'm ${jobOrEdu}. 
I enjoy ${interests} and love trying new experiences. 
I'm looking for ${lookingFor} with someone who shares my values.`;
};

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
        
        // Debug: Log the response to see what data we're getting
        console.log('Profile data received:', data);
        
        // Check if data has nested user object
        const userData = data.user || data;
        
        // Map the backend response to our interface structure
        const mappedProfile: UserProfile = {
          clerkId: userData.clerkId || userData.id || userData._id,
          username: userData.username || userData.userName,
          fullName: userData.fullName || userData.name || userData.firstName + ' ' + userData.lastName,
          email: userData.email,
          bio: userData.bio || userData.description || userData.about,
          socialLinks: {
            instagram: userData.socialLinks?.instagram || userData.instagram || userData.instagramUrl || undefined,
            spotify: userData.socialLinks?.spotify || userData.spotify || userData.spotifyUrl || undefined,
            linkedin: userData.socialLinks?.linkedin || userData.linkedin || userData.linkedinUrl || undefined,
            introVideoUrl: userData.socialLinks?.introVideoUrl || userData.introVideoUrl || undefined,
            livePhotoUrl: userData.socialLinks?.livePhotoUrl || userData.livePhotoUrl || undefined
          },
          occupation: userData.occupation || userData.job || userData.work,
          jobTitle: userData.jobTitle || userData.position || userData.title,
          occupationDetails: userData.occupationDetails || {
            organizationName: userData.organizationName || userData.company || userData.workplace,
            instituteName: userData.instituteName || userData.school || userData.university,
            degree: userData.degree || userData.qualification
          },
          dateOfBirth: userData.dateOfBirth || userData.dob || userData.birthDate,
          profilePhotos: userData.profilePhotos || userData.photos || userData.images || [],
          state: userData.state || userData.location || userData.city || userData.address,
          gender: userData.gender,
          sexualOrientation: userData.sexualOrientation || userData.orientations || (userData.orientation ? [userData.orientation] : []),
          lookingFor: userData.lookingFor || userData.relationshipGoals || userData.seeking,
          education: userData.education || userData.educationLevel || userData.schooling,
          drinking: userData.drinking || userData.drinkingHabits || userData.alcohol,
          smoking: userData.smoking || userData.smokingHabits || userData.smoke,
          religion: userData.religion || userData.religiousBeliefs || userData.faith,
          zodiacSign: userData.zodiacSign || userData.zodiac || userData.sign,
          politics: userData.politics || userData.politicalViews || userData.political,
          interests: userData.interests || userData.hobbies || userData.likes || [],
          personalityPrompts: userData.personalityPrompts || userData.prompts || userData.questions || [],
          age: userData.age || (userData.dateOfBirth ? new Date().getFullYear() - new Date(userData.dateOfBirth).getFullYear() : undefined),
          mutual: userData.mutual || false,
          likedUsers: userData.likedUsers || [],
          likedByCount: userData.likedUsers ? userData.likedUsers.length : (userData.likedByCount || userData.likesReceived || userData.totalLikes || undefined),
          matchPercentage: userData.matchPercentage || userData.compatibilityScore || userData.matchScore || undefined
        };
        
        // Add sample data if all fields are empty (for testing)
        if (!mappedProfile.gender && !mappedProfile.education && !mappedProfile.drinking) {
          console.log('No backend data found, using sample data for testing');
          mappedProfile.gender = 'Male';
          mappedProfile.education = 'Information Technology';
          mappedProfile.occupation = 'Teacher';
          mappedProfile.jobTitle = 'Senior Software Developer';
          mappedProfile.drinking = 'Never';
          mappedProfile.smoking = 'Never';
          mappedProfile.religion = 'Spiritual';
          mappedProfile.state = 'Kolkata';
          mappedProfile.sexualOrientation = ['Straight'];
          mappedProfile.interests = ['Music', 'Movies', 'Gaming', 'Beach', 'Camping', 'Fitness', 'Travel'];
          mappedProfile.lookingFor = 'meaningful, long-term connection';
          mappedProfile.age = 26;
          // Only set sample data if backend doesn't provide real data
          if (mappedProfile.likedByCount === undefined || mappedProfile.likedByCount === 0) {
            mappedProfile.likedByCount = 47;
            mappedProfile.likedUsers = ['sample_user_1', 'sample_user_2'];
          }
          if (mappedProfile.matchPercentage === undefined) mappedProfile.matchPercentage = 96;
          // Only use sample personality prompts if backend has no data
          if (!mappedProfile.personalityPrompts || mappedProfile.personalityPrompts.length === 0) {
            console.log('No personality prompts from backend, using sample data');
            mappedProfile.personalityPrompts = [
              { prompt: 'What makes you laugh?', answer: 'Good comedy shows and spending time with friends who have great sense of humor.' },
              { prompt: 'My ideal Sunday', answer: 'Sleeping in, making a good breakfast, going for a walk, and maybe catching up on some reading.' }
            ];
          } else {
            console.log('Using backend personality prompts:', mappedProfile.personalityPrompts);
          }
          if (!mappedProfile.socialLinks?.instagram && !mappedProfile.socialLinks?.linkedin && !mappedProfile.socialLinks?.spotify) {
            mappedProfile.socialLinks = {
              instagram: 'https://instagram.com/rishov_dev',
              linkedin: 'https://linkedin.com/in/rishov-developer',
              spotify: 'https://open.spotify.com/user/rishov_music'
            };
          }
        }
        
        // Debug logs for liked users
        console.log('Liked users array:', mappedProfile.likedUsers);
        console.log('Liked by count:', mappedProfile.likedByCount);
        console.log('Personality prompts:', mappedProfile.personalityPrompts);
        
        console.log('Mapped profile data:', mappedProfile);
        console.log('Fields with data:', Object.entries(mappedProfile).filter(([key, value]) => value && value !== '' && (Array.isArray(value) ? value.length > 0 : true)));
        setProfile(mappedProfile);
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
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-300/20 to-indigo-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-pink-300/10 to-purple-300/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        
        {/* Floating Particles */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-purple-300/30 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-pink-300/40 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-indigo-300/50 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 right-20 w-5 h-5 bg-blue-300/30 rounded-full animate-bounce delay-200"></div>
        
        {/* Geometric Shapes */}
        <div className="absolute top-1/4 right-1/4 w-16 h-16 border-2 border-purple-200/30 rotate-45 animate-spin-slow"></div>
        <div className="absolute bottom-1/4 left-1/4 w-12 h-12 border-2 border-pink-200/30 rotate-12 animate-spin-slow delay-500"></div>
      </div>
      
      {/* Back Button */}
      <div className="container mx-auto px-2 sm:px-4 pt-4 max-w-5xl relative z-10">
        <Button variant="ghost" onClick={handleGoBack} className="bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white/90 border border-white/20">
          <ArrowLeft className="mr-2" size={16} /> Back
        </Button>
      </div>

      {/* Main Profile Card */}
      <div className="container mx-auto px-2 sm:px-4 py-6 max-w-5xl relative z-10">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-white/20">
          {/* Header with Cover and Profile Photo */}
          <div className="relative">
            {/* Cover Image */}
            <div className="h-56 bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-600 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* Profile Photo */}
            <div className="absolute -bottom-12 sm:-bottom-16 left-4 sm:left-8">
              <div className="relative">
                {profile.profilePhotos && profile.profilePhotos.length > 0 ? (
                  <img
                    src={profile.profilePhotos[0]}
                    alt={profile.username || profile.fullName}
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border-4 border-white object-cover shadow-2xl ring-4 ring-purple-100"
                  />
                ) : (
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border-4 border-white bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-2xl ring-4 ring-purple-100">
                    <User className="text-gray-400" size={32} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-16 sm:pt-20 pb-6 sm:pb-8 px-4 sm:px-8 bg-gradient-to-b from-gray-50/50 to-white">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {profile.username || profile.fullName}
                </h1>
                <p className="text-gray-600 text-base sm:text-lg">
                  {profile.age ? `${profile.age}, ` : ""}{profile.state || "Location not specified"} • <span className="text-green-600 font-semibold">{profile.matchPercentage || 75}% Match</span>
                </p>
              </div>
              {/* Action Buttons */}
              <div className="flex flex-col items-center sm:items-end space-y-3 sm:space-y-4">
                <div className="flex space-x-3 sm:space-x-4">
                  <Button onClick={handleMessage} className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                    Message
                  </Button>
                  <Button className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                    Like
                  </Button>
                </div>
                
                {/* Social Media Icons */}
                <div className="flex space-x-2 sm:space-x-3">
                  {/* LinkedIn */}
                  {profile.socialLinks?.linkedin ? (
                    <a 
                      href={profile.socialLinks.linkedin.startsWith('http') ? profile.socialLinks.linkedin : `https://linkedin.com/in/${profile.socialLinks.linkedin}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-110 shadow-lg hover:shadow-xl"
                    >
                      <Linkedin size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </a>
                  ) : (
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 cursor-not-allowed opacity-50">
                      <Linkedin size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </div>
                  )}
                  
                  {/* Instagram */}
                  {profile.socialLinks?.instagram ? (
                    <a 
                      href={profile.socialLinks.instagram.startsWith('http') ? profile.socialLinks.instagram : `https://instagram.com/${profile.socialLinks.instagram.replace('@', '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-white hover:from-pink-600 hover:to-rose-600 transition-all duration-200 transform hover:scale-110 shadow-lg hover:shadow-xl"
                    >
                      <Instagram size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </a>
                  ) : (
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 cursor-not-allowed opacity-50">
                      <Instagram size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </div>
                  )}
                  
                  {/* Spotify */}
                  {profile.socialLinks?.spotify ? (
                    <a 
                      href={profile.socialLinks.spotify.startsWith('http') ? profile.socialLinks.spotify : `https://open.spotify.com/user/${profile.socialLinks.spotify}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-110 shadow-lg hover:shadow-xl"
                    >
                      <Music size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </a>
                  ) : (
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 cursor-not-allowed opacity-50">
                      <Music size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-6 sm:space-x-12 mt-6 sm:mt-8 border-b border-gray-200 overflow-x-auto">
              <button className="pb-3 text-gray-900 border-b-3 border-blue-500 font-semibold text-base sm:text-lg whitespace-nowrap">
                Photos
              </button>
              <button className="pb-3 text-gray-500 hover:text-gray-700 font-medium text-base sm:text-lg transition-colors whitespace-nowrap">
                About
              </button>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="px-4 sm:px-8 pb-6 sm:pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {/* Left Column - Photos & Interests */}
              <div className="space-y-4 sm:space-y-6">
                {/* Photos Section */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 sm:p-6 border border-blue-100 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg mr-3 flex items-center justify-center">
                      <User className="text-white" size={18} />
                    </div>
                    Photos
                  </h3>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4">
                    {/* Always show 4 photo boxes */}
                    {Array.from({ length: 4 }).map((_, index) => {
                      const photo = profile.profilePhotos?.[index];
                      return (
                        <div key={index} className="aspect-square rounded-xl overflow-hidden bg-white border-2 border-dashed border-blue-200 shadow-md hover:shadow-lg transition-all duration-200">
                          {photo ? (
                            <img 
                              src={photo} 
                              alt={`Photo ${index + 1}`} 
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                              <User size={32} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <Button variant="outline" className="w-full text-blue-600 border-blue-300 hover:bg-blue-50 hover:border-blue-400 font-semibold py-2 rounded-xl transition-all duration-200">
                    Load More Photos
                  </Button>
                </div>

                {/* Interests Section */}
                <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 rounded-2xl p-4 sm:p-6 lg:p-8 border border-purple-100 shadow-lg relative overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-4 right-4 w-20 h-20 bg-purple-300 rounded-full"></div>
                    <div className="absolute bottom-4 left-4 w-16 h-16 bg-pink-300 rounded-full"></div>
                    <div className="absolute top-1/2 left-1/3 w-12 h-12 bg-indigo-300 rounded-full"></div>
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mr-4 flex items-center justify-center shadow-lg">
                        <Heart className="text-white" size={20} />
                      </div>
                      My Interests
                      <div className="ml-auto text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                        {profile.interests?.length || 0} interests
                      </div>
                    </h3>
                    
                    {/* Interest Categories */}
                    <div className="space-y-6">
                      {/* Primary Interests */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                          Primary Interests
                        </h4>
                        <div className="flex flex-wrap gap-3">
                          {profile.interests && profile.interests.length > 0 ? (
                            profile.interests.slice(0, Math.min(4, profile.interests.length)).map((interest, index) => {
                              const gradients = [
                                "from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
                                "from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600",
                                "from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600",
                                "from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                              ];
                              const emojis = ["✨", "🎯", "💫", "🌟"];
                              return (
                                <div key={index} className="group relative">
                                  <Badge className={`bg-gradient-to-r ${gradients[index % gradients.length]} text-white px-5 py-3 rounded-2xl font-bold text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 hover:-rotate-1`}>
                                    {emojis[index % emojis.length]} {interest}
                                  </Badge>
                                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
                                </div>
                              );
                            })
                          ) : (
                            <>
                              <div className="group relative">
                                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 px-5 py-3 rounded-2xl font-bold text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 hover:-rotate-1">
                                  🎵 Music
                                </Badge>
                                <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
                              </div>
                              <div className="group relative">
                                <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 px-5 py-3 rounded-2xl font-bold text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 hover:rotate-1">
                                  🎬 Movies
                                </Badge>
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
                              </div>
                              <div className="group relative">
                                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 px-5 py-3 rounded-2xl font-bold text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 hover:-rotate-1">
                                  🎮 Gaming
                                </Badge>
                                <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {/* Secondary Interests */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
                          <div className="w-2 h-2 bg-pink-500 rounded-full mr-2"></div>
                          Also Enjoys
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {profile.interests && profile.interests.length > 4 ? (
                            profile.interests.slice(4).map((interest, index) => {
                              const colors = [
                                "from-orange-100 to-red-100 text-orange-800 hover:from-orange-200 hover:to-red-200 border-orange-200",
                                "from-yellow-100 to-orange-100 text-yellow-800 hover:from-yellow-200 hover:to-orange-200 border-yellow-200",
                                "from-green-100 to-teal-100 text-green-800 hover:from-green-200 hover:to-teal-200 border-green-200"
                              ];
                              return (
                                <Badge key={index} className={`bg-gradient-to-r ${colors[index % colors.length]} px-4 py-2 rounded-xl border-2 font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105`}>
                                  {interest}
                                </Badge>
                              );
                            })
                          ) : profile.interests && profile.interests.length <= 4 && profile.interests.length > 0 ? (
                            // Show remaining interests if less than 4 total
                            profile.interests.slice(Math.min(4, profile.interests.length)).map((interest, index) => (
                              <Badge key={index} className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 hover:from-orange-200 hover:to-red-200 px-4 py-2 rounded-xl border-2 border-orange-200 font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105">
                                {interest}
                              </Badge>
                            ))
                          ) : (
                            <>
                              <Badge className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 hover:from-orange-200 hover:to-red-200 px-4 py-2 rounded-xl border-2 border-orange-200 font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105">
                                🏖️ Beach
                              </Badge>
                              <Badge className="bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 hover:from-yellow-200 hover:to-orange-200 px-4 py-2 rounded-xl border-2 border-yellow-200 font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105">
                                🏕️ Camping
                              </Badge>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {/* Interest Stats */}
                      {/* <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                              <span className="text-gray-600">Outdoor: 40%</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                              <span className="text-gray-600">Creative: 35%</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                              <span className="text-gray-600">Social: 25%</span>
                            </div>
                          </div>
                          <div className="text-purple-600 font-semibold">
                            🎯 Well-rounded
                          </div>
                        </div>
                      </div> */}

                      {/* Beautiful Closing Line */}
                      <div className="text-center py-6">
                        <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10 rounded-full border border-purple-200/30">
                          <span className="text-gray-600 font-medium text-sm italic">
                            ✨ Life isn’t just about the days we live, but about the moments that stop us in our tracks, leave us speechless, and take our breath away✨
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - About & Details */}
              <div className="space-y-4 sm:space-y-6">
                {/* About Section */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 sm:p-6 lg:p-8 border border-green-100 shadow-lg">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="w-8 h-8 bg-green-500 rounded-lg mr-3 flex items-center justify-center">
                      <MessageCircle className="text-white" size={18} />
                    </div>
                    About
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
                    {profile.bio || generateAboutDescription(profile)}
                  </p>
                </div>

                {/* I Am Section */}
                <div className="bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 rounded-2xl p-4 sm:p-6 lg:p-8 border border-yellow-100 shadow-lg relative overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-4 right-4 w-16 h-16 bg-yellow-300 rounded-full"></div>
                    <div className="absolute bottom-4 left-4 w-20 h-20 bg-amber-300 rounded-full"></div>
                    <div className="absolute top-1/3 right-1/3 w-12 h-12 bg-orange-300 rounded-full"></div>
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl mr-4 flex items-center justify-center shadow-lg">
                        <Star className="text-white" size={20} />
                      </div>
                      About Me
                      <div className="ml-auto text-sm bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-medium">
                        {Object.values({
                          gender: profile.gender,
                          education: profile.education,
                          occupation: profile.occupation,
                          drinking: profile.drinking,
                          smoking: profile.smoking,
                          religion: profile.religion,
                          zodiacSign: profile.zodiacSign,
                          politics: profile.politics
                        }).filter(Boolean).length} fields
                      </div>
                    </h3>
                    
                    {/* Personal Details Categories */}
                    <div className="space-y-6">
                      {/* Basic Info */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                          Basic Information
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center p-3 bg-white/80 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center mr-4">
                              <User className="text-blue-600" size={20} />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-500 font-medium">Gender</p>
                              <p className="text-gray-800 font-semibold">{profile.gender || "Not specified"}</p>
                            </div>
                          </div>
                          <div className="flex items-center p-3 bg-white/80 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-100 to-purple-200 flex items-center justify-center mr-4">
                              <Heart className="text-purple-600" size={20} />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-500 font-medium">Sexual Orientation</p>
                              <p className="text-gray-800 font-semibold">{profile.sexualOrientation?.[0] || "Not specified"}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Lifestyle */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
                          <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                          Lifestyle & Values
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center p-3 bg-white/80 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-100 to-green-200 flex items-center justify-center mr-4">
                              <GraduationCap className="text-green-600" size={20} />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-500 font-medium">Education</p>
                              <p className="text-gray-800 font-semibold">{profile.education || "Not specified"}</p>
                              {profile.occupationDetails?.degree && (
                                <p className="text-xs text-gray-600">{profile.occupationDetails.degree}</p>
                              )}
                            </div>
                          </div>
                          {profile.occupation && (
                            <div className="flex items-center p-3 bg-white/80 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center mr-4">
                                <Briefcase className="text-blue-600" size={20} />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm text-gray-500 font-medium">Occupation</p>
                                <p className="text-gray-800 font-semibold">{profile.occupation}</p>
                                {profile.occupationDetails?.organizationName && (
                                  <p className="text-xs text-gray-600">at {profile.occupationDetails.organizationName}</p>
                                )}
                              </div>
                            </div>
                          )}
                          <div className="flex items-center p-3 bg-white/80 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-yellow-100 to-yellow-200 flex items-center justify-center mr-4">
                              <Wine className="text-yellow-600" size={20} />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-500 font-medium">Drinking</p>
                              <p className="text-gray-800 font-semibold">{profile.drinking || "Not specified"}</p>
                            </div>
                          </div>
                          <div className="flex items-center p-3 bg-white/80 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-red-100 to-red-200 flex items-center justify-center mr-4">
                              <Cigarette className="text-red-600" size={20} />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-500 font-medium">Smoking</p>
                              <p className="text-gray-800 font-semibold">{profile.smoking || "Not specified"}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Beliefs & Personality */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                          Beliefs & Personality
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center p-3 bg-white/80 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-100 to-indigo-200 flex items-center justify-center mr-4">
                              <Landmark className="text-indigo-600" size={20} />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-500 font-medium">Religion</p>
                              <p className="text-gray-800 font-semibold">{profile.religion || "Not specified"}</p>
                            </div>
                          </div>
                          {profile.zodiacSign && (
                            <div className="flex items-center p-3 bg-white/80 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-100 to-purple-200 flex items-center justify-center mr-4">
                                <Star className="text-purple-600" size={20} />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm text-gray-500 font-medium">Zodiac Sign</p>
                                <p className="text-gray-800 font-semibold">{profile.zodiacSign}</p>
                              </div>
                            </div>
                          )}
                          {profile.politics && (
                            <div className="flex items-center p-3 bg-white/80 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-red-100 to-red-200 flex items-center justify-center mr-4">
                                <Landmark className="text-red-600" size={20} />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm text-gray-500 font-medium">Politics</p>
                                <p className="text-gray-800 font-semibold">{profile.politics}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Personality Summary */}
                      {/* <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <div className="text-center">
                          <div className="text-2xl mb-2">✨</div>
                          <p className="text-sm font-semibold text-gray-700 mb-1">Personality Match</p>
                          <p className="text-xs text-gray-600">Adventurous • Thoughtful • Creative</p>
                        </div>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Full Width Sections */}
            <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">

              {/* Beyond the Basics */}
              <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-4 sm:p-6 border border-indigo-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mr-3">
                    <Star className="text-white" size={16} />
                  </div>
                  Beyond the Basics
                </h3>
                
                <div className="space-y-6">
                  {/* Job Title */}
                  {profile.jobTitle && (
                    <div className="bg-white/80 rounded-lg p-4 border border-white/50">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center">
                          <Briefcase className="text-blue-600" size={20} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium">Job Title</p>
                          <p className="text-gray-900 font-semibold">{profile.jobTitle}</p>
                          {profile.occupationDetails?.organizationName && (
                            <p className="text-xs text-gray-600">at {profile.occupationDetails.organizationName}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}


                  {/* Liked User Number */}
                  {/* {profile.likedByCount !== undefined && profile.likedByCount > 0 && (
                    <div className="bg-white/80 rounded-lg p-4 border border-white/50">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-rose-100 to-pink-200 flex items-center justify-center">
                          <Heart className="text-rose-600" size={20} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium">Popularity</p>
                          <p className="text-gray-900 font-semibold">{profile.likedByCount} people liked this profile</p>
                          <p className="text-xs text-gray-600">You're in good company!</p>
                        </div>
                      </div>
                    </div>
                  )} */}

                  {/* Personality Prompts */}
                  {/* {profile.personalityPrompts && profile.personalityPrompts.length > 0 && (
                    <div className="bg-white/80 rounded-lg p-4 border border-white/50">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                        Personality Prompts
                      </h4>
                      <div className="space-y-3">
                        {profile.personalityPrompts.map((prompt, index) => (
                          <div key={index} className="p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-100">
                            <p className="text-xs font-medium text-purple-700 mb-1">{prompt.prompt}</p>
                            <p className="text-gray-800 text-sm">{prompt.answer}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )} */}
                </div>
              </div>

              {/* Match Predictor */}
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4 sm:p-6 border border-pink-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Match Predictor</h3>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold shadow-lg mx-auto sm:mx-0">
                    {profile.matchPercentage || 75}%
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-gray-900 font-medium text-sm sm:text-base">You and {profile.username || profile.fullName} have a high compatibility score!</p>
                    <p className="text-gray-600 text-sm mt-1">Based on shared interests and preferences</p>
                  </div>
                </div>
              </div>

              {/* I'm Looking For */}
              {/* <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">I'm Looking For</h3>
                <p className="text-gray-700 leading-relaxed">
                  {profile.lookingFor || "Someone who is kind, honest, and has a good sense of humor. I value deep conversations and shared interests. Looking for a long-term relationship with someone who enjoys outdoor activities and traveling."}
                </p>
              </div> */}

              {/* Current Goal */}
              <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Relationship Goals</h3>
                <p className="text-gray-700">{profile.lookingFor || "Looking for a meaningful connection"}</p>
                {profile.sexualOrientation && profile.sexualOrientation.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-500 mb-1">Sexual Orientation</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.sexualOrientation.map((orientation, index) => (
                        <Badge key={index} className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                          {orientation}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
