"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Instagram,
  Music,
  Linkedin,
  ExternalLink,
  Camera,
  Video,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import VideoRecorder from "../VideoRecorder";
import PhotoCapture from "../PhotoCapture";

interface SocialLinksStepProps {
  data: any;
  onUpdate: (data: any) => void;
}

interface ValidationState {
  instagram: { isValid: boolean | null; isValidating: boolean; error: string };
  spotify: { isValid: boolean | null; isValidating: boolean; error: string };
  linkedin: { isValid: boolean | null; isValidating: boolean; error: string };
}

export default function SocialLinksStep({
  data,
  onUpdate,
}: SocialLinksStepProps) {
  const [currentStep, setCurrentStep] = useState<"photo" | "video">("photo");
  const [validation, setValidation] = useState<ValidationState>({
    instagram: { isValid: null, isValidating: false, error: "" },
    spotify: { isValid: null, isValidating: false, error: "" },
    linkedin: { isValid: null, isValidating: false, error: "" },
  });

  // URL validation patterns
  const patterns = {
    instagram:
      /^(?:https?:\/\/)?(?:www\.)?instagram\.com\/([a-zA-Z0-9_.]+)\/?$|^@?([a-zA-Z0-9_.]+)$/,
    spotify:
      /^(?:https?:\/\/)?(?:open\.)?spotify\.com\/user\/([a-zA-Z0-9_.-]+)(?:\?.*)?$|^([a-zA-Z0-9_.-]+)$/,
    linkedin:
      /^(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9-_]+)\/?$|^(?:https?:\/\/)?(?:[\w-]+\.)+[\w-]+(?:\/.*)?$/,
  };

  const normalizeUrl = (platform: string, input: string): string => {
    if (!input) return "";

    switch (platform) {
      case "instagram":
        const igMatch = input.match(patterns.instagram);
        if (igMatch) {
          const username = igMatch[1] || igMatch[2];
          return `https://www.instagram.com/${username}`;
        }
        return input;

      case "spotify":
        const spotifyMatch = input.match(patterns.spotify);
        if (spotifyMatch) {
          const username = spotifyMatch[1] || spotifyMatch[2];
          return `https://open.spotify.com/user/${username}`;
        }
        return input;

      case "linkedin":
        if (input.includes("linkedin.com/in/")) {
          return input.startsWith("http") ? input : `https://${input}`;
        } else if (!input.includes(".")) {
          return `https://www.linkedin.com/in/${input}`;
        }
        return input.startsWith("http") ? input : `https://${input}`;

      default:
        return input;
    }
  };

  const validateSocialLink = async (
    platform: string,
    url: string
  ): Promise<{ isValid: boolean; error: string }> => {
    if (!url) return { isValid: true, error: "" };

    if (!patterns[platform as keyof typeof patterns].test(url)) {
      return {
        isValid: false,
        error: `Invalid ${platform} format. Please enter a valid username or URL.`,
      };
    }

    const normalizedUrl = normalizeUrl(platform, url);

    try {
      const response = await fetch("/api/validate-social-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, url: normalizedUrl }),
      });

      const result = await response.json();

      if (!result.isValid) {
        return {
          isValid: false,
          error:
            result.error ||
            `This ${platform} profile appears to be unavailable or doesn't exist.`,
        };
      }

      return { isValid: true, error: "" };
    } catch (error) {
      console.warn(
        "Social link validation API failed, falling back to format validation"
      );
      return { isValid: true, error: "" };
    }
  };

  const handleInputChange = async (field: string, value: string) => {
    onUpdate({
      ...data,
      socialLinks: {
        ...data.socialLinks,
        [field]: value,
      },
    });

    setValidation((prev) => ({
      ...prev,
      [field]: { isValid: null, isValidating: true, error: "" },
    }));

    if (window.validationTimeouts?.[field]) {
      clearTimeout(window.validationTimeouts[field]);
    }

    if (!window.validationTimeouts) {
      window.validationTimeouts = {};
    }

    window.validationTimeouts[field] = setTimeout(async () => {
      const validationResult = await validateSocialLink(field, value);

      setValidation((prev) => ({
        ...prev,
        [field]: {
          isValid: validationResult.isValid,
          isValidating: false,
          error: validationResult.error,
        },
      }));

      // Update with normalized URL if valid
      if (validationResult.isValid && value) {
        const normalizedUrl = normalizeUrl(field, value);
        if (normalizedUrl !== value) {
          onUpdate({
            ...data,
            socialLinks: {
              ...data.socialLinks,
              [field]: normalizedUrl,
            },
          });
        }
      }
    }, 1000);
  };

  const getValidationIcon = (field: string) => {
    const state = validation[field as keyof ValidationState];
    if (state.isValidating) {
      return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
    }
    if (state.isValid === true) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    if (state.isValid === false) {
      return <XCircle className="w-4 h-4 text-red-500" />;
    }
    return null;
  };

  const handlePhotoUpload = (url: string) => {
    handleInputChange("livePhotoUrl", url);
    setTimeout(() => {
      setCurrentStep("video");
    }, 1000);
  };

  const handleVideoUpload = (url: string) => {
    handleInputChange("introVideoUrl", url);
  };

  const goToPhotoStep = () => {
    setCurrentStep("photo");
  };

  const goToVideoStep = () => {
    setCurrentStep("video");
  };

  // Check if all social links are valid for form submission
  const allLinksValid = Object.values(validation).every(
    (state) => state.isValid !== false && !state.isValidating
  );

  return (
    <div className="space-y-8">
      {/* ...existing media capture code... */}
      <div className="space-y-4">
        <Label className="text-gray-700 font-medium text-lg">
          Media Capture
        </Label>

        <div className="flex items-center justify-center space-x-4 mb-6">
          <div
            className={`flex items-center space-x-2 ${
              currentStep === "photo" ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === "photo"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              1
            </div>
            <span className="font-medium">Photo</span>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400" />
          <div
            className={`flex items-center space-x-2 ${
              currentStep === "video" ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === "video"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              2
            </div>
            <span className="font-medium">Video</span>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div
            className={`transition-all duration-500 ease-in-out ${
              currentStep === "photo"
                ? "translate-x-0 opacity-100"
                : "translate-x-full opacity-0 absolute top-0 left-0 w-full"
            }`}
          >
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
                Take a live photo using your device camera to show your
                authentic self.
              </p>
            </div>
          </div>

          <div
            className={`transition-all duration-500 ease-in-out ${
              currentStep === "video"
                ? "translate-x-0 opacity-100"
                : "-translate-x-full opacity-0 absolute top-0 left-0 w-full"
            }`}
          >
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
                        <source
                          src={data.socialLinks.introVideoUrl}
                          type="video/mp4"
                        />
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
          <div className="space-y-2">
            <Label
              htmlFor="instagram"
              className="text-gray-700 font-medium flex items-center"
            >
              <Instagram className="w-4 h-4 mr-2 text-pink-500" />
              Instagram
            </Label>
            <div className="relative">
              <Input
                id="instagram"
                type="text"
                placeholder="@yourusername or instagram.com/yourusername"
                value={data.socialLinks?.instagram || ""}
                onChange={(e) => handleInputChange("instagram", e.target.value)}
                className={`h-12 border-gray-200 focus:border-pink-400 focus:ring-pink-400 pr-10 ${
                  validation.instagram.isValid === false
                    ? "border-red-400"
                    : validation.instagram.isValid === true
                    ? "border-green-400"
                    : ""
                }`}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {getValidationIcon("instagram")}
              </div>
            </div>
            {validation.instagram.error && (
              <p className="text-xs text-red-600">
                {validation.instagram.error}
              </p>
            )}
            <p className="text-xs text-gray-500">
              Share your Instagram to show your photos and lifestyle
            </p>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="spotify"
              className="text-gray-700 font-medium flex items-center"
            >
              <Music className="w-4 h-4 mr-2 text-green-500" />
              Spotify
            </Label>
            <div className="relative">
              <Input
                id="spotify"
                type="text"
                placeholder="Your Spotify username or profile URL"
                value={data.socialLinks?.spotify || ""}
                onChange={(e) => handleInputChange("spotify", e.target.value)}
                className={`h-12 border-gray-200 focus:border-pink-400 focus:ring-pink-400 pr-10 ${
                  validation.spotify.isValid === false
                    ? "border-red-400"
                    : validation.spotify.isValid === true
                    ? "border-green-400"
                    : ""
                }`}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {getValidationIcon("spotify")}
              </div>
            </div>
            {validation.spotify.error && (
              <p className="text-xs text-red-600">{validation.spotify.error}</p>
            )}
            <p className="text-xs text-gray-500">
              Let others see your music taste and favorite artists
            </p>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="linkedin"
              className="text-gray-700 font-medium flex items-center"
            >
              <Linkedin className="w-4 h-4 mr-2 text-blue-600" />
              LinkedIn or Personal Website
            </Label>
            <div className="relative">
              <Input
                id="linkedin"
                type="text"
                placeholder="LinkedIn profile or personal website URL"
                value={data.socialLinks?.linkedin || ""}
                onChange={(e) => handleInputChange("linkedin", e.target.value)}
                className={`h-12 border-gray-200 focus:border-pink-400 focus:ring-pink-400 pr-10 ${
                  validation.linkedin.isValid === false
                    ? "border-red-400"
                    : validation.linkedin.isValid === true
                    ? "border-green-400"
                    : ""
                }`}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {getValidationIcon("linkedin")}
              </div>
            </div>
            {validation.linkedin.error && (
              <p className="text-xs text-red-600">
                {validation.linkedin.error}
              </p>
            )}
            <p className="text-xs text-gray-500">
              Share your professional profile or personal website
            </p>
          </div>

          {/* Validation Status Summary */}
          {Object.values(validation).some((state) => state.isValidating) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center text-blue-700">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <span className="text-sm">Validating social links...</span>
              </div>
            </div>
          )}

          {!allLinksValid &&
            Object.values(validation).some(
              (state) => state.isValid === false
            ) && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center text-red-700">
                  <XCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    Please fix the invalid social links above
                  </span>
                </div>
              </div>
            )}

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
              <li>
                • All links are validated to ensure they're real and accessible
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* ...existing completion card... */}
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

declare global {
  interface Window {
    validationTimeouts?: { [key: string]: NodeJS.Timeout };
  }
}
