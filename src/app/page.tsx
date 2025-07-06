'use client';

import { useUser, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Sparkles, Users, MessageCircle, Shield, Star } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <header className="py-4 px-6 border-b border-pink-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-pink-500 fill-current" />
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Mingle
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <>
                <Link href="/dashboard">
                  <Button 
                    variant="outline" 
                    className="border-pink-200 text-pink-600 hover:bg-pink-50"
                  >
                    Dashboard
                  </Button>
                </Link>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10"
                    }
                  }}
                />
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button variant="outline" className="border-pink-200 text-pink-600 hover:bg-pink-50">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                    Get Started
                  </Button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Find Your
              </span>
              <br />
              <span className="text-gray-800">Perfect Match</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Connect with like-minded people, build meaningful relationships, and discover love in a safe, 
              authentic environment designed for real connections.
            </p>
          </div>

          {isSignedIn ? (
            <div className="space-y-4">
              <p className="text-lg text-gray-700 mb-6">
                Welcome back, {user.firstName}! Ready to continue your journey?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-lg px-8 py-4"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Go to Dashboard
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-pink-200 text-pink-600 hover:bg-pink-50 text-lg px-8 py-4"
                  >
                    View Profile
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <SignUpButton mode="modal">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-lg px-8 py-4"
                  >
                    <Heart className="w-5 h-5 mr-2 fill-current" />
                    Start Your Journey
                  </Button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-pink-200 text-pink-600 hover:bg-pink-50 text-lg px-8 py-4"
                  >
                    Sign In
                  </Button>
                </SignInButton>
              </div>
              <p className="text-sm text-gray-500">
                Join thousands of people who found meaningful connections
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Choose Mingle?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We believe in authentic connections. Our platform is designed to help you find genuine relationships.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Smart Matching</h3>
                <p className="text-gray-600">
                  Our advanced algorithm connects you with people who share your values, interests, and relationship goals.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Safe & Secure</h3>
                <p className="text-gray-600">
                  Your privacy and safety are our top priorities. Verified profiles and secure messaging keep you protected.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Meaningful Conversations</h3>
                <p className="text-gray-600">
                  Move beyond small talk with conversation starters and compatibility insights that spark real connections.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isSignedIn && (
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl p-12 text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Find Your Person?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Join Mingle today and start your journey to meaningful connections.
              </p>
              <SignUpButton mode="modal">
                <Button 
                  size="lg" 
                  className="bg-white text-pink-600 hover:bg-gray-100 text-lg px-8 py-4"
                >
                  <Star className="w-5 h-5 mr-2" />
                  Get Started Free
                </Button>
              </SignUpButton>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 px-6 bg-white/80 border-t border-pink-100">
        <div className="max-w-6xl mx-auto text-center text-gray-600">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-6 w-6 text-pink-500 fill-current" />
            <span className="text-lg font-semibold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Mingle
            </span>
          </div>
          <p>&copy; 2025 Mingle. Making meaningful connections possible.</p>
        </div>
      </footer>
    </div>
  );
}
