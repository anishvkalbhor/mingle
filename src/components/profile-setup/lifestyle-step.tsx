"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Briefcase, Wine, Cigarette, Church, Star, Vote } from "lucide-react"

interface LifestyleStepProps {
  data: any
  onUpdate: (data: any) => void
}

export default function LifestyleStep({ data, onUpdate }: LifestyleStepProps) {
  const drinkingOptions = ["Never", "Occasionally", "Often"]
  const smokingOptions = ["Never", "Occasionally", "Often"]
  const religionOptions = ["Hindu", "Muslim", "Christian", "Jewish", "Atheist", "Spiritual", "Other"]
  const zodiacOptions = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
  ]
  const politicsOptions = ["Liberal", "Moderate", "Conservative", "Apolitical", "Other"]

  const handleInputChange = (field: string, value: any) => {
    onUpdate({ [field]: value })
  }

  return (
    <div className="space-y-8">
      {/* Professional Information */}
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-800">
            <Briefcase className="w-5 h-5 mr-2 text-pink-500" />
            Professional Information
          </CardTitle>
          <p className="text-sm text-gray-600">Tell us about your career and education</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="jobTitle" className="text-gray-700 font-medium">
              Job Title
            </Label>
            <Input
              id="jobTitle"
              type="text"
              placeholder="e.g., Software Engineer, Teacher, Student"
              value={data.jobTitle || ""}
              onChange={(e) => handleInputChange("jobTitle", e.target.value)}
              className="h-12 border-gray-200 focus:border-pink-400 focus:ring-pink-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="education" className="text-gray-700 font-medium">
              Education
            </Label>
            <Input
              id="education"
              type="text"
              placeholder="e.g., Bachelor's in Computer Science, High School"
              value={data.education || ""}
              onChange={(e) => handleInputChange("education", e.target.value)}
              className="h-12 border-gray-200 focus:border-pink-400 focus:ring-pink-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lifestyle Habits */}
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-800">
            <Wine className="w-5 h-5 mr-2 text-pink-500" />
            Lifestyle Habits
          </CardTitle>
          <p className="text-sm text-gray-600">Share your lifestyle preferences</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="text-gray-700 font-medium flex items-center">
              <Wine className="w-4 h-4 mr-2" />
              Drinking
            </Label>
            <div className="flex flex-wrap gap-2">
              {drinkingOptions.map((option) => (
                <Badge
                  key={option}
                  variant={data.drinking === option ? "default" : "outline"}
                  className={`cursor-pointer px-4 py-2 text-sm transition-all ${
                    data.drinking === option
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
                      : "border-gray-300 text-gray-600 hover:border-pink-400 hover:text-pink-600"
                  }`}
                  onClick={() => handleInputChange("drinking", option)}
                >
                  {option}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-gray-700 font-medium flex items-center">
              <Cigarette className="w-4 h-4 mr-2" />
              Smoking
            </Label>
            <div className="flex flex-wrap gap-2">
              {smokingOptions.map((option) => (
                <Badge
                  key={option}
                  variant={data.smoking === option ? "default" : "outline"}
                  className={`cursor-pointer px-4 py-2 text-sm transition-all ${
                    data.smoking === option
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
                      : "border-gray-300 text-gray-600 hover:border-pink-400 hover:text-pink-600"
                  }`}
                  onClick={() => handleInputChange("smoking", option)}
                >
                  {option}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Beliefs */}
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-800">
            <Church className="w-5 h-5 mr-2 text-pink-500" />
            Personal Beliefs
          </CardTitle>
          <p className="text-sm text-gray-600">Share your beliefs and values</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="text-gray-700 font-medium">Religion</Label>
            <div className="flex flex-wrap gap-2">
              {religionOptions.map((option) => (
                <Badge
                  key={option}
                  variant={data.religion === option ? "default" : "outline"}
                  className={`cursor-pointer px-4 py-2 text-sm transition-all ${
                    data.religion === option
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
                      : "border-gray-300 text-gray-600 hover:border-pink-400 hover:text-pink-600"
                  }`}
                  onClick={() => handleInputChange("religion", option)}
                >
                  {option}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-gray-700 font-medium flex items-center">
              <Star className="w-4 h-4 mr-2" />
              Zodiac Sign
            </Label>
            <Select value={data.zodiacSign || ""} onValueChange={(value:any) => handleInputChange("zodiacSign", value)}>
              <SelectTrigger className="h-12 border-gray-200 focus:border-pink-400 focus:ring-pink-400">
                <SelectValue placeholder="Select your zodiac sign" />
              </SelectTrigger>
              <SelectContent>
                {zodiacOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-gray-700 font-medium flex items-center">
              <Vote className="w-4 h-4 mr-2" />
              Politics
            </Label>
            <div className="flex flex-wrap gap-2">
              {politicsOptions.map((option) => (
                <Badge
                  key={option}
                  variant={data.politics === option ? "default" : "outline"}
                  className={`cursor-pointer px-4 py-2 text-sm transition-all ${
                    data.politics === option
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
                      : "border-gray-300 text-gray-600 hover:border-pink-400 hover:text-pink-600"
                  }`}
                  onClick={() => handleInputChange("politics", option)}
                >
                  {option}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
