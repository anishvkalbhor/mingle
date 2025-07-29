"use client"
import React, { useState } from 'react';

// --- ICON COMPONENTS ---
// Using simple SVG components to avoid external dependencies.
// In a real project, you would use a library like lucide-react.

const CheckCircleIcon = ({ className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
  </svg>
);

const XCircleIcon = ({ className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
  </svg>
);

const StarIcon = ({ className = 'w-4 h-4' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M10.868 2.884c.321-.662 1.134-.662 1.456 0l1.86 3.843 4.251.618c.733.107 1.028.997.494 1.512l-3.076 2.998.726 4.234c.125.73-.641 1.285-1.29.95l-3.8-2.003-3.8 2.003c-.649.335-1.415-.22-1.29-.95l.726-4.234-3.076-2.998c-.534-.515-.239-1.405.494-1.512l4.251-.618 1.86-3.843z" clipRule="evenodd" />
    </svg>
);

const CogIcon = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5m-15.364 5.364l-1.06-1.06M20.06 18.94l-1.06-1.06m0-11.314l1.06-1.06M5.06 6.56l1.06-1.06M12 21v-1.5m0-15V3" />
    </svg>
);

const BellIcon = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    </svg>
);

// --- DATA ---
const pricingPlans = [
  {
    name: 'Recruit Basic',
    monthlyPrice: 19,
    annualPrice: 17,
    description: 'Get started with essential tools to manage your team efficiently. Ideal for small teams with fundamental needs.',
    features: [
      { text: 'Access to core HR features', included: true },
      { text: 'Employee record management', included: true },
      { text: 'Basic reporting tools', included: true },
      { text: 'Manage up to 10 team members', included: true },
      { text: 'Track employee attendance', included: false },
      { text: 'Assign and monitor tasks', included: false },
      { text: 'Email support', included: false },
      { text: 'Simple onboarding process', included: false },
      { text: 'Designed user-focused interfaces, optimized user', included: false },
    ],
    isActive: true,
  },
  {
    name: 'Talent Pro',
    monthlyPrice: 29,
    annualPrice: 19,
    originalAnnualPrice: 26,
    description: 'A comprehensive solution for growing teams, offering enhanced features to streamline HR processes.',
    features: [
      { text: 'Access to core HR features', included: true },
      { text: 'Employee record management', included: true },
      { text: 'Basic reporting tools', included: true },
      { text: 'Manage up to 10 team members', included: true },
      { text: 'Track employee attendance', included: true },
      { text: 'Assign and monitor tasks', included: true },
      { text: 'Email support', included: false },
      { text: 'Simple onboarding process', included: false },
      { text: 'Designed user-focused interfaces, optimized user', included: false },
    ],
    isFeatured: true,
  },
  {
    name: 'HR Master',
    monthlyPrice: 39,
    annualPrice: 34,
    description: 'Maximize team performance with premium tools and full customization options, perfect for larger organizations.',
    features: [
      { text: 'Access to core HR features', included: true },
      { text: 'Employee record management', included: true },
      { text: 'Basic reporting tools', included: true },
      { text: 'Manage up to 10 team members', included: true },
      { text: 'Track employee attendance', included: true },
      { text: 'Assign and monitor tasks', included: true },
      { text: 'Email support', included: true },
      { text: 'Simple onboarding process', included: true },
      { text: 'Designed user-focused interfaces, optimized user', included: true },
    ],
    isPopular: true,
  },
];

// --- PRICING CARD COMPONENT ---
const PricingCard = ({ plan, isAnnual }: { plan: any, isAnnual: boolean }) => {
  const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;

  return (
    <div className={`relative flex flex-col p-6 rounded-3xl border-2 ${plan.isFeatured ? 'bg-slate-900 border-yellow-400 transform lg:scale-105' : 'bg-white border-slate-200'}`}>
      {/* Badges */}
      <div className="absolute top-0 -translate-y-1/2 flex items-center gap-x-2">
        {plan.isActive && <span className="text-xs font-semibold px-3 py-1 bg-white border-2 border-slate-200 rounded-full text-slate-600">Active</span>}
        {plan.isFeatured && <span className="text-xs font-semibold px-3 py-1 bg-yellow-400 rounded-full text-slate-900">Save 27%</span>}
        {plan.isPopular && <span className="flex items-center gap-1 text-xs font-semibold px-3 py-1 bg-white border-2 border-slate-200 rounded-full text-slate-600"><StarIcon /> Popular</span>}
      </div>

      <h3 className={`text-lg font-semibold ${plan.isFeatured ? 'text-white' : 'text-slate-900'}`}>{plan.name}</h3>
      
      <div className="flex items-end gap-x-2 mt-3">
        {plan.originalAnnualPrice && isAnnual && (
          <span className={`text-2xl font-medium line-through ${plan.isFeatured ? 'text-slate-500' : 'text-slate-400'}`}>
            ${plan.originalAnnualPrice}
          </span>
        )}
        <span className={`text-4xl font-bold tracking-tight ${plan.isFeatured ? 'text-white' : 'text-slate-900'}`}>
          ${price}
        </span>
        <span className={`text-sm font-semibold ${plan.isFeatured ? 'text-slate-400' : 'text-slate-500'}`}>/ month (USD)</span>
      </div>
      <p className={`text-sm mt-1 ${plan.isFeatured ? 'text-slate-400' : 'text-slate-500'}`}>
        ${price * 12} billed yearly
      </p>
      <p className={`mt-4 text-sm leading-6 ${plan.isFeatured ? 'text-slate-300' : 'text-slate-600'}`}>
        {plan.description}
      </p>

      <ul role="list" className="mt-6 space-y-3 flex-1">
        {plan.features.map((feature:any, index:any) => (
          <li key={index} className="flex items-start gap-x-3">
            {feature.included ? (
              <CheckCircleIcon className={`w-5 h-5 flex-shrink-0 ${plan.isFeatured ? 'text-green-400' : 'text-green-500'}`} />
            ) : (
              <XCircleIcon className="w-5 h-5 flex-shrink-0 text-slate-400" />
            )}
            <span className={`text-sm ${plan.isFeatured ? 'text-slate-300' : 'text-slate-600'}`}>
              {feature.text}
            </span>
          </li>
        ))}
      </ul>
      
      {/* Button */}
      <button className={`mt-6 block w-full py-3 px-6 rounded-lg text-center font-semibold text-sm
        ${plan.isFeatured 
          ? 'bg-white text-slate-900 hover:bg-slate-200' 
          : plan.isActive 
            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            : 'bg-white border border-slate-300 text-slate-900 hover:bg-slate-50'
        }
      `}>
        {plan.isActive ? 'Cancel' : 'Start 7-days Free Trial'}
      </button>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
export default function App() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="antialiased bg-slate-100 overflow-hidden h-screen flex items-center justify-center p-4 font-sans">
        <main className="w-full max-w-7xl">
          <div className="flex flex-col items-center">
            <h2 className="text-5xl text-slate-900 font-bold font-urbanist">Pricing</h2>
            
            {/* Toggle Switch */}
            <div className="mt-4 relative flex items-center p-1 bg-slate-200 rounded-full">
                <button 
                    onClick={() => setIsAnnual(true)}
                    className={`relative w-24 py-2 text-sm font-semibold transition-colors cursor-pointer
                        ${isAnnual ? 'text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Annual
                </button>
                <button 
                    onClick={() => setIsAnnual(false)}
                    className={`relative w-24 py-2 text-sm font-semibold transition-colors cursor-pointer
                        ${!isAnnual ? 'text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Monthly
                </button>
                <span 
                    className={`absolute h-10 w-24 bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out
                    ${isAnnual ? 'transform translate-x-0' : 'transform translate-x-full'}`}
                ></span>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="mt-6 grid lg:grid-cols-3 gap-y-6 lg:gap-x-8 lg:gap-y-0 items-start">
            {pricingPlans.map((plan, index) => (
              <PricingCard key={index} plan={plan} isAnnual={isAnnual} />
            ))}
          </div>
        </main>
    </div>
  );
}
