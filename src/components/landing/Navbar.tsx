"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heart, User } from 'lucide-react';
import { useUser, UserButton, SignInButton, SignUpButton } from '@clerk/nextjs';

export const Navbar = () => {
  const { isSignedIn } = useUser();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-pink-500 fill-current" />
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Mingle
              </span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-gray-600 hover:text-pink-500 transition-colors">
              Features
            </Link>
            <Link href="#testimonials" className="text-gray-600 hover:text-pink-500 transition-colors">
              Testimonials
            </Link>
            <Link href="#faq" className="text-gray-600 hover:text-pink-500 transition-colors">
              FAQ
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <>
                <Link href="/profile">
                  <Button variant="outline" className="text-gray-600 hover:bg-gray-100 rounded-full">
                    Profile
                  </Button>
                </Link>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button variant="ghost" className="text-gray-600 hover:bg-gray-100">
                    Log In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full px-6">
                    Sign Up
                  </Button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
