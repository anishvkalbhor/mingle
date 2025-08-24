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

  // Consistent animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section id="why-choose-us" className="relative py-8 xs:py-12 sm:py-16 lg:py-20 overflow-hidden bg-white">
    
      <div className="relative z-10 max-w-6xl mx-auto px-4 xs:px-6 sm:px-8 lg:px-12">
        
        {/* Header Section - Always at top */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mb-8 xs:mb-10 lg:mb-12 flex flex-col justify-center items-center"
        >
          <h2
            className="text-4xl lg:text-5xl font-bold font-sans mb-6 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent"
          >
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

        <div className="flex flex-col lg:flex-row gap-8 xs:gap-10 lg:gap-12 items-start">
          
          {/* Image Section - Hidden on mobile, visible on desktop */}
          <motion.div 
            className="hidden lg:block lg:w-[45%] flex-shrink-0"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="mb-8">
              <img
                src="/couple.png"
                alt="Happy Couple"
                className="w-full h-auto rounded-2xl shadow-2xl object-cover"
              />
            </div>
          </motion.div>

          {/* Content Section */}
          <div className="w-full lg:w-[55%] flex-1 font-sans">
            
            {/* Core Features */}
            <motion.div 
              className="relative mb-8 xs:mb-10 lg:mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      transition: { duration: 0.3 }
                    }}
                    className="bg-white/90 backdrop-blur-sm border border-purple-200 rounded-xl p-6 cursor-pointer hover:bg-white hover:shadow-xl transition-all duration-300 shadow-lg"
                  >
                    <motion.div
                      className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-xl mb-4"
                      whileHover={{ 
                        scale: 1.1,
                        transition: { duration: 0.3 }
                      }}
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Core Features Center Icon - Hidden on mobile for better layout */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.6,
                }}
                viewport={{ once: true }}
                className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-full flex-col items-center justify-center z-20 shadow-lg"
              >
                <motion.div
                  className="text-2xl mb-1"
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  ⚡
                </motion.div>
                <div className="text-gray-800 font-semibold text-center text-xs">
                  Core
                  <br />
                  Features
                </div>
              </motion.div>
            </motion.div>

            {/* Success Metrics - Now below core features */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-200/30 relative overflow-hidden font-sans"
            >
              <div className="relative z-10">
                <motion.h3 
                  className="text-xl font-sans font-bold text-gray-800 mb-6 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  viewport={{ once: true }}
                >
                  Our Success Metrics
                </motion.h3>

                <div className="grid grid-cols-3 gap-4 md:gap-6">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      className="text-center group font-sans"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.8, 
                        delay: 0.7 + index * 0.1 
                      }}
                      viewport={{ once: true }}
                      whileHover={{ 
                        y: -5,
                        transition: { duration: 0.3 }
                      }}
                    >
                      <motion.div 
                        className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:shadow-xl transition-shadow"
                        whileHover={{ 
                          scale: 1.1,
                          transition: { duration: 0.3 }
                        }}
                      >
                        <span className="text-white text-lg md:text-xl font-bold">
                          {index === 0 ? "👥" : index === 1 ? "💕" : "📈"}
                        </span>
                      </motion.div>
                      <div className="text-2xl md:text-3xl font-sans font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                        {animatedStats[index]}
                        {stat.suffix}
                      </div>
                      <div className="text-sm md:text-base text-gray-600 font-medium">
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