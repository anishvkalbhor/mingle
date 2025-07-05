"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Heart,
  Users,
  MessageCircle,
  Shield,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Globe,
  Smartphone,
  Download,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [userName, setUserName] = useState<string>("")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("currentUser")
    const loginStatus = localStorage.getItem("isLoggedIn")

    if (user && loginStatus === "true") {
      setIsLoggedIn(true)
      setCurrentUser(user)

      // Get user's name from profile data
      const accountKey = `account_${user}`
      const completeData = localStorage.getItem(`${accountKey}_completeProfileData`)
      const basicData = localStorage.getItem(`${accountKey}_basicSignupData`)
      const setupData = localStorage.getItem(`${accountKey}_profileSetupData`)

      let userData = null
      try {
        if (completeData) {
          userData = JSON.parse(completeData)
        } else if (setupData) {
          userData = JSON.parse(setupData)
        } else if (basicData) {
          userData = JSON.parse(basicData)
        }
      } catch (error) {
        console.error("Error parsing user data:", error)
      }

      if (userData) {
        const fullName = userData.fullName || `${userData.firstName || ""} ${userData.lastName || ""}`.trim()
        setUserName(fullName || user.split("@")[0])
      } else {
        setUserName(user.split("@")[0])
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    localStorage.removeItem("isLoggedIn")
    setIsLoggedIn(false)
    setCurrentUser(null)
    setUserName("")
    router.push("/")
  }

  const handleDeleteProfile = () => {
  if (!currentUser) return

  const keysToRemove = []
  const accountPrefix = `account_${currentUser}`

  // Remove all user-specific keys
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith(accountPrefix)) {
      keysToRemove.push(key)
    }
  }

  keysToRemove.forEach((key) => {
    localStorage.removeItem(key)
  })

  // Remove general profile data
  const generalKeys = [
    "basicSignupData",
    "completeProfileData",
    "profileSetupData",
    "editProfileData",
    "tempProfileData",
  ]

  generalKeys.forEach((key) => {
    const data = localStorage.getItem(key)
    if (data) {
      try {
        const parsedData = JSON.parse(data)
        if (parsedData.email === currentUser) {
          localStorage.removeItem(key)
        }
      } catch (error) {
        localStorage.removeItem(key)
      }
    }
  })

  // ❗️REMOVE from userAccounts
  const userAccounts = JSON.parse(localStorage.getItem("userAccounts") || "{}")
  if (userAccounts[currentUser]) {
    delete userAccounts[currentUser]
    localStorage.setItem("userAccounts", JSON.stringify(userAccounts))
  }

  // Remove session keys
  localStorage.removeItem("currentUser")
  localStorage.removeItem("isLoggedIn")
  localStorage.removeItem("showProfileSetupPopup")

  // Reset state
  setIsLoggedIn(false)
  setCurrentUser(null)
  setUserName("")
  setShowDeleteDialog(false)

  // Redirect
  router.push("/")
}

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
    setIsMenuOpen(false)
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50"
      style={{ scrollBehavior: "smooth" }}
    >
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-pink-500 fill-current" />
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Mingle
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <a
                href="#features"
                onClick={(e) => handleSmoothScroll(e, "features")}
                className="text-gray-600 hover:text-pink-500 transition-colors cursor-pointer text-sm lg:text-base"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={(e) => handleSmoothScroll(e, "how-it-works")}
                className="text-gray-600 hover:text-pink-500 transition-colors cursor-pointer text-sm lg:text-base"
              >
                How It Works
              </a>
              <a
                href="#pricing"
                onClick={(e) => handleSmoothScroll(e, "pricing")}
                className="text-gray-600 hover:text-pink-500 transition-colors cursor-pointer text-sm lg:text-base"
              >
                Pricing
              </a>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="text-gray-600 hover:text-pink-500 flex items-center space-x-2 text-sm lg:text-base"
                    >
                      <User className="w-4 h-4" />
                      <span className="max-w-24 lg:max-w-32 truncate">{userName}</span>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center cursor-pointer">
                        <User className="w-4 h-4 mr-2" />
                        View Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center cursor-pointer">
                        <Heart className="w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="flex items-center cursor-pointer text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setShowDeleteDialog(true)}
                      className="flex items-center cursor-pointer text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Profile
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" className="text-gray-600 hover:text-pink-500 text-sm lg:text-base">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-sm lg:text-base px-3 lg:px-4">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-pink-100">
              <div className="flex flex-col space-y-4">
                <a
                  href="#features"
                  onClick={(e) => handleSmoothScroll(e, "features")}
                  className="text-gray-600 hover:text-pink-500 transition-colors cursor-pointer px-2"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  onClick={(e) => handleSmoothScroll(e, "how-it-works")}
                  className="text-gray-600 hover:text-pink-500 transition-colors cursor-pointer px-2"
                >
                  How It Works
                </a>
                <a
                  href="#pricing"
                  onClick={(e) => handleSmoothScroll(e, "pricing")}
                  className="text-gray-600 hover:text-pink-500 transition-colors cursor-pointer px-2"
                >
                  Pricing
                </a>
                <div className="flex flex-col space-y-2 pt-4 border-t border-pink-100">
                  {isLoggedIn ? (
                    <>
                      <div className="text-gray-800 font-medium px-2 truncate">Welcome, {userName}</div>
                      <Link href="/profile">
                        <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-pink-500">
                          <User className="w-4 h-4 mr-2" />
                          View Profile
                        </Button>
                      </Link>
                      <Link href="/dashboard">
                        <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-pink-500">
                          <Heart className="w-4 h-4 mr-2" />
                          Dashboard
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="w-full justify-start text-red-600 hover:text-red-700"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setShowDeleteDialog(true)}
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Profile
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/login">
                        <Button variant="ghost" className="w-full text-gray-600 hover:text-pink-500">
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/signup">
                        <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                          Get Started
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-pink-200 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-20 sm:-bottom-40 -left-20 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <Badge className="mb-4 sm:mb-6 bg-pink-100 text-pink-700 hover:bg-pink-200 text-xs sm:text-sm">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Welcome to our platform
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 px-2">
              Find Your Perfect{" "}
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Match</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
              Connect with like-minded people, build meaningful relationships, and discover love that lasts. Join
              thousands of happy couples who found each other on Mingle.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              {isLoggedIn ? (
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-base lg:text-lg px-6 sm:px-8 py-3"
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4 lg:h-5 lg:w-5" />
                  </Button>
                </Link>
              ) : (
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-base lg:text-lg px-6 sm:px-8 py-3"
                  >
                    Start Your Journey
                    <ArrowRight className="ml-2 h-4 w-4 lg:h-5 lg:w-5" />
                  </Button>
                </Link>
              )}
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-base lg:text-lg px-6 sm:px-8 py-3 border-pink-200 text-pink-600 hover:bg-pink-50 bg-transparent"
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Why Choose Mingle?</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Our advanced matching system and safety features help you find meaningful connections.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Smart Matching</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Our AI-powered algorithm learns your preferences and suggests compatible matches based on shared
                  interests and values.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Safe & Secure</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Your privacy and safety are our top priorities. All profiles are verified and we use advanced security
                  measures.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Real-time Chat</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Connect instantly with your matches through our secure messaging system with photo and video sharing.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Community Events</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Join local meetups and virtual events to connect with other singles in a fun, relaxed environment.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Globe className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Global Reach</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Connect with people from around the world or find someone special in your local area.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Smartphone className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Mobile First</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Take your dating life on the go with our fully-featured mobile app available on iOS and Android.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Getting started is easy. Follow these simple steps to find your perfect match.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-xl sm:text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Create Your Profile</h3>
              <p className="text-sm sm:text-base text-gray-600 px-2">
                Sign up and create an attractive profile with photos and information about yourself and what you're
                looking for.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-xl sm:text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Get Matched</h3>
              <p className="text-sm sm:text-base text-gray-600 px-2">
                Our smart algorithm will suggest compatible matches based on your preferences, interests, and location.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-xl sm:text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Start Dating</h3>
              <p className="text-sm sm:text-base text-gray-600 px-2">
                Connect with your matches, chat, and arrange to meet in person. Your love story starts here!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Start for free or upgrade to premium for enhanced features and better matches.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 sm:p-8">
                <div className="text-center mb-6 sm:mb-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Free</h3>
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">$0</div>
                  <p className="text-sm sm:text-base text-gray-600">Perfect to get started</p>
                </div>
                <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-gray-600">Create profile</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-gray-600">Browse matches</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-gray-600">Send likes</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-gray-600">Basic matching</span>
                  </li>
                </ul>
                {isLoggedIn ? (
                  <Link href="/dashboard">
                    <Button className="w-full bg-transparent" variant="outline">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link href="/signup">
                    <Button className="w-full bg-transparent" variant="outline">
                      Get Started Free
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-gradient-to-br from-pink-500 to-purple-600 text-white relative">
              <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-yellow-400 text-yellow-900 text-xs sm:text-sm">Most Popular</Badge>
              </div>
              <CardContent className="p-6 sm:p-8">
                <div className="text-center mb-6 sm:mb-8">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">Premium</h3>
                  <div className="text-3xl sm:text-4xl font-bold mb-2">$19.99</div>
                  <p className="text-sm sm:text-base text-pink-100">per month</p>
                </div>
                <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-pink-200 mr-3 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Everything in Free</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-pink-200 mr-3 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Unlimited messaging</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-pink-200 mr-3 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Advanced filters</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-pink-200 mr-3 flex-shrink-0" />
                    <span className="text-sm sm:text-base">See who liked you</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-pink-200 mr-3 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Priority support</span>
                  </li>
                </ul>
                <Button className="w-full bg-white text-pink-600 hover:bg-pink-50">Upgrade to Premium</Button>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 sm:p-8">
                <div className="text-center mb-6 sm:mb-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">VIP</h3>
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">$39.99</div>
                  <p className="text-sm sm:text-base text-gray-600">per month</p>
                </div>
                <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-gray-600">Everything in Premium</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-gray-600">Profile boost</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-gray-600">Read receipts</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-gray-600">Exclusive events</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-gray-600">Personal matchmaker</span>
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                  Go VIP
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-pink-500 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6 px-2">
            Ready to Find Your Perfect Match?
          </h2>
          <p className="text-lg sm:text-xl text-pink-100 mb-6 sm:mb-8 px-4">
            Join thousands of happy couples who found love on Mingle. Your soulmate is waiting for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            {isLoggedIn ? (
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white text-pink-600 hover:bg-pink-50 text-base lg:text-lg px-6 sm:px-8 py-3"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4 lg:h-5 lg:w-5" />
                </Button>
              </Link>
            ) : (
              <Link href="/signup">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white text-pink-600 hover:bg-pink-50 text-base lg:text-lg px-6 sm:px-8 py-3"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 h-4 w-4 lg:h-5 lg:w-5" />
                </Button>
              </Link>
            )}
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto text-base lg:text-lg px-6 sm:px-8 py-3 border-white text-white hover:bg-white/10 bg-transparent"
            >
              <Download className="mr-2 h-4 w-4 lg:h-5 lg:w-5" />
              Download App
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-pink-500 fill-current" />
                <span className="text-xl sm:text-2xl font-bold">Mingle</span>
              </div>
              <p className="text-sm sm:text-base text-gray-400">
                Connecting hearts, creating lasting relationships, and building a community of love.
              </p>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Product</h3>
              <ul className="space-y-2 text-sm sm:text-base text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Mobile App
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Company</h3>
              <ul className="space-y-2 text-sm sm:text-base text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Press
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Support</h3>
              <ul className="space-y-2 text-sm sm:text-base text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Safety
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-sm sm:text-base text-gray-400">
            <p>&copy; 2024 Mingle. All rights reserved. Made with ❤️ for finding love.</p>
          </div>
        </div>
      </footer>

      {/* Delete Profile Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="mx-4 max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-red-600 text-lg">
              <Trash2 className="w-5 h-5 mr-2" />
              Delete Profile Permanently
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm sm:text-base">
              Are you sure you want to delete your profile? This action cannot be undone. All your data, photos,
              matches, and messages will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProfile}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete Forever
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
