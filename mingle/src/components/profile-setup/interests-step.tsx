"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Heart,
  Music,
  Camera,
  Plane,
  Book,
  Gamepad2,
  Dumbbell,
  Utensils,
  Palette,
  Code,
  Mountain,
  Coffee,
  Film,
  Headphones,
  Car,
  Waves,
  TreePine,
  Sparkles,
} from "lucide-react"

interface InterestsStepProps {
  data: any
  onUpdate: (data: any) => void
}

export default function InterestsStep({ data, onUpdate }: InterestsStepProps) {
  const interestCategories = [
    {
      category: "Entertainment & Media",
      interests: [
        { name: "Music", icon: <Music className="w-4 h-4" /> },
        { name: "Movies", icon: <Film className="w-4 h-4" /> },
        { name: "Gaming", icon: <Gamepad2 className="w-4 h-4" /> },
        { name: "Reading", icon: <Book className="w-4 h-4" /> },
        { name: "Podcasts", icon: <Headphones className="w-4 h-4" /> },
        { name: "Netflix", icon: <Film className="w-4 h-4" /> },
        { name: "Anime", icon: <Sparkles className="w-4 h-4" /> },
        { name: "Art", icon: <Palette className="w-4 h-4" /> },
      ],
    },
    {
      category: "Outdoor & Adventure",
      interests: [
        { name: "Travel", icon: <Plane className="w-4 h-4" /> },
        { name: "Hiking", icon: <Mountain className="w-4 h-4" /> },
        { name: "Beach", icon: <Waves className="w-4 h-4" /> },
        { name: "Camping", icon: <TreePine className="w-4 h-4" /> },
        { name: "Road Trips", icon: <Car className="w-4 h-4" /> },
        { name: "Photography", icon: <Camera className="w-4 h-4" /> },
        { name: "Nature", icon: <TreePine className="w-4 h-4" /> },
      ],
    },
    {
      category: "Health & Fitness",
      interests: [
        { name: "Fitness", icon: <Dumbbell className="w-4 h-4" /> },
        { name: "Yoga", icon: <Heart className="w-4 h-4" /> },
        { name: "Running", icon: <Dumbbell className="w-4 h-4" /> },
        { name: "Gym", icon: <Dumbbell className="w-4 h-4" /> },
        { name: "Swimming", icon: <Waves className="w-4 h-4" /> },
        { name: "Meditation", icon: <Heart className="w-4 h-4" /> },
        { name: "Dancing", icon: <Music className="w-4 h-4" /> },
      ],
    },
    {
      category: "Food & Lifestyle",
      interests: [
        { name: "Cooking", icon: <Utensils className="w-4 h-4" /> },
        { name: "Foodie", icon: <Utensils className="w-4 h-4" /> },
        { name: "Coffee", icon: <Coffee className="w-4 h-4" /> },
        { name: "Wine", icon: <Coffee className="w-4 h-4" /> },
        { name: "Baking", icon: <Utensils className="w-4 h-4" /> },
        { name: "Restaurants", icon: <Utensils className="w-4 h-4" /> },
      ],
    },
    {
      category: "Technology & Learning",
      interests: [
        { name: "Tech", icon: <Code className="w-4 h-4" /> },
        { name: "Startups", icon: <Code className="w-4 h-4" /> },
        { name: "Science", icon: <Book className="w-4 h-4" /> },
        { name: "Learning", icon: <Book className="w-4 h-4" /> },
        { name: "Innovation", icon: <Sparkles className="w-4 h-4" /> },
      ],
    },
    {
      category: "Social & Community",
      interests: [
        { name: "Volunteering", icon: <Heart className="w-4 h-4" /> },
        { name: "Socializing", icon: <Heart className="w-4 h-4" /> },
        { name: "Networking", icon: <Heart className="w-4 h-4" /> },
        { name: "Events", icon: <Heart className="w-4 h-4" /> },
        { name: "Parties", icon: <Music className="w-4 h-4" /> },
      ],
    },
  ]

  const MAX_INTERESTS = 7

  const handleInterestToggle = (interest: string) => {
    const current = data.interests || []

    if (current.includes(interest)) {
      // Remove interest
      const updated = current.filter((i: string) => i !== interest)
      onUpdate({ interests: updated })
    } else if (current.length < MAX_INTERESTS) {
      // Add interest if under limit
      const updated = [...current, interest]
      onUpdate({ interests: updated })
    }
  }

  const selectedCount = data.interests?.length || 0

  return (
    <div className="space-y-8">
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-800">
            <Heart className="w-5 h-5 mr-2 text-pink-500" />
            Your Interests
          </CardTitle>
          <p className="text-sm text-gray-600">
            Select up to {MAX_INTERESTS} interests that represent you. This helps us find people with similar passions.
          </p>
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Selected: {selectedCount}/{MAX_INTERESTS} interests
            </p>
            {selectedCount >= MAX_INTERESTS && (
              <p className="text-xs text-amber-600 font-medium">Maximum interests selected</p>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {interestCategories.map((category) => (
            <div key={category.category} className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">{category.category}</h3>
              <div className="flex flex-wrap gap-3">
                {category.interests.map((interest) => {
                  const isSelected = data.interests?.includes(interest.name)
                  const canSelect = selectedCount < MAX_INTERESTS || isSelected

                  return (
                    <Badge
                      key={interest.name}
                      variant={isSelected ? "default" : "outline"}
                      className={`cursor-pointer px-4 py-3 text-sm transition-all flex items-center space-x-2 ${
                        isSelected
                          ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
                          : canSelect
                            ? "border-gray-300 text-gray-600 hover:border-pink-400 hover:text-pink-600"
                            : "border-gray-200 text-gray-400 cursor-not-allowed opacity-50"
                      }`}
                      onClick={() => canSelect && handleInterestToggle(interest.name)}
                    >
                      {interest.icon}
                      <span>{interest.name}</span>
                    </Badge>
                  )
                })}
              </div>
            </div>
          ))}

          {/* Selection Summary */}
          {selectedCount > 0 && (
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
              <h4 className="font-medium text-pink-800 mb-2">Your Selected Interests:</h4>
              <div className="flex flex-wrap gap-2">
                {data.interests.map((interest: string) => (
                  <Badge key={interest} className="bg-pink-100 text-pink-700 hover:bg-pink-200">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {selectedCount === MAX_INTERESTS && (
            <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 font-medium">
                Perfect! You've selected {MAX_INTERESTS} interests. Your profile is looking great! ✨
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
