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
import HeroSection from "@/components/HeroSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import AboutUs from "@/components/AboutUs";


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

      <HeroSection />

      <AboutUs />

      <WhyChooseUs />

      <Testimonials />

      <OurProcess />

      <FAQSection />

      <CTASection />

      <Contact />
      
      <Footer />
    </div>
  );
}
