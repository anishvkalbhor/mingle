import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CreditCard, 
  Briefcase, 
  Bot, 
  MessageCircle, 
  Star,
  Heart,
  Check
} from "lucide-react";

const steps = [
  {
    icon: CreditCard,
    title: "Step 1: Sign Up & Aadhaar Verification",
    description: [
      "Join Mingle in minutes",
      "Sign up using Phone, Email, Google, or Apple ID",
      "Verify via Aadhaar OTP (UIDAI integration)",
      "Ensures real users only — no bots, no catfishing",
      "Your data is 100% secure and encrypted (GDPR & HIPAA compliant)"
    ]
  },
  {
    icon: Briefcase,
    title: "Step 2: Build Your Profile with Purpose",
    description: [
      "Let your personality shine",
      "Add your bio, profession, interests, relationship goals",
      "Upload your profile picture + optional video bio",
      "Answer fun MCQs to train our AI",
      "Video bios increase visibility & trust"
    ]
  },
  {
    icon: Bot,
    title: "Step 3: Get Smart Matches with AI",
    description: [
      "AI does the hard work for you",
      "Matches based on interests, lifestyle, personality, location",
      "Trust score & Compatibility score with each profile",
      "No more endless swiping"
    ]
  },
  {
    icon: MessageCircle,
    title: "Step 4: Connect Privately & Safely",
    description: [
      "Start real conversations",
      "Send messages, photos, reactions",
      "Voice & video calls in-app",
      "Virtual Date Rooms for safe first meets",
      "Block/report users easily",
      "Trust Score helps you decide"
    ]
  },
  {
    icon: Star,
    title: "Step 5: Upgrade for Exclusive Features (Optional)",
    description: [
      "Unlock the best of Mingle",
      "Boost your profile to appear first",
      "Access premium filters & advanced matching",
      "See who viewed/liked you",
      "Join verified-only communities & events",
      "Go premium to take control of your dating journey"
    ]
  }
];

