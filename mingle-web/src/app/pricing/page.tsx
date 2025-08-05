"use client";

import { CiCircleCheck } from "react-icons/ci";

const plans = [
  {
    title: "Free",
    price: "$0",
    subtitle: "/ Month",
    features: [
      "2 date matches per month",
      "Basic profile insights",
      "Limited chat access",
      "Community access",
    ],
    button: "Purchase Plan",
    highlighted: false,
  },
  {
    title: "Advanced",
    price: "$150",
    subtitle: "/ Month",
    features: [
      "AI Match Advisor",
      "Unlimited date matches",
      "1-day profile unlocks",
      "Priority chat support",
      "All feature access",
    ],
    button: "Purchase Plan",
    highlighted: true,
  },
  {
    title: "Team",
    price: "$180",
    subtitle: "/ Month",
    features: [
      "AI Match Advisor",
      "Unlimited date matches",
      "1-day profile unlocks",
      "Priority chat support",
      "All feature access",
    ],
    button: "Purchase Plan",
    highlighted: false,
  },
];

export default function PricingSection() {
  return (
    <section className="py-16 px-6 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-100 h-screen">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-pink-700 mb-3">Choose Your Plan 💖</h2>
        <p className="text-gray-600 mb-10">7 Days free trial. No credit card required.</p>

        <div className="flex justify-center gap-6 flex-wrap">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`flex flex-col w-full sm:w-80 rounded-2xl border p-6 shadow-md transition-all ${
                plan.highlighted
                  ? "bg-white border-pink-300 shadow-lg scale-105"
                  : "bg-white border-gray-200"
              }`}
            >
              {plan.highlighted && (
                <span className="text-xs font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-500 py-1 px-3 rounded-full self-center mb-3">
                  MOST POPULAR
                </span>
              )}
              <h3 className="text-xl font-bold text-pink-700">{plan.title}</h3>
              <div className="text-3xl font-bold text-purple-600 my-2">{plan.price}</div>
              <div className="text-sm text-gray-500">{plan.subtitle}</div>

              <ul className="my-6 space-y-2 text-left">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700">
                    <CiCircleCheck className="text-pink-500 text-xl" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`mt-auto py-3 rounded-xl text-sm font-semibold transition-all ${
                  plan.highlighted
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
                    : "bg-pink-100 text-pink-700 hover:bg-pink-200"
                }`}
              >
                {plan.button}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
