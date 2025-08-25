"use client";
import React from "react";
import { motion } from "framer-motion";
import { TestimonialsColumn } from "./TestimonialsColumn";

const testimonials = [
  {
    text: "Mingle helped me find my soulmate when I least expected it. The AI matching was incredibly accurate, and we connected on a deep level. We're now happily married!",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    name: "Priya Sharma",
    role: "Marketing Manager",
  },
  {
    text: "I was tired of endless swiping on other apps. Mingle's focus on genuine connections made all the difference. I've met so many amazing people here.",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    name: "Arjun Patel",
    role: "Software Engineer",
  },
  {
    text: "The community is fantastic and the app is so easy to use. I love the personality prompts—they really help break the ice and start meaningful conversations.",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    name: "Sarah Johnson",
    role: "Teacher",
  },
  {
    text: "Mingle's intelligent matching algorithm found me someone who truly understands me. We've been together for over a year now and couldn't be happier.",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    name: "Rahul Singh",
    role: "Doctor",
  },
  {
    text: "The safety features and verification system give me peace of mind. I feel secure knowing I'm connecting with real, verified people.",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    name: "Aisha Khan",
    role: "Architect",
  },
  {
    text: "I love how Mingle focuses on compatibility rather than just looks. The detailed profiles help you understand someone's personality before matching.",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    name: "Emma Wilson",
    role: "Designer",
  },
  {
    text: "After trying many dating apps, Mingle is the only one that helped me find a meaningful relationship. The quality of matches is outstanding.",
    image: "https://randomuser.me/api/portraits/men/7.jpg",
    name: "Vikram Malhotra",
    role: "Business Analyst",
  },
  {
    text: "The conversation starters and ice-breakers are brilliant. They make it so much easier to start talking and build genuine connections.",
    image: "https://randomuser.me/api/portraits/women/8.jpg",
    name: "Zara Ahmed",
    role: "Journalist",
  },
  {
    text: "Mingle's approach to dating is refreshing. It's not about quick matches but about finding someone you can truly connect with.",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
    name: "Michael Chen",
    role: "Consultant",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export const Testimonials = () => {
  return (
    <section className="py-8 xs:py-12 sm:py-16 lg:py-20 bg-white bg-[radial-gradient(60%_120%_at_50%_50%,hsla(0,0%,100%,0)_0,rgba(252,205,238,.5)_100%)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tighter font-bold font-sans bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Voices of Trust
          </h2>
          <p className="text-center mt-3 text-gray-700 font-medium">
            See what our customers have to say about us.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-6 h-[500px] overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-transparent pointer-events-none z-10" />
          <TestimonialsColumn testimonials={firstColumn} duration={6} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={8} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={7} />
        </div>
      </div>
    </section>
  );
}; 