'use client';
import { Calendar, Menu, X, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import {
  useUser,
  SignInButton,
  SignUpButton,
  UserButton,
  useClerk,
} from "@clerk/nextjs";
import Link from "next/link";

export default function Navbar() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when switching to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('nav')) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-6xl">
      {/* Floating Navbar Container with Glassmorphism */}
      <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl border border-white/30">
        {/* Navbar Content */}
        <div className="relative flex items-center justify-between px-6 py-4">
          {/* Left Side - Logo */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Heart className="h-8 w-8 text-purple-500 fill-current" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Mingle
            </span>
          </div>

          {/* Right Side - Navigation Links & Auth */}
          <div className="flex items-center space-x-4">
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-4">
              <a href="/profile" className="text-gray-800 hover:text-purple-600 transition-colors font-medium">
                Profile
              </a>
              <a href="/pricing" className="text-gray-800 hover:text-purple-600 transition-colors font-medium">
                Pricing
              </a>
              {isSignedIn && (
                <Link href="/dashboard">
                  <Button
                    variant="outline"
                    className="border-purple-200 text-purple-600 hover:bg-purple-50 transition-colors duration-200"
                  >
                    Dashboard
                  </Button>
                </Link>
              )}
            </div>

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center space-x-4">
              {isSignedIn ? (
                <div className="flex items-center space-x-3">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10",
                      },
                    }}
                  />
                  <Button
                    variant="ghost"
                    className="w-20 text-gray-600 border-red-300 hover:text-red-400"
                    onClick={() => signOut()}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <>
                  <SignInButton mode="modal">
                    <Button
                      variant="outline"
                      className="border-purple-200 text-purple-600 hover:bg-purple-50 transition-colors duration-200"
                    >
                      LOGIN IN
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-200">
                      SIGNUP NOW
                    </Button>
                  </SignUpButton>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-800 hover:text-purple-600 transition-colors p-2 cursor-pointer"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/20 backdrop-blur-md rounded-2xl border border-t-1">
            <div className="px-6 py-6">
              <div className="space-y-4 mb-6">
                <a href="/profile" className="block text-gray-800 font-semibold text-lg hover:text-purple-600 transition-colors py-2">
                  Profile
                </a>
                <a href="/pricing" className="block text-gray-800 font-semibold text-lg hover:text-purple-600 transition-colors py-2">
                  Pricing
                </a>
                {isSignedIn && (
                  <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <div className="block text-gray-800 font-semibold text-lg hover:text-purple-600 transition-colors py-2">
                      Dashboard
                    </div>
                  </Link>
                )}
              </div>

              {/* Auth Section */}
              {isSignedIn ? (
                <div className="space-y-3 pt-4 border-t border-gray-300">
                  <div className="flex justify-between">
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: "w-12 h-12",
                        },
                      }}
                    />
                  
                  <Button
                    variant="outline"
                    className="w-20 text-gray-600 border-red-300 hover:bg-red-50 transition-colors"
                    onClick={() => {
                      setIsMenuOpen(false);
                      signOut();
                    }}
                  >
                    Logout
                  </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 pt-4 border-t border-gray-300">
                  <SignInButton mode="modal">
                    <Button
                      variant="outline"
                      className="w-full border-purple-200 text-purple-600 hover:bg-purple-50 transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      LOGIN IN
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-colors duration-200 shadow-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      SIGNUP NOW
                    </Button>
                  </SignUpButton>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