const OurProcess = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessActive, setIsProcessActive] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !scrollContainerRef.current) return;
      
      const section = sectionRef.current;
      const scrollContainer = scrollContainerRef.current;
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Check if process section is in view
      const sectionInView = rect.top <= windowHeight * 0.3 && rect.bottom >= windowHeight * 0.3;
      setIsProcessActive(sectionInView);
      
      if (sectionInView) {
        // Calculate vertical scroll progress
        const scrollTop = scrollContainer.scrollTop;
        const cardHeight = 384; // h-96 = 24rem = 384px
        const gap = 32; // gap-8 = 2rem = 32px
        const totalCardHeight = cardHeight + gap;
        
        // Calculate current step based on scroll position
        const stepIndex = Math.round(scrollTop / totalCardHeight);
        const clampedStepIndex = Math.min(steps.length - 1, Math.max(0, stepIndex));
        
        setCurrentStep(clampedStepIndex);
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Function to scroll to specific step
  const scrollToStep = (stepIndex: number) => {
    if (!scrollContainerRef.current) return;
    
    const cardHeight = 384; // h-96 = 24rem = 384px
    const gap = 32; // gap-8 = 2rem = 32px
    const totalCardHeight = cardHeight + gap;
    const scrollPosition = stepIndex * totalCardHeight;
    
    scrollContainerRef.current.scrollTo({
      top: scrollPosition,
      behavior: 'smooth'
    });
  };

  // Calculate progress line height
  const progressHeight = `calc(${(currentStep + 1) / steps.length * 100}% * (100% - 0px))`;

  return (
    <section ref={sectionRef} className="py-12 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Fixed Header - Only visible when process is active */}
        <AnimatePresence>
          {isProcessActive && (
            <motion.div
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12 sticky top-20 bg-white z-50 py-6 border-b border-gray-100 shadow-sm"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center rounded-full mx-auto mb-4 shadow-lg">
                <Heart className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
                Our Process
              </h2>
              <p className="text-base text-gray-600 max-w-2xl mx-auto">
                Our battle-tested 5-step methodology ensures your experience exceeds expectations while staying safe, smart, and secure.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Progress Bar - Left Side */}
          <div className="w-full lg:w-64 flex-shrink-0 mb-8 lg:mb-0">
            {/* Vertical Progress Line for desktop */}
            <div className="hidden lg:block sticky top-32">
              <div className="relative min-h-[400px]">
                <div className="absolute left-6 top-0 bottom-0 w-1 bg-gray-200 rounded-full h-full"></div>
                <div
                  className="absolute left-6 top-0 w-1 bg-gradient-to-b from-purple-600 via-purple-500 to-pink-500 rounded-full transition-all duration-500 shadow-sm"
                  style={{
                    height: `${Math.min((currentStep / (steps.length - 1)) * 100, 100)}%`,
                    maxHeight: "100%",
                  }}
                />
                {/* Timeline Steps (vertical) */}
                <div className="relative space-y-8">
                  {steps.map((step, idx) => {
                    const IconComponent = step.icon;
                    const isActive = idx === currentStep;
                    const isCompleted = idx < currentStep;
                    
                    return (
                      <motion.div
                        key={idx}
                        className="flex items-center cursor-pointer"
                        animate={{ scale: isActive ? 1.1 : 1 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => scrollToStep(idx)}
                        whileHover={{ scale: 1.05 }}
                      >
                        <motion.div 
                          className={`w-12 h-12 flex items-center justify-center rounded-full shadow-lg relative overflow-hidden transition-all duration-500 -translate-x-6 ${
                            isCompleted 
                              ? 'bg-gradient-to-br from-green-400 to-green-600 text-white' 
                              : isActive 
                                ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white' 
                                : 'bg-white text-gray-400 border-2 border-gray-300'
                          }`}
                        >
                          <AnimatePresence mode="wait">
                            {isCompleted ? (
                              <motion.div
                                key="check"
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, rotate: 180 }}
                                transition={{ duration: 0.3 }}
                              >
                                <Check className="w-6 h-6" />
                              </motion.div>
                            ) : (
                              <motion.div
                                key="icon"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <IconComponent className="w-6 h-6" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                          
                          {/* Active pulse effect */}
                          {isActive && (
                            <motion.div
                              className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-pink-500"
                              animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 0, 0.5],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            />
                          )}
                        </motion.div>
                        
                        <div className="ml-4">
                          <span 
                            className={`text-sm font-medium transition-colors duration-300 ${
                              isActive 
                                ? 'text-purple-600 font-bold' 
                                : isCompleted 
                                  ? 'text-green-600 font-semibold'
                                  : 'text-gray-500'
                            }`}
                          >
                            Step {idx + 1}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            {step.title.split(":")[1]?.trim() || step.title.split(":")[0]}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
            {/* Horizontal Progress Line for mobile */}
            <div className="block lg:hidden w-full mb-6">
              <div className="relative h-1 bg-gray-200 rounded-full w-full">
                <div
                  className="absolute top-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min((currentStep / (steps.length - 1)) * 100, 100)}%`,
                    maxWidth: "100%",
                  }}
                />
              </div>
              {/* Timeline Steps (horizontal) */}
              <div className="flex justify-between mt-2 px-2">
                {steps.map((step, idx) => {
                  const IconComponent = step.icon;
                  return (
                    <div key={idx} className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full shadow-lg ${
                          idx === currentStep
                            ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                            : 'bg-white text-gray-400 border-2 border-gray-300'
                        }`}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <span className={`mt-1 text-xs ${idx === currentStep ? 'text-purple-600 font-bold' : 'text-gray-500'}`}>
                        Step {idx + 1}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Step Details - Right Side with Vertical Scroll */}
          <div className="flex-1 w-full">
            <div 
              ref={scrollContainerRef}
              className="flex flex-col gap-8 overflow-y-auto scrollbar-hide pb-4"
              style={{ 
                scrollSnapType: 'y mandatory',
                scrollBehavior: 'smooth',
                maxHeight: '600px'
              }}
            >
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                
                return (
                  <motion.div
                    key={index}
                    className="w-full min-h-[300px] sm:min-h-[384px] flex-shrink-0 scroll-snap-start"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ 
                      opacity: index === currentStep ? 1 : 0.3,
                      y: index === currentStep ? 0 : 50,
                      scale: index === currentStep ? 1 : 0.95
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-100 relative overflow-hidden h-full">
                      {/* Background decoration */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full -translate-y-12 translate-x-12 opacity-50"></div>
                      
                      <div className="relative z-10">
                        <motion.div 
                          className="flex items-center mb-4"
                          initial={{ x: -30, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center mr-3 shadow-md">
                            <IconComponent className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <span className="text-purple-600 font-semibold text-base">
                              Step {index + 1} of {steps.length}
                            </span>
                            <h3 className="text-lg font-bold text-gray-900 mt-1">
                              {step.title}
                            </h3>
                          </div>
                        </motion.div>
                        
                        <motion.div 
                          className="space-y-3"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          {step.description.map((point, i) => (
                            <motion.div
                              key={i}
                              className="flex items-start p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg"
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.4 + i * 0.1 }}
                            >
                              <motion.div 
                                className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-1.5 mr-3 flex-shrink-0"
                                whileHover={{ scale: 1.2 }}
                              />
                              <span className="text-gray-700 text-sm leading-relaxed font-medium">
                                {point}
                              </span>
                            </motion.div>
                          ))}
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurProcess;