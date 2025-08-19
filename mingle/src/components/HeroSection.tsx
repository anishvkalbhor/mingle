"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, Users, Zap, Globe, Smile } from "lucide-react";
import { motion } from "framer-motion";
import {
  DraggableCardBody,
  DraggableCardContainer,
} from "@/components/ui/draggable-card";

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

export default function HeroSection() {
  return (
    <div className="relative h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10 h-full w-full bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"></div>
        
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-30 blur-[100px]"></div>
        <div className="absolute bottom-20 left-20 h-[200px] w-[200px] rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 opacity-20 blur-[80px]"></div>
        <div className="absolute top-40 right-20 h-[250px] w-[250px] rounded-full bg-gradient-to-r from-pink-400 to-rose-400 opacity-25 blur-[90px]"></div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/10"></div>
      </div>

      <section className="relative z-10 font-sans h-full">
        <div className="h-full flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-0">
              
              {/* Left Section - Content */}
              <motion.div 
                className="space-y-6 lg:space-y-8 text-center lg:text-left pt-5 sm:pt-15 lg:pt-15"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                {/* Hero Text */}
                <div className="space-y-4">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold font-sans tracking-tighter text-gray-900 leading-tight">
                    <span className="font-normal font-sans block">Find your love</span>
                    <span className="font-bold font-sans bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                      Delete all
                    </span>
                    <br />
                    <span className="font-bold font-sans bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                      Dating apps
                    </span>
                  </h1>
                  
                  <p className="text-base sm:text-lg lg:text-xl text-gray-800 font-medium max-w-2xl mx-auto lg:mx-0">
                    We designed a platform to find your love the most genuine way,{" "}
                    <span className="font-bold text-purple-700">no more regret for no matches</span>
                  </p>
                </div>

                {/* CTA Button */}
                <div className="pt-2">
                  <Link href="/sign-in">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white text-base sm:text-lg px-6 sm:px-12 lg:px-16 py-3 sm:py-4 rounded-full font-semibold uppercase tracking-wide w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      FIND YOUR LOVE
                    </Button>
                  </Link>
                </div>

                {/* Features Grid */}
                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <div className="text-center bg-white/70 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-purple-100 hover:border-purple-200 transition-all duration-300 hover:shadow-lg">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4 shadow-lg">
                      <Users className="w-5 h-5 lg:w-8 lg:h-8 text-white" />
                    </div>
                    <h3 className="text-sm lg:text-lg font-semibold text-gray-900 mb-1 lg:mb-2">
                      10k+ Members
                    </h3>
                    <p className="text-gray-700 text-xs lg:text-sm">
                      Over thousands of people are using Mingle.
                    </p>
                  </div>
                  
                  <div className="text-center bg-white/70 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-purple-100 hover:border-purple-200 transition-all duration-300 hover:shadow-lg">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4 shadow-lg">
                      <Globe className="w-5 h-5 lg:w-8 lg:h-8 text-white" />
                    </div>
                    <h3 className="text-sm lg:text-lg font-semibold text-gray-900 mb-1 lg:mb-2">
                      Smart AI
                    </h3>
                    <p className="text-gray-700 text-xs lg:text-sm">
                      Best match based on an intelligent algorithm.
                    </p>
                  </div>
                  
                  <div className="text-center bg-white/70 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-purple-100 hover:border-purple-200 transition-all duration-300 hover:shadow-lg">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4 shadow-lg">
                      <Smile className="w-5 h-5 lg:w-8 lg:h-8 text-white" />
                    </div>
                    <h3 className="text-sm lg:text-lg font-semibold text-gray-900 mb-1 lg:mb-2">
                      Perfect Match
                    </h3>
                    <p className="text-gray-700 text-xs lg:text-sm">
                      10k+ people are happy using our platform.
                    </p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Right Section - Draggable Cards (Hidden on Mobile) */}
              <motion.div 
                className="hidden lg:flex justify-center items-center h-full"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <DraggableCardContainer className="relative flex h-full w-full items-center justify-center overflow-clip mt-16 lg:mt-20 xl:mt-24">
                  <p className="absolute top-1/2 mx-auto max-w-sm -translate-y-3/4 text-center text-xl font-black text-purple-600/60 lg:text-2xl xl:text-3xl mt-8 lg:mt-12">
                    Find your perfect match with Mingle
                  </p>
                  {draggableCards.map((item, index) => (
                    <DraggableCardBody key={index} className={item.className}>
                      <img
                        src={item.image}
                        alt={item.title}
                        className="pointer-events-none relative z-10 h-56 w-56 lg:h-64 lg:w-64 xl:h-80 xl:w-80 object-cover rounded-2xl shadow-lg"
                      />
                      <h3 className="mt-3 text-center text-base lg:text-lg xl:text-2xl font-bold text-gray-800">
                        {item.title}
                      </h3>
                    </DraggableCardBody>
                  ))}
                </DraggableCardContainer>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}