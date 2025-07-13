"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Camera,
  Upload,
  User,
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Home,
  Briefcase,
  Eye,
  EyeOff,
} from "lucide-react"

interface BasicInfoEditFormProps {
  onDataChange: () => void
}

export default function BasicInfoEditForm({ onDataChange }: BasicInfoEditFormProps) {
  const [profilePicture, setProfilePicture] = useState<File | null>(null)
  const [profilePicturePreview, setProfilePicturePreview] = useState<string>("")
  const [showIncome, setShowIncome] = useState(true)

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    age: "",
    gender: "",
    mobileNo: "",
    email: "",
    location: "",
    username: "",
    bio: "",
    socialLinks: {
      instagram: "",
      facebook: "",
      linkedin: "",
      twitter: "",
    },
    exactCity: "",
    livesWithFamily: "",
    familyLocation: "",
    maritalStatus: "",
    diet: "",
    heightFeet: "",
    heightInches: "",
    religion: "",
    education: "",
    occupation: "",
    income: "",
    hideIncome: false,
  })

  useEffect(() => {
    // Load existing profile data
    const existingData = localStorage.getItem("completeProfileData")
    if (existingData) {
      const data = JSON.parse(existingData)
      setFormData({ ...formData, ...data })
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    onDataChange()
  }

  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData({
      ...formData,
      socialLinks: {
        ...formData.socialLinks,
        [platform]: value,
      },
    })
    onDataChange()
  }

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfilePicture(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      onDataChange()
    }
  }

  const handleDietSelect = (dietOption: string) => {
    setFormData({
      ...formData,
      diet: dietOption,
    })
    onDataChange()
  }

  const dietOptions = [
    { value: "veg", label: "Veg" },
    { value: "non-veg", label: "Non-Veg" },
    { value: "occasionally-non-veg", label: "Occasionally Non-Veg" },
    { value: "eggetarian", label: "Eggetarian" },
    { value: "jain", label: "Jain" },
    { value: "vegan", label: "Vegan" },
  ]

  return (
    <div className="space-y-8">
      {/* Profile Picture Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Camera className="w-5 h-5 text-pink-500" />
          <h3 className="text-lg font-semibold text-gray-800">Profile Picture</h3>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="w-32 h-32 border-4 border-pink-200">
              <AvatarImage src={profilePicturePreview || "/placeholder.svg?height=128&width=128"} alt="Profile" />
              <AvatarFallback className="text-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                {formData.firstName[0] || "U"}
                {formData.lastName[0] || ""}
              </AvatarFallback>
            </Avatar>
            <label
              htmlFor="profilePicture"
              className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:from-pink-600 hover:to-purple-700 transition-all"
            >
              <Upload className="w-5 h-5 text-white" />
            </label>
            <input
              id="profilePicture"
              type="file"
              accept="image/*"
              onChange={handleProfilePictureChange}
              className="hidden"
            />
          </div>
          <p className="text-sm text-gray-500 text-center">
            Upload a clear photo of yourself
            <br />
            <span className="text-xs">JPG, PNG up to 5MB</span>
          </p>
        </div>
      </div>

      {/* Personal Information */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2 mb-4">
          <User className="w-5 h-5 text-pink-500" />
          <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-gray-700 font-medium">
              First Name *
            </Label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="First name"
              value={formData.firstName}
              onChange={handleInputChange}
              className="h-12 border-gray-200 focus:border-pink-400 focus:ring-pink-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-gray-700 font-medium">
              Last Name *
            </Label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Last name"
              value={formData.lastName}
              onChange={handleInputChange}
              className="h-12 border-gray-200 focus:border-pink-400 focus:ring-pink-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="age" className="text-gray-700 font-medium">
              Age *
            </Label>
            <Input
              id="age"
              name="age"
              type="number"
              min="18"
              max="100"
              placeholder="Age"
              value={formData.age}
              onChange={handleInputChange}
              className="h-12 border-gray-200 focus:border-pink-400 focus:ring-pink-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender" className="text-gray-700 font-medium">
              Gender *
            </Label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full h-12 border border-gray-200 rounded-md px-3 py-2 focus:border-pink-400 focus:ring-pink-400 focus:ring-1 focus:outline-none bg-white"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="username" className="text-gray-700 font-medium">
            Username *
          </Label>
          <Input
            id="username"
            name="username"
            type="text"
            placeholder="Choose a unique username"
            value={formData.username}
            onChange={handleInputChange}
            className="h-12 border-gray-200 focus:border-pink-400 focus:ring-pink-400"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio" className="text-gray-700 font-medium">
            About Me *
          </Label>
          <Textarea
            id="bio"
            name="bio"
            placeholder="Tell us about yourself, your interests, what you're looking for..."
            value={formData.bio}
            onChange={handleInputChange}
            className="min-h-[100px] border-gray-200 focus:border-pink-400 focus:ring-pink-400 resize-none"
            maxLength={500}
          />
          <p className="text-xs text-gray-500 text-right">{formData.bio.length}/500 characters</p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2 mb-4">
          <Phone className="w-5 h-5 text-pink-500" />
          <h3 className="text-lg font-semibold text-gray-800">Contact Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 font-medium">
              Email Address *
            </Label>
            <div className="relative">
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleInputChange}
                className="h-12 border-gray-200 focus:border-pink-400 focus:ring-pink-400 pl-12"
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobileNo" className="text-gray-700 font-medium">
              Mobile Number *
            </Label>
            <div className="relative">
              <Input
                id="mobileNo"
                name="mobileNo"
                type="tel"
                placeholder="Enter your mobile number"
                value={formData.mobileNo}
                onChange={handleInputChange}
                className="h-12 border-gray-200 focus:border-pink-400 focus:ring-pink-400 pl-12"
              />
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="exactCity" className="text-gray-700 font-medium">
            Location *
          </Label>
          <div className="relative">
            <Input
              id="exactCity"
              name="exactCity"
              type="text"
              placeholder="Enter your exact city"
              value={formData.exactCity}
              onChange={handleInputChange}
              className="h-12 border-gray-200 focus:border-pink-400 focus:ring-pink-400 pl-12"
            />
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Personal Details */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2 mb-4">
          <Home className="w-5 h-5 text-pink-500" />
          <h3 className="text-lg font-semibold text-gray-800">Personal Details</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="maritalStatus" className="text-gray-700 font-medium">
              Marital Status *
            </Label>
            <select
              id="maritalStatus"
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleInputChange}
              className="w-full h-12 border border-gray-200 rounded-md px-3 py-2 focus:border-pink-400 focus:ring-pink-400 focus:ring-1 focus:outline-none bg-white"
            >
              <option value="">Select marital status</option>
              <option value="single">Single</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
              <option value="separated">Separated</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="religion" className="text-gray-700 font-medium">
              Religion *
            </Label>
            <select
              id="religion"
              name="religion"
              value={formData.religion}
              onChange={handleInputChange}
              className="w-full h-12 border border-gray-200 rounded-md px-3 py-2 focus:border-pink-400 focus:ring-pink-400 focus:ring-1 focus:outline-none bg-white"
            >
              <option value="">Select religion</option>
              <option value="hindu">Hindu</option>
              <option value="muslim">Muslim</option>
              <option value="christian">Christian</option>
              <option value="sikh">Sikh</option>
              <option value="buddhist">Buddhist</option>
              <option value="jain">Jain</option>
              <option value="parsi">Parsi</option>
              <option value="jewish">Jewish</option>
              <option value="bahai">Bahai</option>
              <option value="other">Other</option>
              <option value="no-religion">No Religion</option>
            </select>
          </div>
        </div>

        {/* Diet Selection */}
        <div className="space-y-2">
          <Label className="text-gray-700 font-medium">Your Diet *</Label>
          <div className="flex flex-wrap gap-2">
            {dietOptions.map((option) => (
              <Badge
                key={option.value}
                variant={formData.diet === option.value ? "default" : "outline"}
                className={`cursor-pointer px-4 py-2 text-sm transition-all ${
                  formData.diet === option.value
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
                    : "border-gray-300 text-gray-600 hover:border-pink-400 hover:text-pink-600"
                }`}
                onClick={() => handleDietSelect(option.value)}
              >
                {option.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Height */}
        <div className="space-y-2">
          <Label className="text-gray-700 font-medium">Height *</Label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <select
                name="heightFeet"
                value={formData.heightFeet}
                onChange={handleInputChange}
                className="w-full h-12 border border-gray-200 rounded-md px-3 py-2 focus:border-pink-400 focus:ring-pink-400 focus:ring-1 focus:outline-none bg-white"
              >
                <option value="">Feet</option>
                {[4, 5, 6, 7].map((feet) => (
                  <option key={feet} value={feet}>
                    {feet} ft
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                name="heightInches"
                value={formData.heightInches}
                onChange={handleInputChange}
                className="w-full h-12 border border-gray-200 rounded-md px-3 py-2 focus:border-pink-400 focus:ring-pink-400 focus:ring-1 focus:outline-none bg-white"
              >
                <option value="">Inches</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i}>
                    {i} in
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Information */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2 mb-4">
          <Briefcase className="w-5 h-5 text-pink-500" />
          <h3 className="text-lg font-semibold text-gray-800">Professional Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="education" className="text-gray-700 font-medium">
              Highest Education *
            </Label>
            <select
              id="education"
              name="education"
              value={formData.education}
              onChange={handleInputChange}
              className="w-full h-12 border border-gray-200 rounded-md px-3 py-2 focus:border-pink-400 focus:ring-pink-400 focus:ring-1 focus:outline-none bg-white"
            >
              <option value="">Select education level</option>
              <option value="high-school">High School</option>
              <option value="diploma">Diploma</option>
              <option value="bachelors">Bachelor's Degree</option>
              <option value="masters">Master's Degree</option>
              <option value="phd">PhD/Doctorate</option>
              <option value="professional">Professional Degree</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="occupation" className="text-gray-700 font-medium">
              Occupation *
            </Label>
            <Input
              id="occupation"
              name="occupation"
              type="text"
              placeholder="Enter your occupation"
              value={formData.occupation}
              onChange={handleInputChange}
              className="h-12 border-gray-200 focus:border-pink-400 focus:ring-pink-400"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="income" className="text-gray-700 font-medium">
              Annual Income *
            </Label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, hideIncome: !formData.hideIncome })
                  onDataChange()
                }}
                className="text-sm text-pink-500 hover:text-pink-600 flex items-center"
              >
                {formData.hideIncome ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                {formData.hideIncome ? "Hidden from profile" : "Visible on profile"}
              </button>
            </div>
          </div>
          <select
            id="income"
            name="income"
            value={formData.income}
            onChange={handleInputChange}
            className="w-full h-12 border border-gray-200 rounded-md px-3 py-2 focus:border-pink-400 focus:ring-pink-400 focus:ring-1 focus:outline-none bg-white"
          >
            <option value="">Select income range</option>
            <option value="0-3">₹0 - ₹3 Lakhs</option>
            <option value="3-5">₹3 - ₹5 Lakhs</option>
            <option value="5-7">₹5 - ₹7 Lakhs</option>
            <option value="7-10">₹7 - ₹10 Lakhs</option>
            <option value="10-15">₹10 - ₹15 Lakhs</option>
            <option value="15-20">₹15 - ₹20 Lakhs</option>
            <option value="20-30">₹20 - ₹30 Lakhs</option>
            <option value="30-50">₹30 - ₹50 Lakhs</option>
            <option value="50+">₹50+ Lakhs</option>
          </select>
        </div>
      </div>

      {/* Social Links */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2 mb-4">
          <Instagram className="w-5 h-5 text-pink-500" />
          <h3 className="text-lg font-semibold text-gray-800">Social Links</h3>
          <span className="text-sm text-gray-500">(Optional)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="instagram" className="text-gray-700 font-medium flex items-center">
              <Instagram className="w-4 h-4 mr-2 text-pink-500" />
              Instagram
            </Label>
            <Input
              id="instagram"
              name="instagram"
              type="text"
              placeholder="@yourusername"
              value={formData.socialLinks.instagram}
              onChange={(e) => handleSocialLinkChange("instagram", e.target.value)}
              className="h-12 border-gray-200 focus:border-pink-400 focus:ring-pink-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="facebook" className="text-gray-700 font-medium flex items-center">
              <Facebook className="w-4 h-4 mr-2 text-blue-600" />
              Facebook
            </Label>
            <Input
              id="facebook"
              name="facebook"
              type="text"
              placeholder="facebook.com/yourprofile"
              value={formData.socialLinks.facebook}
              onChange={(e) => handleSocialLinkChange("facebook", e.target.value)}
              className="h-12 border-gray-200 focus:border-pink-400 focus:ring-pink-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedin" className="text-gray-700 font-medium flex items-center">
              <Linkedin className="w-4 h-4 mr-2 text-blue-700" />
              LinkedIn
            </Label>
            <Input
              id="linkedin"
              name="linkedin"
              type="text"
              placeholder="linkedin.com/in/yourprofile"
              value={formData.socialLinks.linkedin}
              onChange={(e) => handleSocialLinkChange("linkedin", e.target.value)}
              className="h-12 border-gray-200 focus:border-pink-400 focus:ring-pink-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="twitter" className="text-gray-700 font-medium flex items-center">
              <Twitter className="w-4 h-4 mr-2 text-blue-400" />
              Twitter
            </Label>
            <Input
              id="twitter"
              name="twitter"
              type="text"
              placeholder="@yourusername"
              value={formData.socialLinks.twitter}
              onChange={(e) => handleSocialLinkChange("twitter", e.target.value)}
              className="h-12 border-gray-200 focus:border-pink-400 focus:ring-pink-400"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
