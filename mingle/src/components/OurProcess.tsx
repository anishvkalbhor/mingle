"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Briefcase,
  Bot,
  MessageCircle,
  Star,
  CheckCircleIcon,
} from "lucide-react";

const steps = [
  {
    icon: CreditCard,
    title: "Discovery",
    subtitle: "& Planning",
    color: "purple",
    description: [
      "Join Mingle in minutes",
      "Sign up using Phone, Email, Google, or Apple ID",
      "Verify via Aadhaar OTP (UIDAI integration)",
      "Ensures real users only — no bots, no catfishing",
    ],
  },
  {
    icon: Briefcase,
    title: "Design",
    subtitle: "& Prototyping",
    color: "blue",
    description: [
      "Let your personality shine",
      "Add your bio, profession, interests, relationship goals",
      "Upload your profile picture + optional video bio",
      "Answer fun MCQs to train our AI",
    ],
  },
  {
    icon: Bot,
    title: "Development",
    subtitle: "& Testing",
    color: "green",
    description: [
      "AI does the hard work for you",
      "Matches based on interests, lifestyle, personality, location",
      "Trust score & Compatibility score with each profile",
      "No more endless swiping",
    ],
  },
  {
    icon: MessageCircle,
    title: "Deployment",
    subtitle: "& Launch",
    color: "orange",
    description: [
      "Start real conversations",
      "Send messages, photos, reactions",
      "Voice & video calls in-app",
      "Virtual Date Rooms for safe first meets",
    ],
  },
  {
    icon: Star,
    title: "Support",
    subtitle: "& Maintenance",
    color: "pink",
    description: [
      "Unlock the best of Mingle",
      "Boost your profile to appear first",
      "Access premium filters & advanced matching",
      "See who viewed/liked you",
    ],
  },
];

type StepColor = "purple" | "blue" | "green" | "orange" | "pink";

const colorVariants: Record<
  StepColor,
  {
    bg: string;
    gradient: string;
    progressGradient: string;
    text: string;
    iconBg: string;
    cardBg: string;
  }
> = {
  purple: {
    bg: "bg-purple-600",
    gradient: "bg-gradient-to-br from-purple-500 to-purple-600",
    progressGradient: "from-purple-500 to-purple-600",
    text: "text-purple-600",
    iconBg: "bg-gradient-to-r from-purple-500 to-purple-700",
    cardBg: "bg-purple-50",
  },
  blue: {
    bg: "bg-blue-600",
    gradient: "bg-gradient-to-br from-blue-500 to-blue-600",
    progressGradient: "from-blue-500 to-blue-600",
    text: "text-blue-600",
    iconBg: "bg-gradient-to-r from-blue-500 to-blue-700",
    cardBg: "bg-blue-50",
  },
  green: {
    bg: "bg-green-600",
    gradient: "bg-gradient-to-br from-green-500 to-green-600",
    progressGradient: "from-green-500 to-green-600",
    text: "text-green-600",
    iconBg: "bg-gradient-to-r from-green-500 to-green-700",
    cardBg: "bg-green-50",
  },
  orange: {
    bg: "bg-orange-600",
    gradient: "bg-gradient-to-br from-orange-500 to-orange-600",
    progressGradient: "from-orange-500 to-orange-600",
    text: "text-orange-600",
    iconBg: "bg-gradient-to-r from-orange-500 to-orange-700",
    cardBg: "bg-orange-50",
  },
  pink: {
    bg: "bg-pink-600",
    gradient: "bg-gradient-to-br from-pink-500 to-pink-600",
    progressGradient: "from-pink-500 to-pink-600",
    text: "text-pink-600",
    iconBg: "bg-gradient-to-r from-pink-500 to-pink-700",
    cardBg: "bg-pink-50",
  },
};

