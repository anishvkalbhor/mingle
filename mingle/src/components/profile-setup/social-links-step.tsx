"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Instagram, Music, Linkedin, ExternalLink } from "lucide-react"
import VideoRecorder from "../VideoRecorder"

interface SocialLinksStepProps {
  data: any
  onUpdate: (data: any) => void
}

export default function SocialLinksStep({ data, onUpdate }: SocialLinksStepProps) {
  const handleInputChange = (field: string, value: string) => {
    onUpdate({
      ...data,
      socialLinks: {
        ...data.socialLinks,
        [field]: value,
      },
    })
  }

  return (
    <div className="space-y-8">
      {/* Intro Video Upload Section */}
<div className="space-y-2">
  <Label className="text-gray-700 font-medium">Intro Video (30s Max)</Label>

  {!data.socialLinks?.introVideoUrl ? (
    <VideoRecorder onUpload={(url) => handleInputChange("introVideoUrl", url)} />
  ) : (
    <div className="space-y-2 flex justify-center items-center flex-col">
      <video controls className="w-1/2 rounded-md">
        <source src={data.socialLinks.introVideoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <button
        onClick={() => handleInputChange("introVideoUrl", "")}
        className="text-sm cursor-pointer bg-black text-white p-2 rounded-md backdrop-blur-sm"
      >
        Remove video
      </button>
    </div>
  )}

  <p className="text-sm text-gray-500">
    Record or upload a short video to introduce yourself. Recommended duration: under 30 seconds.
  </p>
</div>

      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-800">
            <ExternalLink className="w-5 h-5 mr-2 text-pink-500" />
            Social Links
          </CardTitle>
          <p className="text-sm text-gray-600">
            Connect your social accounts to show more of your personality (all optional)
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Instagram */}
          <div className="space-y-2">
            <Label htmlFor="instagram" className="text-gray-700 font-medium flex items-center">
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
            <p className="text-xs text-gray-500">Share your Instagram to show your photos and lifestyle</p>
          </div>

          {/* Spotify */}
          <div className="space-y-2">
            <Label htmlFor="spotify" className="text-gray-700 font-medium flex items-center">
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
            <p className="text-xs text-gray-500">Let others see your music taste and favorite artists</p>
          </div>

          {/* LinkedIn */}
          <div className="space-y-2">
            <Label htmlFor="linkedin" className="text-gray-700 font-medium flex items-center">
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
            <p className="text-xs text-gray-500">Share your professional profile or personal website</p>
          </div>

          {/* Privacy Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">Privacy & Safety</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Your social links are only visible to your matches</li>
              <li>• You can hide or remove these links anytime from your profile</li>
              <li>• We never post on your behalf or access private information</li>
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
          <h3 className="text-xl font-bold text-gray-800 mb-2">You're Almost Done! 🎉</h3>
          <p className="text-gray-600 mb-4">
            Your profile is looking amazing! Click "Complete Setup" to start finding your perfect matches.
          </p>
          <p className="text-sm text-gray-500">You can always edit your profile later from your dashboard.</p>
        </CardContent>
      </Card>
    </div>
  )
}
