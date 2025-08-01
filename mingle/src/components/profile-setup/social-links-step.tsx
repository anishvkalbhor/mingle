"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Instagram, Music, Linkedin, ExternalLink, Camera, Video, ArrowRight, ArrowLeft } from "lucide-react";
import VideoRecorder from "../VideoRecorder";
import PhotoCapture from "../PhotoCapture";
import { Button } from "@/components/ui/button";

interface SocialLinksStepProps {
  data: any;
  onUpdate: (data: any) => void;
}

export default function SocialLinksStep({
  data,
  onUpdate,
}: SocialLinksStepProps) {
  const [currentStep, setCurrentStep] = useState<'photo' | 'video'>('photo');

  const handleInputChange = (field: string, value: string) => {
    onUpdate({
      ...data,
      socialLinks: {
        ...data.socialLinks,
        [field]: value,
      },
    });
  };

  const handlePhotoUpload = (url: string) => {
    handleInputChange("livePhotoUrl", url);
    // Move to video step after photo is uploaded
    setTimeout(() => {
      setCurrentStep('video');
    }, 1000);
  };

  const handleVideoUpload = (url: string) => {
    handleInputChange("introVideoUrl", url);
  };

  const goToPhotoStep = () => {
    setCurrentStep('photo');
  };

  const goToVideoStep = () => {
    setCurrentStep('video');
  };

  return (
    <div className="space-y-8">
      {/* Media Capture Section - 2 Step Process */}
      <div className="space-y-4">
        <Label className="text-gray-700 font-medium text-lg">
          Media Capture
        </Label>
        
        {/* Step Indicator */}
        <div className="flex items-center justify-center space-x-4 mb-6">
          <div className={`flex items-center space-x-2 ${currentStep === 'photo' ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'photo' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
              1
            </div>
            <span className="font-medium">Photo</span>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400" />
          <div className={`flex items-center space-x-2 ${currentStep === 'video' ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'video' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
              2
            </div>
            <span className="font-medium">Video</span>
          </div>
        </div>

        {/* Step Content */}
        <div className="relative overflow-hidden">
          {/* Photo Step */}
          <div className={`transition-all duration-500 ease-in-out ${currentStep === 'photo' ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 absolute top-0 left-0 w-full'}`}>
            <div className="space-y-2 flex flex-col items-center">
              <Label className="text-gray-700 font-medium flex items-center ">
                <Camera className="w-4 h-4 mr-2 text-blue-500" />
                Step 1: Live Photo Capture
              </Label>

              {!data.socialLinks?.livePhotoUrl ? (
                <PhotoCapture onUpload={handlePhotoUpload} />
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="relative max-w-sm w-full">
                      <img 
                        src={data.socialLinks.livePhotoUrl} 
                        alt="Live photo" 
                        className="w-full h-64 object-cover rounded-xl shadow-lg"
                      />
                      <div className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1">
                        <Camera className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center space-x-3">
                    <button
                      onClick={() => handleInputChange("livePhotoUrl", "")}
                      className="text-sm cursor-pointer bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
                    >
                      ❌ Remove photo
                    </button>
                    <button
                      onClick={goToVideoStep}
                      className="text-sm cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center transition-colors"
                    >
                      Next: Video <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              )}

              <p className="text-sm text-gray-500">
                Take a live photo using your device camera to show your authentic self.
              </p>
            </div>
          </div>

          {/* Video Step */}
          <div className={`transition-all duration-500 ease-in-out ${currentStep === 'video' ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 absolute top-0 left-0 w-full'}`}>
            <div className="space-y-2 flex flex-col items-center">
              <Label className="text-gray-700 font-medium flex items-center">
                <Video className="w-4 h-4 mr-2 text-pink-500" />
                Step 2: Intro Video Recording
              </Label>

              {!data.socialLinks?.introVideoUrl ? (
                <VideoRecorder onUpload={handleVideoUpload} />
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="relative max-w-md w-full">
                      <video 
                        controls 
                        className="w-full h-64 object-cover rounded-xl shadow-lg"
                        poster={data.socialLinks.livePhotoUrl}
                      >
                        <source src={data.socialLinks.introVideoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      <div className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1">
                        <Video className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center space-x-3">
                    <button
                      onClick={() => handleInputChange("introVideoUrl", "")}
                      className="text-sm cursor-pointer bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
                    >
                      ❌ Remove video
                    </button>
                    <button
                      onClick={goToPhotoStep}
                      className="text-sm cursor-pointer bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4 mr-1" /> Back to Photo
                    </button>
                  </div>
                </div>
              )}

              <p className="text-sm text-gray-500">
                Record or upload a 20–45s video to introduce yourself.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-800">
            <ExternalLink className="w-5 h-5 mr-2 text-pink-500" />
            Social Links
          </CardTitle>
          <p className="text-sm text-gray-600">
            Connect your social accounts to show more of your personality (all
            optional)
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Instagram */}
          <div className="space-y-2">
            <Label
              htmlFor="instagram"
              className="text-gray-700 font-medium flex items-center"
            >
              <Instagram className="w-4 h-4 mr-2 text-pink-500" />
              Instagram
            </Label>
            <Input
              id="instagram"
              type="text"
              placeholder="@yourusername or instagram.com/yourusername"
              value={data.socialLinks?.instagram || ""}
              onChange={(e) => handleInputChange("instagram", e.target.value)}
              className="h-12 border-gray-200 focus:border-pink-400 focus:ring-pink-400"
            />
            <p className="text-xs text-gray-500">
              Share your Instagram to show your photos and lifestyle
            </p>
          </div>

          {/* Spotify */}
          <div className="space-y-2">
            <Label
              htmlFor="spotify"
              className="text-gray-700 font-medium flex items-center"
            >
              <Music className="w-4 h-4 mr-2 text-green-500" />
              Spotify
            </Label>
            <Input
              id="spotify"
              type="text"
              placeholder="Your Spotify username or profile URL"
              value={data.socialLinks?.spotify || ""}
              onChange={(e) => handleInputChange("spotify", e.target.value)}
              className="h-12 border-gray-200 focus:border-pink-400 focus:ring-pink-400"
            />
            <p className="text-xs text-gray-500">
              Let others see your music taste and favorite artists
            </p>
          </div>

          {/* LinkedIn */}
          <div className="space-y-2">
            <Label
              htmlFor="linkedin"
              className="text-gray-700 font-medium flex items-center"
            >
              <Linkedin className="w-4 h-4 mr-2 text-blue-600" />
              LinkedIn or Personal Website
            </Label>
            <Input
              id="linkedin"
              type="text"
              placeholder="LinkedIn profile or personal website URL"
              value={data.socialLinks?.linkedin || ""}
              onChange={(e) => handleInputChange("linkedin", e.target.value)}
              className="h-12 border-gray-200 focus:border-pink-400 focus:ring-pink-400"
            />
            <p className="text-xs text-gray-500">
              Share your professional profile or personal website
            </p>
          </div>

          {/* Privacy Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">Privacy & Safety</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Your social links are only visible to your matches</li>
              <li>
                • You can hide or remove these links anytime from your profile
              </li>
              <li>
                • We never post on your behalf or access private information
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Completion Message */}
      <Card className="shadow-xl border-0 bg-gradient-to-r from-pink-50 to-purple-50">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExternalLink className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            You're Almost Done! 🎉
          </h3>
          <p className="text-gray-600 mb-4">
            Your profile is looking amazing! Click "Complete Setup" to start
            finding your perfect matches.
          </p>
          <p className="text-sm text-gray-500">
            You can always edit your profile later from your dashboard.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
