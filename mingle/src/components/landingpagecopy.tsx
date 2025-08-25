"use client";

import { useUser, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Users, Globe, Smile, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  DraggableCardBody,
  DraggableCardContainer,
} from "@/components/ui/draggable-card";
import { Testimonials } from "@/components/Testimonials";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import OurProcess from "@/components/OurProcess";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { FaqAccordion } from "@/components/ui/faq-chat-accordion";
import type { FAQItem } from "@/components/ui/faq-chat-accordion";
import Contact from "@/components/GetInTouch";
import { motion } from "framer-motion";

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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setNavOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      <Navbar />

      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-400 opacity-20 blur-[100px]"></div>
      </div>

      <section className="px-4 sm:px-6 lg:px-8 pt-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between lg:pt-16">
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

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Testimonials Section */}
      <Testimonials />

      {/* Our Process Section */}
      <OurProcess />

      <section className="py-16 sm:py-20 text-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
            <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start justify-center mb-10 lg:mb-0">
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 mb-6 text-center lg:text-left font-mono"
              >
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600 max-w-md lg:pr-8 text-center lg:text-left">
                Got questions? We've got answers. Here are some of the most
                common things people ask about Mingle.
              </p>
            </div>
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

      <section className="mb-15">
      {!isSignedIn && (
        <motion.div
          className="text-center"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            className="bg-white/5 backdrop-blur-md rounded-3xl p-12 shadow-xl border border-white/20 max-w-2xl mx-auto"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              className="mb-6"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-2xl mb-4 shadow-lg"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <MessageCircle className="w-8 h-8 text-gray-700" />
              </motion.div>
            </motion.div>
            <motion.h3
              className="text-2xl font-bold text-gray-700 mb-3"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Still have questions?
            </motion.h3>
            <motion.p
              className="text-gray-500 text-lg mb-8 leading-relaxed"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              Our support team is here to help you get the most out of Every AI.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <SignUpButton mode="modal">
                <motion.button
                  className="group relative px-8 py-4 font-semibold text-white bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10">Get Started Free</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.button>
              </SignUpButton>

              <motion.button
                className="px-8 py-4 font-semibold text-indigo-300 bg-indigo-900 hover:bg-indigo-800 rounded-2xl border border-indigo-700 hover:border-indigo-500 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Browse Documentation
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
      </section>
      <section id="contact">
        <Contact />
      </section>

      <footer>
        <div className="block">
          <Footer />
        </div>
      </footer>
    </div>
  );
}
