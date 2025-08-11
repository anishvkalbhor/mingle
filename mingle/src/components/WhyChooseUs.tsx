"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const features = [
  {
    icon: "💝",
    title: "Smart Matching",
    description: "AI-powered algorithm finds your perfect match based on compatibility and shared interests."
  },
  {
    icon: "🛡️",
    title: "Safe & Secure",
    description: "Advanced verification system ensures you connect with real, verified profiles only."
  },
  {
    icon: "💬",
    title: "Meaningful Conversations",
    description: "Break the ice with thoughtful prompts and start genuine connections instantly."
  },
  {
    icon: "🌟",
    title: "Premium Experience",
    description: "Enjoy unlimited matches, advanced filters, and priority support 24/7."
  }
];

const stats = [
  { number: 10, label: "K+ Members", suffix: "K+" },
  { number: 1000, label: "Happy Couples", suffix: "+" },
  { number: 99, label: "Success Rate", suffix: "%" }
];

export const WhyChooseUs = () => {
  const [animatedStats, setAnimatedStats] = useState([0, 0, 0]);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            animateStats();
          }
        });
      },
      { threshold: 0.3 }
    );

    const section = document.getElementById('why-choose-us');
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateStats = () => {
    const duration = 3000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 4);

      const newStats = stats.map((stat, index) => 
        Math.floor(easedProgress * stat.number)
      );

      setAnimatedStats(newStats);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <section 
      id="why-choose-us"
      className="relative py-16 bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 overflow-hidden"
    >
      {/* Subtle Background Animation */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.1) 0%, transparent 50%), radial-gradient(circle at 20% 20%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-0 sm:px-0 lg:px-0 flex items-center">
        {/* Left Side Image */}
        <div className="hidden md:flex flex-shrink-0 justify-start items-center w-[40%] min-w-[340px] max-w-[480px] h-full">
          <img src="/couple.png" alt="Couple" className="rounded-2xl shadow-lg w-full h-auto object-cover max-h-[500px]" />
        </div>
        {/* Main Content shifted right */}
        <div className="w-full md:w-[60%] ml-0 md:ml-12">
          {/* Section Header - Smaller */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                background: "linear-gradient(135deg, #9333EA, #EC4899, #F59E0B)",
                backgroundSize: "300% 300%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Why Choose Us?
            </motion.h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We combine cutting-edge technology with exceptional service to deliver results that exceed expectations.
            </p>
          </motion.div>

          {/* Circular Container and Stats */}
          {/* Circular Container - Smaller */}
          <div className="relative w-full max-w-3xl mx-auto h-96">
            {/* Orbital Ring */}
            <motion.div
              className="absolute inset-0 border border-purple-200/30 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            />

            {/* Connection Lines - Horizontal and Vertical */}
            {/* Removed for 2x2 grid layout */}

            {/* Feature Cards in 2x2 Grid with Center Circle */}
            <div className="relative w-full h-full flex items-center justify-center">
              {/* 2x2 Grid for Cards */}
              <div className="grid grid-cols-2 grid-rows-2 gap-8 relative z-10">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0, rotate: 180 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{
                      duration: 1,
                      ease: [0.68, -0.55, 0.265, 1.55],
                      delay: 1 + index * 0.2
                    }}
                    viewport={{ once: true }}
                    className="w-56 h-56 bg-white/90 backdrop-blur-sm border border-purple-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-lg"
                  >
                    <motion.div
                      className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-xl mb-4"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.4 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-xs leading-relaxed">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
              {/* Center Circle */}
              <motion.div
                initial={{ opacity: 0, scale: 0, rotate: 180 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1.2, ease: [0.68, -0.55, 0.265, 1.55], delay: 0.5 }}
                viewport={{ once: true }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-full flex flex-col items-center justify-center z-20 shadow-lg"
              >
                <motion.div
                  className="text-3xl mb-1"
                  animate={{ rotate: [0, 90, 180, 270, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  ⚡
                </motion.div>
                <div className="text-gray-800 font-semibold text-center text-sm">
                  Core<br />Features
                </div>
              </motion.div>
            </div>
          </div>

          {/* Stats Section - Smaller */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2 }}
            viewport={{ once: true }}
            className="flex justify-center gap-12 mt-12 flex-wrap"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-3xl font-bold text-gray-800 mb-1">
                  {animatedStats[index]}{stat.suffix}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}; 