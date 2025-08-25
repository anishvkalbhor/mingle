"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheck, FiX, FiCalendar, FiMapPin } from "react-icons/fi";
import confetti from "canvas-confetti";


interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  date: string;
  time: string;
  venue: string;
  location: string;
  address: string;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  date,
  time,
  venue,
  location,
  address,
}: ConfirmationModalProps) {
    const [showConfirmed, setShowConfirmed] = useState(false);
    
    useEffect(() => {
      if (isOpen) {
        setShowConfirmed(false);
      }
    }, [isOpen]);
    
    const triggerConfetti = () => {
        const end = Date.now() + 2.2 * 1000;
        const colors = ["#9333ea", "#ec4899", "#ffffff"];

        (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
    }

     const handleConfirm = () => {
    setShowConfirmed(true);
    
    triggerConfetti();
    
    setTimeout(() => {
      onConfirm();
    }, 2200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FiX size={24} />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheck className="text-white" size={32} />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Perfect Choice! 💖
              </h2>
              <p className="text-gray-600 mt-2">
                Your romantic date has been planned successfully!
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <FiCalendar className="text-purple-600" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Date & Time</p>
                  <p className="font-semibold text-gray-800">{date}</p>
                  <p className="text-sm text-purple-600">🕐 {time}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg">
                <FiMapPin className="text-pink-600" size={20} />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Venue</p>
                  <p className="font-semibold text-gray-800">{venue}</p>
                  <p className="text-xs text-gray-500">{location}</p>
                  <p className="text-xs text-gray-500">{address}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={showConfirmed}
                className={`flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg transition-all ${
                  showConfirmed 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-gray-50'
                }`}
              >
                Not Yet
              </button>
              <button
                onClick={handleConfirm}
                disabled={showConfirmed}
                className={`flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg transition-all ${
                  showConfirmed 
                    ? 'opacity-75 cursor-not-allowed animate-pulse' 
                    : 'hover:from-purple-700 hover:to-pink-700'
                }`}
              >
                {showConfirmed ? '✨ Confirming...' : 'Confirm Date! 💖'}
              </button>
              {showConfirmed && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="fixed inset-0 flex items-center justify-center z-[60]"
                  style={{ perspective: '1000px' }}
                >
                  <div className="slide-in-bck-center text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent px-4 py-2 whitespace-nowrap">
                     ❤️ Date Confirmed ❤️
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
