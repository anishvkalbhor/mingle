"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Heart, Users, Target, MapPin } from "lucide-react"

interface PreferencesStepProps {
  data: any
  onUpdate: (data: any) => void
}

export default function PreferencesStep({ data, onUpdate }: PreferencesStepProps) {
  const showMeOptions = ["Men", "Women", "Everyone"]
  const lookingForOptions = ["Long-term", "Short-term", "Friends", "Casual", "Marriage", "Open to all"]

  const handleShowMeToggle = (option: string) => {
    const current = data.showMe || []
    const updated = current.includes(option) ? current.filter((o: string) => o !== option) : [...current, option]
    onUpdate({ showMe: updated })
  }

  const handleInputChange = (field: string, value: any) => {
    onUpdate({ [field]: value })
  }

  return (
    <div className="space-y-8">
      {/* Show Me */}
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-800">
            <Users className="w-5 h-5 mr-2 text-pink-500" />
            Show Me <span className="text-pink-500">*</span>
          </CardTitle>
          <p className="text-sm text-gray-600">Who would you like to see on Mingle?</p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {showMeOptions.map((option) => (
              <Badge
                key={option}
                variant={data.showMe?.includes(option) ? "default" : "outline"}
                className={`cursor-pointer px-6 py-3 text-base transition-all ${
                  data.showMe?.includes(option)
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
                    : "border-gray-300 text-gray-600 hover:border-pink-400 hover:text-pink-600"
                }`}
                onClick={() => handleShowMeToggle(option)}
              >
                {option}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Looking For */}
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-800">
            <Heart className="w-5 h-5 mr-2 text-pink-500" />
            Looking For <span className="text-pink-500">*</span>
          </CardTitle>
          <p className="text-sm text-gray-600">What type of relationship are you seeking?</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {lookingForOptions.map((option) => (
              <Badge
                key={option}
                variant={data.lookingFor === option ? "default" : "outline"}
                className={`cursor-pointer px-4 py-3 text-center text-sm transition-all ${
                  data.lookingFor === option
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
                    : "border-gray-300 text-gray-600 hover:border-pink-400 hover:text-pink-600"
                }`}
                onClick={() => handleInputChange("lookingFor", option)}
              >
                {option}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Age Range */}
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-800">
            <Target className="w-5 h-5 mr-2 text-pink-500" />
            Age Range
          </CardTitle>
          <p className="text-sm text-gray-600">What age range are you interested in?</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-gray-700 font-medium">Age Range</Label>
              <span className="text-sm text-gray-600">
                {data.ageRange?.[0] || 18} - {data.ageRange?.[1] || 35} years
              </span>
            </div>
            <Slider
              value={data.ageRange || [18, 35]}
              onValueChange={(value:any) => handleInputChange("ageRange", value)}
              min={18}
              max={60}
              step={1}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Distance Range */}
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-800">
            <MapPin className="w-5 h-5 mr-2 text-pink-500" />
            Distance Range
          </CardTitle>
          <p className="text-sm text-gray-600">How far are you willing to travel for a match?</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-gray-700 font-medium">Maximum Distance</Label>
              <span className="text-sm text-gray-600">{data.distanceRange || 25} km</span>
            </div>
            <Slider
              value={[data.distanceRange || 25]}
              onValueChange={(value:any) => handleInputChange("distanceRange", value[0])}
              min={1}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
