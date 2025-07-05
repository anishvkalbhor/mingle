"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required"
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

      // Check if user account exists
      const userAccounts = JSON.parse(localStorage.getItem("userAccounts") || "{}")
      const userAccount = userAccounts[formData.email]

      if (!userAccount) {
        setErrors({ email: "No account found, Signup first." })
        setIsLoading(false)
        return
      }

      // Verify password
      if (userAccount.password !== formData.password) {
        setErrors({ password: "Incorrect password" })
        setIsLoading(false)
        return
      }

      // Set current user session
      localStorage.setItem("currentUser", formData.email)
      localStorage.setItem("isLoggedIn", "true")

      // Check if user has completed profile setup
      const accountKey = `account_${formData.email}`
      const completeData = localStorage.getItem(`${accountKey}_completeProfileData`)
      const setupData = localStorage.getItem(`${accountKey}_profileSetupData`)

      if (completeData || setupData) {
        // User has some profile data, go to dashboard
        router.push("/")
      } else {
        router.push("/")
      }
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-sm sm:text-base text-gray-600 px-2">
            Sign in to continue your journey to meaningful connections
          </p>
        </div>

        {/* Login Form */}
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4 sm:pb-6">
            <CardTitle className="text-center text-lg sm:text-xl text-gray-800">Sign In</CardTitle>
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
                  <p className="text-red-600 text-xs sm:text-sm flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                    {errors.email}
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
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={`pl-10 pr-10 h-10 sm:h-12 text-sm sm:text-base border-gray-200 focus:border-pink-300 focus:ring-pink-200 ${
                      errors.password ? "border-red-300 focus:border-red-300 focus:ring-red-200" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-600 text-xs sm:text-sm flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link href="/forgot-password" className="text-xs sm:text-sm text-pink-600 hover:text-pink-700">
                  Forgot your password?
                </Link>
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
                    <span>Signing In...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </form>

            {/* Signup Link */}
            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-sm sm:text-base text-gray-600">
                Don't have an account?{" "}
                <Link href="/signup" className="text-pink-600 hover:text-pink-700 font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">Welcome back to Mingle:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="outline" className="border-pink-200 text-pink-700 text-xs sm:text-sm">
              Your Matches Await
            </Badge>
            <Badge variant="outline" className="border-purple-200 text-purple-700 text-xs sm:text-sm">
              New Messages
            </Badge>
            <Badge variant="outline" className="border-pink-200 text-pink-700 text-xs sm:text-sm">
              Profile Views
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
