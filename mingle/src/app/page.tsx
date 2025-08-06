"use client";

import { useUser, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Users,
  Globe,
  Smile,
  Sparkles,
  MessageCircle,
  Shield,
  Star,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { SparklesText } from "@/components/ui/sparkles-text";
import {
  DraggableCardBody,
  DraggableCardContainer,
} from "@/components/ui/draggable-card";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { FaqAccordion } from "@/components/ui/faq-chat-accordion";
import type { FAQItem } from "@/components/ui/faq-chat-accordion";

const defaultData: FAQItem[] = [
  {
    answer: "The internet doesn't close. It's available 24/7.",
    icon: "❤️",
    iconPosition: "right",
    id: 1,
    question: "How late does the internet close?",
  },
  {
    answer: "No, you don't need a license to browse this website.",
    icon: undefined,
    iconPosition: undefined,
    id: 2,
    question: "Do I need a license to browse this website?",
  },
  {
    answer:
      "Our cookies are digital, not edible. They're used for website functionality.",
    icon: undefined,
    iconPosition: undefined,
    id: 3,
    question: "What flavour are the cookies?",
  },
  {
    answer: "Yes, but we do have a return policy",
    icon: "⭐",
    iconPosition: "left",
    id: 4,
    question: "Can I get lost here?",
  },
  {
    answer: "Don't worry, you can always go back or refresh the page.",
    icon: undefined,
    iconPosition: undefined,
    id: 5,
    question: "What if I click the wrong button?",
  },
];

export default function HomePage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (isSignedIn && user) {
        const res = await fetch("/api/users/me");
        if (res.ok) {
          const data = await res.json();
          setIsAdmin(data?.data?.isAdmin || false);
        }
      }
    };
    fetchUser();
  }, [isSignedIn, user]);

  // Close nav when switching to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setNavOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close nav when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (
        navOpen &&
        !target.closest("nav") &&
        !target.closest('button[aria-label="Open navigation menu"]')
      ) {
        setNavOpen(false);
      }
    };

    if (navOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [navOpen]);

  const draggableCards = [
    {
      title: "Find Your Perfect Match",
      image: "/card1.png",
      className: "absolute top-10 left-[20%] rotate-[-5deg]",
    },
    {
      title: "AI-Powered Matching",
      image: "/card2.png",
      className: "absolute top-40 left-[25%] rotate-[-7deg]",
    },
    {
      title: "Meaningful Connections",
      image: "/card3.png",
      className: "absolute top-5 left-[40%] rotate-[8deg]",
    },
    {
      title: "Safe & Secure",
      image: "/card1.png",
      className: "absolute top-32 left-[55%] rotate-[10deg]",
    },
    {
      title: "Real Conversations",
      image: "/card2.png",
      className: "absolute top-20 right-[35%] rotate-[2deg]",
    },
    {
      title: "Verified Profiles",
      image: "/card3.png",
      className: "absolute top-24 left-[45%] rotate-[-7deg]",
    },
    {
      title: "Community First",
      image: "/card1.png",
      className: "absolute top-8 left-[30%] rotate-[4deg]",
    },
  ];

  if (!isLoaded) {
    return (
      <div className="min-h-screen overflow-x-hidden relative flex items-center justify-center">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-400 opacity-20 blur-[100px]"></div>
        </div>
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden relative">
      {/* Floating Navbar */}
      <Navbar />
      
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-400 opacity-20 blur-[100px]"></div>
      </div>
      
      

      {/* Main Content Section */}
      <section className="px-4 sm:px-6 lg:px-8 pt-24">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between pt-8 lg:pt-16">
          {/* Left Side - Text and Button */}
          <div className="flex-1 max-w-3xl text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="font-normal">Find your love</span>
              <br />
              <span className="font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                Delete all
              </span>
              <br />
              <span className="font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                Dating apps
              </span>
            </h1>
            <p className="text-lg sm:text-xl mb-8 max-w-2xl text-black font-bold mx-auto lg:mx-0">
              We designed a platform to find your love the most genuine way,{" "}
              <span className="font-bold">no more regret for no matches</span>
            </p>
            <div className="relative">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white text-lg px-8 sm:px-16 py-4 rounded-full font-semibold uppercase tracking-wide w-full sm:w-auto"
                >
                  FIND YOUR LOVE
                </Button>
              </Link>
            </div>

            {/* Features Section - Responsive grid */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  10k+ Members
                </h3>
                <p className="text-gray-600 text-sm">
                  Over thousands of people are using happyMatch.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Smart AI
                </h3>
                <p className="text-gray-600 text-sm">
                  Best match based on an intelligent algorithm.
                </p>
              </div>
              <div className="text-center sm:col-span-2 lg:col-span-1">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smile className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Perfect Match
                </h3>
                <p className="text-gray-600 text-sm">
                  10k+ people are happy using our platform.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Draggable Cards (hidden on mobile) */}
          <div className="flex-1 justify-center hidden lg:flex mt-12 lg:mt-0">
            <DraggableCardContainer className="relative flex min-h-screen w-full items-center justify-center overflow-clip">
              <p className="absolute top-1/2 mx-auto max-w-sm -translate-y-3/4 text-center text-2xl font-black text-neutral-400 md:text-4xl dark:text-neutral-800">
                Find your perfect match with Mingle
              </p>
              {draggableCards.map((item, index) => (
                <DraggableCardBody key={index} className={item.className}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="pointer-events-none relative z-10 h-80 w-80 object-cover rounded-2xl shadow-lg"
                  />
                  <h3 className="mt-4 text-center text-2xl font-bold text-neutral-700 dark:text-neutral-300">
                    {item.title}
                  </h3>
                </DraggableCardBody>
              ))}
            </DraggableCardContainer>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800">
              Success Stories
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              See what our users have to say.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                name: "Sarah & Tom",
                role: "Found Love on Mingle",
                avatar: "",
                testimonial:
                  "Mingle helped us find each other when we least expected it. The AI matching was spot on, and we connected on a level we never thought possible. We are now happily married!",
              },
              {
                name: "Jessica L.",
                role: "Mingle User",
                avatar: "",
                testimonial:
                  "I was tired of the endless swiping on other apps. Mingle's focus on genuine connections made all the difference. I've met so many amazing people here.",
              },
              {
                name: "Mike P.",
                role: "Mingle User",
                avatar: "",
                testimonial:
                  "The community is fantastic, and the app is so easy to use. I love the personality prompts—they really help break the ice and start meaningful conversations.",
              },
            ].map((testimonial, index) => (
              <Card
                key={index}
                className="p-6 sm:p-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl"
              >
                <CardContent>
                  <div className="flex items-center mb-6">
                    <Avatar className="w-16 h-16 mr-4 border-2 border-pink-200">
                      {testimonial.avatar ? (
                        <AvatarImage
                          src={testimonial.avatar}
                          alt={testimonial.name}
                        />
                      ) : (
                        <AvatarFallback>
                          {testimonial.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <h4 className="text-xl font-bold text-gray-800">
                        {testimonial.name}
                      </h4>
                      <p className="text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic">
                    "{testimonial.testimonial}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-20 text-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
            {/* Left: Heading */}
            <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start justify-center mb-10 lg:mb-0">
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 mb-6 text-center lg:text-left"
                style={{
                  fontFamily: "Dancing Script, cursive",
                  letterSpacing: "-1px",
                }}
              >
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600 max-w-md lg:pr-8 text-center lg:text-left">
                Got questions? We've got answers. Here are some of the most
                common things people ask about Mingle.
              </p>
            </div>
            {/* Right: FAQ Accordion */}
            <div className="w-full lg:w-3/5 flex items-start justify-center lg:justify-start">
              <div className="w-full max-w-xl scale-100">
                <FaqAccordion
                  data={defaultData}
                  className="max-w-full"
                  questionClassName="bg-secondary hover:bg-secondary/80 text-lg md:text-xl py-5"
                  answerClassName="bg-secondary text-secondary-foreground text-base md:text-lg"
                  timestamp="Updated daily at 12:00 PM"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isSignedIn && (
        <section className="py-16 sm:py-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl p-8 sm:p-12 text-white">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6">
                Ready to Find Your Person?
              </h2>
              <p className="text-lg sm:text-xl mb-8 opacity-90">
                Join Mingle today and start your journey to meaningful
                connections.
              </p>
              <SignUpButton mode="modal">
                <Button
                  size="lg"
                  className="bg-white text-pink-600 hover:bg-gray-100 text-lg px-6 sm:px-8 py-4"
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
      <footer>
        <div className="block">
          <Footer />
        </div>
      </footer>
    </div>
  );
}
