"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, User, Mail, Lock, Calendar, ArrowRight, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    gender: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const genderOptions = ["Male", "Female", "Non-binary", "Other"]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Check if email already exists
    const userAccounts = JSON.parse(localStorage.getItem("userAccounts") || "{}")
    if (userAccounts[formData.email]) {
      newErrors.email = "An account with this email already exists. Please use a different email or login."
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long"
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    // Date of birth validation
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required"
    } else {
      const today = new Date()
      const birthDate = new Date(formData.dateOfBirth)
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }

      if (age < 18) {
        newErrors.dateOfBirth = "You must be at least 18 years old to sign up"
      }
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = "Please select your gender"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Store user account with account-specific key
      const userAccounts = JSON.parse(localStorage.getItem("userAccounts") || "{}")
      userAccounts[formData.email] = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password, // In real app, this would be hashed
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        createdAt: new Date().toISOString(),
        profileComplete: false,
      }
      localStorage.setItem("userAccounts", JSON.stringify(userAccounts))

      // Store basic signup data with account-specific key
      const accountKey = `account_${formData.email}`
      const basicSignupData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
      }
      localStorage.setItem(`${accountKey}_basicSignupData`, JSON.stringify(basicSignupData))

      // Set current user session
      localStorage.setItem("currentUser", formData.email)
      localStorage.setItem("isLoggedIn", "true")

      // Redirect to profile setup
      router.push("/profile/setup")
    } catch (error) {
      setErrors({ general: "Something went wrong. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-4 sm:py-8 px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-pink-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-20 sm:-bottom-40 -left-20 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="max-w-md mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-4 sm:mb-6">
            <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-pink-500 fill-current" />
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Mingle
            </span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Create Your Account</h1>
          <p className="text-sm sm:text-base text-gray-600 px-2">
            Join thousands of people finding meaningful connections
          </p>
        </div>

        {/* Signup Form */}
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4 sm:pb-6">
            <CardTitle className="text-center text-lg sm:text-xl text-gray-800">Sign Up</CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* General Error */}
              {errors.general && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{errors.general}</span>
                </div>
              )}

              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm sm:text-base text-gray-700 font-medium">
                    First Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className={`pl-10 h-10 sm:h-12 text-sm sm:text-base border-gray-200 focus:border-pink-300 focus:ring-pink-200 ${
                        errors.firstName ? "border-red-300 focus:border-red-300 focus:ring-red-200" : ""
                      }`}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-red-600 text-xs sm:text-sm flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm sm:text-base text-gray-700 font-medium">
                    Last Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className={`pl-10 h-10 sm:h-12 text-sm sm:text-base border-gray-200 focus:border-pink-300 focus:ring-pink-200 ${
                        errors.lastName ? "border-red-300 focus:border-red-300 focus:ring-red-200" : ""
                      }`}
                    />
                  </div>
                  {errors.lastName && (
                    <p className="text-red-600 text-xs sm:text-sm flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm sm:text-base text-gray-700 font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`pl-10 h-10 sm:h-12 text-sm sm:text-base border-gray-200 focus:border-pink-300 focus:ring-pink-200 ${
                      errors.email ? "border-red-300 focus:border-red-300 focus:ring-red-200" : ""
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-600 text-xs sm:text-sm flex items-start">
                    <AlertCircle className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm sm:text-base text-gray-700 font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={`pl-10 h-10 sm:h-12 text-sm sm:text-base border-gray-200 focus:border-pink-300 focus:ring-pink-200 ${
                      errors.password ? "border-red-300 focus:border-red-300 focus:ring-red-200" : ""
                    }`}
                  />
                </div>
                {errors.password && (
                  <p className="text-red-600 text-xs sm:text-sm flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm sm:text-base text-gray-700 font-medium">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className={`pl-10 h-10 sm:h-12 text-sm sm:text-base border-gray-200 focus:border-pink-300 focus:ring-pink-200 ${
                      errors.confirmPassword ? "border-red-300 focus:border-red-300 focus:ring-red-200" : ""
                    }`}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-600 text-xs sm:text-sm flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="text-sm sm:text-base text-gray-700 font-medium">
                  Date of Birth
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    className={`pl-10 h-10 sm:h-12 text-sm sm:text-base border-gray-200 focus:border-pink-300 focus:ring-pink-200 ${
                      errors.dateOfBirth ? "border-red-300 focus:border-red-300 focus:ring-red-200" : ""
                    }`}
                  />
                </div>
                {errors.dateOfBirth && (
                  <p className="text-red-600 text-xs sm:text-sm flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                    {errors.dateOfBirth}
                  </p>
                )}
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label className="text-sm sm:text-base text-gray-700 font-medium">Gender</Label>
                <div className="grid grid-cols-2 gap-2">
                  {genderOptions.map((gender) => (
                    <button
                      key={gender}
                      type="button"
                      onClick={() => handleInputChange("gender", gender)}
                      className={`p-2 sm:p-3 rounded-lg border text-xs sm:text-sm font-medium transition-all ${
                        formData.gender === gender
                          ? "border-pink-300 bg-pink-50 text-pink-700"
                          : "border-gray-200 text-gray-600 hover:border-pink-200 hover:bg-pink-50"
                      } ${errors.gender ? "border-red-300" : ""}`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
                {errors.gender && (
                  <p className="text-red-600 text-xs sm:text-sm flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                    {errors.gender}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium py-2 sm:py-3 h-10 sm:h-12 text-sm sm:text-base"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </form>

            {/* Login Link */}
            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-sm sm:text-base text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-pink-600 hover:text-pink-700 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">Join Mingle and enjoy:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="outline" className="border-pink-200 text-pink-700 text-xs sm:text-sm">
              Smart Matching
            </Badge>
            <Badge variant="outline" className="border-purple-200 text-purple-700 text-xs sm:text-sm">
              Safe & Secure
            </Badge>
            <Badge variant="outline" className="border-pink-200 text-pink-700 text-xs sm:text-sm">
              Real Connections
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
