"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useUser, SignUpButton } from '@clerk/nextjs';

export const HeroSection = () => {
  const { isSignedIn } = useUser();

  return (
    <section className="relative h-screen flex items-center justify-center text-center bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-pink-300/30 to-purple-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-rose-300/30 to-pink-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Find Your Perfect Match with Mingle
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Our AI-powered platform helps you discover meaningful connections with people who truly get you. Say goodbye to endless swiping and hello to genuine relationships.
        </p>
        <div className="flex justify-center gap-4">
          {!isSignedIn && (
            <SignUpButton mode="modal">
              <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-shadow">
                <Sparkles className="w-5 h-5 mr-2" />
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </SignUpButton>
          )}
          {isSignedIn && (
            <Link href="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-shadow">
                Go to Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};
