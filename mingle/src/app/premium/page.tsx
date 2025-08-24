"use client";
import React, { useState } from "react";
import { BackToHomeButton } from "@/components/BackToHomeButton";

const CheckCircleIcon = ({ className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
      clipRule="evenodd"
    />
  </svg>
);

const XCircleIcon = ({ className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
      clipRule="evenodd"
    />
  </svg>
);

const StarIcon = ({ className = "w-4 h-4" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M10.868 2.884c.321-.662 1.134-.662 1.456 0l1.86 3.843 4.251.618c.733.107 1.028.997.494 1.512l-3.076 2.998.726 4.234c.125.73-.641 1.285-1.29.95l-3.8-2.003-3.8 2.003c-.649.335-1.415-.22-1.29-.95l.726-4.234-3.076-2.998c-.534-.515-.239-1.405.494-1.512l4.251-.618 1.86-3.843z"
      clipRule="evenodd"
    />
  </svg>
);


const pricingPlans = [
  {
    name: "Free",
    monthlyPrice: 19,
    annualPrice: 17,
    description:
      "Start Your Journey – No Cost, No Pressure.",
    features: [
      { text: "Create & verify profile", included: true },
      { text: "Daily 5 AI-based matches", included: true },
      { text: "Swipe & Match (limited)", included: true },
      { text: "Basic profile viewing", included: true },
      { text: "Mutual chat access only", included: true },
      { text: " No advanced filters", included: false },
      { text: "No priority visibility", included: false },
    ],
    isActive: true,
  },
  {
    name: "Plus",
    monthlyPrice: 29,
    annualPrice: 19,
    originalAnnualPrice: 26,
    description:
      "Level Up Your Love Life.",
    features: [
      { text: "Everything in Free Plan", included: true },
      { text: "25 daily matches", included: true },
      { text: "See who liked your profile", included: true },
      { text: "Unlimited swipes", included: true },
      { text: "Rewind last swipe", included: true },
      { text: "Access to all profile video bios", included: true },
      { text: "No ads", included: false },
      { text: "Still limited visibility in match queue", included: false }
    ],
    isFeatured: true,
  },
  {
    name: "Premium",
    monthlyPrice: 39,
    annualPrice: 34,
    description:
      "Ultimate Experience. Serious Connections.",
    features: [
      { text: "Everything in Plus Plan", included: true },
      { text: "Unlimited matches & swipes", included: true },
      { text: "Send message without matching", included: true },
      { text: "Top visibility in matches", included: true },
      { text: "Advanced AI matchmaking", included: true },
      { text: "Hide age, location, last seen", included: true },
      { text: "Access to exclusive virtual events", included: true },
      { text: "Premium badge for trust & visibility", included: true }
    ],
    isPopular: true,
  },
];

const PricingCard = ({ plan, isAnnual }: { plan: any; isAnnual: boolean }) => {
  const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;

  return (
    <div
      className={`relative flex flex-col p-6 rounded-3xl border-2 transition duration-300 hover:shadow-2xl ${
        plan.isFeatured
          ? "bg-gradient-to-br from-pink-100 via-pink-50 to-white border-pink-300 shadow-2xl hover:shadow-pink-300/50 transform lg:scale-105"
          : "bg-white/80 backdrop-blur-md border-pink-100 hover:shadow-pink-100"
      }`}
      style={{
        boxShadow: plan.isFeatured
          ? "0 0 30px rgba(236, 72, 153, 0.2), 0 0 60px rgba(147, 51, 234, 0.15), 0 0 90px rgba(236, 72, 153, 0.1)"
          : "0 0 20px rgba(236, 72, 153, 0.1), 0 0 40px rgba(147, 51, 234, 0.05)",
      }}
    >
      <div className="absolute top-0 -translate-y-1/2 flex items-center gap-x-2">
        {plan.isActive && (
          <span className="text-xs font-semibold px-3 py-1 bg-white border-2 border-pink-200 rounded-full text-gray-600">
            Active
          </span>
        )}
        {plan.isFeatured && (
          <span className="text-xs font-semibold px-3 py-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full shadow-lg">
            Save 27%
          </span>
        )}
        {plan.isPopular && (
          <span className="flex items-center gap-1 text-xs font-semibold px-3 py-1 bg-white border-2 border-pink-200 rounded-full text-gray-600">
            <StarIcon /> Popular
          </span>
        )}
      </div>

      <h3
        className={`text-lg font-semibold ${
          plan.isFeatured ? "text-gray-900" : "text-gray-900"
        }`}
      >
        {plan.name}
      </h3>

      <div className="flex items-end gap-x-2 mt-3">
        {plan.originalAnnualPrice && isAnnual && (
          <span
            className={`text-2xl font-medium line-through ${
              plan.isFeatured ? "text-gray-400" : "text-gray-400"
            }`}
          >
            ${plan.originalAnnualPrice}
          </span>
        )}
        <span
          className={`text-4xl font-bold tracking-tight ${
            plan.isFeatured ? "text-gray-900" : "text-gray-900"
          }`}
        >
          ${price}
        </span>
        <span
          className={`text-sm font-semibold ${
            plan.isFeatured ? "text-gray-500" : "text-gray-500"
          }`}
        >
          / month (USD)
        </span>
      </div>
      <p
        className={`text-sm mt-1 ${
          plan.isFeatured ? "text-gray-500" : "text-gray-500"
        }`}
      >
        ${price * 12} billed yearly
      </p>
      <p
        className={`mt-4 text-sm font-bold font-sans leading-6 ${
          plan.isFeatured ? "text-black" : "text-gray-600"
        }`}
      >
        {plan.description}
      </p>

      <ul role="list" className="mt-6 space-y-3 flex-1">
        {plan.features.map((feature: any, index: any) => (
          <li key={index} className="flex items-start gap-x-3">
            {feature.included ? (
              <CheckCircleIcon
                className={`w-5 h-5 flex-shrink-0 ${
                  plan.isFeatured ? "text-green-500" : "text-green-500"
                }`}
              />
            ) : (
              <XCircleIcon className="w-5 h-5 flex-shrink-0 text-gray-400" />
            )}
            <span
              className={`text-sm ${
                plan.isFeatured ? "text-gray-700" : "text-gray-600"
              }`}
            >
              {feature.text}
            </span>
          </li>
        ))}
      </ul>

      <button
        className={`mt-6 block w-full py-3 px-6 rounded-lg text-center font-semibold text-sm transition-colors cursor-pointer
        ${
          plan.isFeatured
            ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:brightness-110"
            : plan.isActive
            ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }
      `}
      >
        {plan.isActive ? "Cancel" : "Start 7-days Free Trial"}
      </button>
    </div>
  );
};

export default function App() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="flex antialiased bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 min-h-screen p-4 font-sans justify-center items-center">
      <BackToHomeButton />
      <main className="w-full max-w-7xl">
        <div className="flex flex-col items-center">
          <h2 className="text-5xl text-gray-900 font-bold font-urbanist">
            Pricing
          </h2>

          <div className="mt-4 flex items-center justify-center">
  <div className="relative flex items-center w-56 h-12 bg-gradient-to-r from-pink-100 via-purple-100 to-purple-50 rounded-full shadow-inner p-1">
    {/* Slider */}
    <span
      className={`absolute top-1 left-1 h-10 w-[calc(50%-4px)] rounded-full shadow-lg bg-gradient-to-r from-pink-500 to-purple-600 transition-transform duration-300 ease-in-out
        ${isAnnual ? "translate-x-0" : "translate-x-full"}
      `}
      style={{ zIndex: 1 }}
    />
    
    {/* Annual button */}
    <button
      onClick={() => setIsAnnual(true)}
      className={`relative z-10 flex-1 h-10 flex items-center justify-center rounded-full font-semibold text-sm transition-colors
        ${isAnnual ? "text-white font-bold" : "text-purple-600 hover:text-purple-800"}
      `}
    >
      Annual
    </button>
    
    {/* Monthly button */}
    <button
      onClick={() => setIsAnnual(false)}
      className={`relative z-10 flex-1 h-10 flex items-center justify-center rounded-full font-semibold text-sm transition-colors
        ${!isAnnual ? "text-white font-bold" : "text-purple-600 hover:text-purple-800"}
      `}
    >
      Monthly
    </button>
  </div>
</div>

        </div>

        <div className="mt-6 grid lg:grid-cols-3 gap-y-6 lg:gap-x-8 lg:gap-y-0 items-start">
          {pricingPlans.map((plan, index) => (
            <PricingCard key={index} plan={plan} isAnnual={isAnnual} />
          ))}
        </div>
      </main>
    </div>
  );
}
