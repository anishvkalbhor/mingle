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
      id="about"
      className="relative py-16 bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 overflow-hidden"
    >
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

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          <div className="w-full lg:w-[45%] flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <img 
                src="/couple.png" 
                alt="Happy Couple" 
                className="w-full h-auto rounded-2xl shadow-2xl object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-purple-200/30 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full -translate-y-10 translate-x-10 opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full translate-y-6 -translate-x-6 opacity-50"></div>
              
              <div className="relative z-10">
                <h3 className="text-base font-bold text-gray-800 mb-3 text-center">
                  Our Success Metrics
                </h3>
                
                <div className="grid grid-cols-3 gap-3">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      className="text-center group"
                      whileHover={{ scale: 1.05, y: -2 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-1 shadow-lg group-hover:shadow-xl transition-shadow">
                        <span className="text-white text-xs font-bold">
                          {index === 0 ? "👥" : index === 1 ? "💕" : "📈"}
                        </span>
                      </div>
                      <div className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
                        {animatedStats[index]}{stat.suffix}
                      </div>
                      <div className="text-xs text-gray-600 font-medium">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          <div className="w-full lg:w-[55%] flex-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center lg:text-left mb-12"
            >
              <motion.h2
                className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent"
              >
                Why Choose Us?
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                className="text-lg text-gray-700 leading-relaxed font-medium max-w-2xl mx-auto lg:mx-0"
              >
                We combine cutting-edge technology with exceptional service to deliver results that exceed expectations.
              </motion.p>
            </motion.div>

            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0, rotate: 180 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{
                      duration: 1,
                      ease: [0.68, -0.55, 0.265, 1.55],
                      delay: 0.6 + index * 0.2
                    }}
                    viewport={{ once: true }}
                    className="bg-white/90 backdrop-blur-sm border border-purple-200 rounded-xl p-6 cursor-pointer hover:bg-white hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-lg"
                  >
                    <motion.div
                      className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-xl mb-4"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.4 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0, rotate: 180 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1.2, ease: [0.68, -0.55, 0.265, 1.55], delay: 0.5 }}
                viewport={{ once: true }}
                className="md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-full flex flex-col items-center justify-center z-20 shadow-lg"
              >
                <motion.div
                  className="text-2xl mb-1"
                  animate={{ rotate: [0, 90, 180, 270, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  ⚡
                </motion.div>
                <div className="text-gray-800 font-semibold text-center text-xs">
                  Core<br />Features
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 