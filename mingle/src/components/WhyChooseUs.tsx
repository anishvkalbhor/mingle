"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const features = [
  {
    icon: "💝",
    title: "Smart Matching",
    description:
      "AI-powered algorithm finds your perfect match based on compatibility and shared interests.",
  },
  {
    icon: "🛡️",
    title: "Safe & Secure",
    description:
      "Advanced verification system ensures you connect with real, verified profiles only.",
  },
  {
    icon: "💬",
    title: "Meaningful Conversations",
    description:
      "Break the ice with thoughtful prompts and start genuine connections instantly.",
  },
  {
    icon: "🌟",
    title: "Premium Experience",
    description:
      "Enjoy unlimited matches, advanced filters, and priority support 24/7.",
  },
];

const stats = [
  { number: 10, label: "K+ Members", suffix: "K+" },
  { number: 1000, label: "Happy Couples", suffix: "+" },
  { number: 99, label: "Success Rate", suffix: "%" },
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

    const section = document.getElementById("why-choose-us");
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
      className="relative py-8 xs:py-12 sm:py-16 lg:py-20 overflow-hidden bg-white"
    >
      <div className="relative z-10 max-w-6xl mx-auto px-4 xs:px-6 sm:px-8 lg:px-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mb-8 xs:mb-10 lg:mb-12 flex flex-col justify-center items-center"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tighter font-bold font-sans bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Why Mingle?
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-lg text-gray-700 leading-relaxed font-medium max-w-2xl mx-auto"
          >
            We combine cutting-edge technology with exceptional service to
            deliver results that exceed expectations.
          </motion.p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch">
          {/* Image Section - Reduced height */}
          <motion.div
            className="hidden lg:flex lg:w-[45%] flex-shrink-0"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="w-full flex flex-col relative h-full">
              {" "}
              {/* Fixed height */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/couple.png"
                  alt="Radiant Gradient Background"
                  className="w-full h-full object-fit"
                />
              </div>
            </div>
          </motion.div>

          {/* Content Section - Reduced spacing */}
          <div className="w-full lg:w-[55%] flex-1 font-sans flex flex-col">
            {/* Core Features - Reduced spacing */}
            <motion.div
              className="relative flex-1 mb-4" // Reduced from mb-6
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                {" "}
                {/* Reduced from gap-6 */}
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: 0.5 + index * 0.1,
                    }}
                    viewport={{ once: true }}
                    whileHover={{
                      y: -8,
                      transition: { duration: 0.3 },
                    }}
                    className="bg-white/90 backdrop-blur-sm border border-purple-200 rounded-xl p-4 cursor-pointer hover:bg-white hover:shadow-xl transition-all duration-300 shadow-lg flex flex-col" // Reduced from p-6
                  >
                    <motion.div
                      className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-lg mb-3" // Reduced sizes
                      whileHover={{
                        scale: 1.1,
                        transition: { duration: 0.3 },
                      }}
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="text-base font-semibold text-gray-800 mb-2">
                      {" "}
                      {/* Reduced from text-lg and mb-3 */}
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-xs leading-relaxed flex-1">
                      {" "}
                      {/* Reduced from text-sm */}
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Center Icon - Reduced size */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.6,
                }}
                viewport={{ once: true }}
                className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-full flex-col items-center justify-center z-20 shadow-lg" // Reduced from w-24 h-24
              >
                <div className="text-gray-800 font-bold font-sans text-center text-xs">
                  Core
                  <br />
                  Features
                </div>
              </motion.div>
            </motion.div>

            {/* Success Metrics - Reduced padding */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-purple-200/30 relative overflow-hidden font-sans" // Reduced from p-6
            >
              <div className="relative z-10">
                <motion.h3
                  className="text-lg font-sans font-bold text-gray-800 mb-4 text-center" // Reduced from text-xl and mb-6
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  viewport={{ once: true }}
                >
                  Our Success Metrics
                </motion.h3>

                <div className="grid grid-cols-3 gap-3 md:gap-4">
                  {" "}
                  {/* Reduced gaps */}
                  {stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      className="text-center group font-sans"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.8,
                        delay: 0.7 + index * 0.1,
                      }}
                      viewport={{ once: true }}
                      whileHover={{
                        y: -5,
                        transition: { duration: 0.3 },
                      }}
                    >
                      <motion.div
                        className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-2 shadow-lg group-hover:shadow-xl transition-shadow" // Reduced sizes and mb-3 to mb-2
                        whileHover={{
                          scale: 1.1,
                          transition: { duration: 0.3 },
                        }}
                      >
                        <span className="text-base md:text-lg font-bold text-white">
                          {" "}
                          {/* Reduced from text-lg md:text-xl */}
                          {index === 0 ? "👥" : index === 1 ? "💕" : "📈"}
                        </span>
                      </motion.div>
                      <div className="text-xl md:text-2xl font-sans font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
                        {" "}
                        {/* Reduced from text-2xl md:text-3xl and mb-2 */}
                        {animatedStats[index]}
                        {stat.suffix}
                      </div>
                      <div className="text-xs md:text-sm text-gray-600 font-medium">
                        {" "}
                        {/* Reduced from text-sm md:text-base */}
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
