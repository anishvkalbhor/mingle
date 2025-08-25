"use client";
import { Menu, X, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import {
  useUser,
  SignInButton,
  SignUpButton,
  UserButton,
  useClerk,
} from "@clerk/nextjs";
import Link from "next/link";

interface ProfileData {
  firstName?: string;
  lastName?: string;
}

export default function Navbar() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userData, setUserData] = useState<ProfileData | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("nav")) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Smooth scroll function
  const smoothScrollTo = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      const navbarHeight = 120; // Adjust based on your navbar height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
    setIsMenuOpen(false); // Close mobile menu after click
  };

  // Handle navigation clicks
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    
    // Check if we're on the homepage
    if (window.location.pathname === '/') {
      smoothScrollTo(sectionId);
    } else {
      window.location.href = `/#${sectionId}`;
    }
  };

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-7xl">
      <div className="bg-white/20 backdrop-blur-md rounded-2xl border border-gray-300">
        <div className="relative flex items-center justify-between px-6 py-5">
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className="relative">
              <Heart className="h-8 w-8 text-purple-500 fill-current" />
            </div>
            <span className="text-3xl font-bold font-sans bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Mingle
            </span>
          </div>

          <div className="hidden md:flex items-center justify-center flex-1 mx-8">
            <div className="flex items-center space-x-8 font-bold font-sans">
              
              <a
                href="/#about"
                onClick={(e) => handleNavClick(e, 'about')}
                className="text-gray-800 hover:text-purple-600 transition-colors font-medium cursor-pointer"
              >
                About us
              </a>
              <a
                href="/#our-process"
                onClick={(e) => handleNavClick(e, 'our-process')}
                className="text-gray-800 hover:text-purple-600 transition-colors font-medium cursor-pointer"
              >
                Process
              </a>
              <a
                href="/#contact"
                onClick={(e) => handleNavClick(e, 'contact')}
                className="text-gray-800 hover:text-purple-600 transition-colors font-medium cursor-pointer"
              >
                Contact
              </a>
              <Link
                href="/pricing"
                className="text-gray-800 hover:text-purple-600 transition-colors font-medium"
              >
                Pricing
              </Link>
              {isSignedIn && (
                <Link
                  href="/profile"
                  className="text-gray-800 hover:text-purple-600 transition-colors font-medium"
                >
                  Profile
                </Link>
              )}
              {isSignedIn && (
                <Link
                  href="/dashboard"
                  className="text-gray-800 hover:text-purple-600 transition-colors font-medium"
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4 flex-shrink-0">
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
                </div>
              ) : (
                <div className="flex items-center space-x-3 font-sans font-bold">
                  <SignUpButton mode="modal">
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white transition-colors duration-200 shadow-lg cursor-pointer">
                      Get Started
                    </Button>
                  </SignUpButton>
                </div>
              )}  
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-800 hover:text-purple-600 transition-colors p-2 cursor-pointer"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white/20 backdrop-blur-md rounded-b-2xl border-t border-gray-200">
            <div className="px-6 py-6">
              <div className="space-y-4 mb-6">
                {isSignedIn && (
                  <Link
                    href="/profile"
                    className="block text-gray-800 font-semibold text-lg hover:text-purple-600 transition-colors py-2 text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                )}
                <a
                  href="/#about"
                  onClick={(e) => handleNavClick(e, 'about')}
                  className="block text-gray-800 font-semibold text-lg hover:text-purple-600 transition-colors py-2 text-center cursor-pointer"
                >
                  About us
                </a>
                <a
                  href="/#our-process"
                  onClick={(e) => handleNavClick(e, 'our-process')}
                  className="block text-gray-800 font-semibold text-lg hover:text-purple-600 transition-colors py-2 text-center cursor-pointer"
                >
                  Process
                </a>
                <a
                  href="/#contact"
                  onClick={(e) => handleNavClick(e, 'contact')}
                  className="block text-gray-800 font-semibold text-lg hover:text-purple-600 transition-colors py-2 text-center cursor-pointer"
                >
                  Contact
                </a>
                <Link
                  href="/pricing"
                  className="block text-gray-800 font-semibold text-lg hover:text-purple-600 transition-colors py-2 text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pricing
                </Link>
                {isSignedIn && (
                  <Link 
                    href="/dashboard" 
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-gray-800 font-semibold text-lg hover:text-purple-600 transition-colors py-2 text-center"
                  >
                    Dashboard
                  </Link>
                )}
              </div>

              {isSignedIn ? (
                <div className="space-y-4 pt-4 border-t border-gray-300">
                  <div className="flex items-center justify-center">
                    <div className="flex items-center space-x-3">
                      <UserButton
                        appearance={{
                          elements: { 
                            avatarBox: "w-12 h-12",
                          },
                        }}
                      />
                      <span className="text-gray-800 font-bold text-lg">
                        Hello,{" "}
                        {userData?.firstName || user?.firstName || "User"}!
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex space-x-3 pt-4 border-t border-gray-300">
                  <SignInButton mode="modal">
                    <Button
                      variant="outline"
                      className="flex-1 border-purple-200 text-purple-600 hover:bg-purple-50 transition-colors duration-200 cursor-pointer"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white transition-colors duration-200 shadow-lg cursor-pointer"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Signup
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