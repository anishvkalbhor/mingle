"use client";

import { CheckIcon, XIcon, Server, Cloud } from "lucide-react";
import { motion } from "framer-motion";

const Com = () => {
  return (
    <motion.div
      className="min-h-screen bg-rose-50 flex flex-col items-center px-4 py-16"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      {/* Top Heading */}
      <motion.div
        className="text-center mb-14 max-w-2xl"
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          className="text-5xl font-bold text-pink-700 mb-4 tracking-tight"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Choose the Right Plan for You 💕
        </motion.h1>
        <motion.p
          className="text-rose-500 text-lg"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Whether you're looking for a basic start or full premium perks, we’ve got a match for you.
        </motion.p>
      </motion.div>

      <motion.div
        className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10"
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        whileInView={{ y: 0, opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {[{
          title: "Normal User",
          icon: <Server className="h-8 w-8 text-pink-500" />,
          bg: "bg-white",
          header: "Enjoy essential features and start your matching journey.",
          badge: null,
          features: [
            ["Create Profile", true],
            ["Like / Pass", "30/day"],
            ["Send Messages", false],
            ["View Who Liked You", false],
            ["AI-based Match Suggestions", "Basic Matching"],
            ["Profile Boost", false],
            ["Watch Video Bios", false],
            ["Access Verified Profiles", false],
            ["Trust Score Visibility", false],
            ["Join Virtual Events", false],
            ["Filter Matches (Location, Job, etc.)", false],
            ["Verified-Only Mode", false],
            ["Priority in Search Results", false],
            ["No Ads", false],
            ["Customer Support Priority", false],
          ],
          button: "Try Free"
        }, {
          title: "Premium User",
          icon: <Cloud className="h-10 w-10 text-pink-600" />,
          bg: "bg-gradient-to-br from-pink-100 to-rose-200",
          header: "Unlock everything Mingle has to offer — unmatched access and power.",
          badge: "Most Popular",
          features: [
            ["Create Profile", true],
            ["Like / Pass", "Unlimited"],
            ["Send Messages", true],
            ["View Who Liked You", true],
            ["AI-based Match Suggestions", "Smart Matching"],
            ["Profile Boost", "Weekly Boost"],
            ["Watch Video Bios", true],
            ["Access Verified Profiles", true],
            ["Trust Score Visibility", true],
            ["Join Virtual Events", true],
            ["Filter Matches (Location, Job, etc.)", true],
            ["Verified-Only Mode", true],
            ["Priority in Search Results", true],
            ["No Ads", true],
            ["Customer Support Priority", true],
          ],
          button: "Go Premium"
        }].map((plan, index) => (
          <motion.div
            key={index}
            className={`${plan.bg} p-8 rounded-3xl shadow-md relative`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            {plan.badge && (
              <span className="absolute top-0 right-0 m-3 text-xs bg-pink-600 text-white font-semibold px-3 py-1 rounded-full">
                {plan.badge}
              </span>
            )}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-semibold text-pink-700 mb-1">{plan.title}</h3>
                <p className="text-rose-600">{plan.header}</p>
              </div>
              <div className="p-3 rounded-lg bg-pink-100">{plan.icon}</div>
            </div>
            <ul className="divide-y divide-rose-200 text-sm mt-6">
              {plan.features.map(([text, value], i) => (
                <li key={i} className="flex justify-between items-center py-2">
                  <span className="text-rose-700 font-medium">{text}</span>
                  {value === true ? (
                    <CheckIcon className="h-4 w-4 text-green-500" />
                  ) : value === false ? (
                    <XIcon className="h-4 w-4 text-red-400" />
                  ) : (
                    <span className="text-rose-500">{value}</span>
                  )}
                </li>
              ))}
            </ul>
            <motion.button
              className="mt-6 w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {plan.button}
            </motion.button>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Com;