const OurProcess = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isFixed, setIsFixed] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const totalSteps = steps.length;

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !triggerRef.current) return;

      const triggerTop = triggerRef.current.getBoundingClientRect().top;
      const triggerHeight = triggerRef.current.offsetHeight;
      const windowHeight = window.innerHeight;

      if (triggerTop <= 0 && triggerTop > -triggerHeight + windowHeight) {
        setIsFixed(true);

        const scrolledDistance = Math.abs(triggerTop);
        const maxScrollDistance = triggerHeight - windowHeight;
        const progress = Math.min(scrolledDistance / maxScrollDistance, 1);

        setScrollProgress(progress);

        const stepHeight = maxScrollDistance / (totalSteps - 1);
        const newStep = Math.min(
          Math.round(scrolledDistance / stepHeight),
          totalSteps - 1
        );

        setCurrentStep(newStep);
      } else if (triggerTop <= -triggerHeight + windowHeight) {
        setIsFixed(false);
        setCurrentStep(totalSteps - 1);
        setScrollProgress(1);
      } else {
        setIsFixed(false);
        setCurrentStep(0);
        setScrollProgress(0);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [totalSteps]);

  const currentStepColor =
    colorVariants[steps[currentStep]?.color as StepColor];

  return (
    <>
      <div
        ref={triggerRef}
        className="relative w-full"
        style={{
          height: `${(steps.length + 2) * 100}vh`,
          backgroundColor: "#ffffff",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='199' viewBox='0 0 100 199'%3E%3Cg fill='%239C92AC' fill-opacity='0.14'%3E%3Cpath d='M0 199V0h1v1.99L100 199h-1.12L1 4.22V199H0zM100 2h-.12l-1-2H100v2z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        <div
          ref={containerRef}
          className={`${
            isFixed
              ? "fixed top-30 left-0 w-full"
              : "absolute top-0 left-0 w-full"
          } h-screen z-10`}
          style={{
            top: isFixed ? undefined : scrollProgress === 1 ? "auto" : "0",
            bottom: isFixed ? undefined : scrollProgress === 1 ? "0" : "auto",
          }}
        >
          <section
            id="our-process"
            className="h-screen relative overflow-hidden flex items-center justify-center"
            style={{
              backgroundColor: "#ffffff",
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='199' viewBox='0 0 100 199'%3E%3Cg fill='%239C92AC' fill-opacity='0.14'%3E%3Cpath d='M0 199V0h1v1.99L100 199h-1.12L1 4.22V199H0zM100 2h-.12l-1-2H100v2z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E")`,
            }}
          >
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full flex flex-col justify-center ">
              <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl sm:text-2xl md:text-7xl tracking-tighter font-bold font-sans bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                  Our Process
                </h2>
                <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  Our battle-tested 5-step methodology ensures your experience
                  exceeds expectations while staying safe, smart, and secure.
                </p>
              </motion.div>
              <div className="relative mb-8">
                <div className="hidden sm:flex items-center justify-between relative">
                  <div className="absolute top-7 left-[10%] right-[10%] h-1.5 bg-gray-200 rounded-full"></div>

                  <motion.div
                    className={`absolute top-7 left-[10%] h-1.5 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full`}
                    style={{ width: `${scrollProgress * 80}%` }}
                    transition={{ duration: 0.2 }}
                  />

                  {steps.map((step, idx) => {
                    const Icon = step.icon;
                    const isActive = idx === currentStep;
                    const isCompleted = idx < currentStep;
                    const stepColor = colorVariants[step.color as StepColor];

                    return (
                      <div
                        key={idx}
                        className="flex flex-col items-center w-1/5 text-center relative z-10"
                      >
                        <div
                          className={`w-16 h-16 flex items-center justify-center rounded-2xl mb-3 shadow-sm transition-all duration-300 ${
                            isCompleted
                              ? stepColor.gradient + " text-white"
                              : isActive
                              ? stepColor.bg + " text-white"
                              : "bg-white text-gray-400 border border-gray-200"
                          }`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>

                        <div>
                          <p
                            className={`text-sm font-semibold transition-colors duration-300 ${
                              isActive || isCompleted
                                ? stepColor.text
                                : "text-gray-400"
                            }`}
                          >
                            {step.title}
                          </p>
                          <p className="text-xs text-gray-400">
                            {step.subtitle}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-center flex-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    className="w-full max-w-6xl"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{
                      duration: 0.5,
                      type: "spring",
                      stiffness: 100,
                      damping: 15,
                    }}
                  >
                    <div
                      className={`${currentStepColor?.cardBg} rounded-2xl shadow-md p-8 flex flex-col md:flex-row items-start justify-between relative overflow-hidden`}
                    >
                      <div className="flex-1">
                        <motion.span
                          className={`text-sm font-semibold ${currentStepColor?.text} mb-2 block`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          Step {currentStep + 1} of {steps.length}
                        </motion.span>

                        <motion.h3
                          className="text-2xl md:text-3xl font-bold text-gray-900 mb-3"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          {steps[currentStep].title}{" "}
                          <span className={currentStepColor?.text}>
                            {steps[currentStep].subtitle}
                          </span>
                        </motion.h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {steps[currentStep].description.map((point, i) => (
                            <motion.div
                              key={i}
                              className="flex items-center space-x-2"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                delay: 0.5 + i * 0.1,
                                type: "spring",
                              }}
                            >
                              <CheckCircleIcon
                                className={`w-5 h-5 ${currentStepColor?.text} flex-shrink-0`}
                              />
                              <span className="text-gray-800 text-sm md:text-base">
                                {point}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-8 md:mt-0 md:ml-8 flex-shrink-0">
                        <div
                          className={`w-20 h-20 md:w-28 md:h-28 ${currentStepColor?.iconBg} rounded-2xl flex items-center justify-center shadow-lg`}
                        >
                          {React.createElement(steps[currentStep].icon, {
                            className: "w-10 h-10 md:w-12 md:h-12 text-white",
                          })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default OurProcess;
