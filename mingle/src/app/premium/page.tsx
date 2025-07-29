'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PremiumPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const router = useRouter();

  const getPrice = (monthlyPrice: number) => {
    return billingPeriod === 'yearly' ? Math.round(monthlyPrice * 0.85) : monthlyPrice;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-pink-100 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-pink-500 fill-current" />
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Mingle
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-pink-500 transition-colors">About</Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-pink-500 transition-colors">Features</Link>
            <Link href="/premium" className="text-pink-500 font-medium">Pricing</Link>
            <Link href="/" className="text-gray-600 hover:text-pink-500 transition-colors">Blog</Link>
            <Link href="/" className="text-gray-600 hover:text-pink-500 transition-colors">Customer Stories</Link>
          </nav>
          <Button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2">
            <Heart className="w-4 h-4" />
            <span>Buy Now</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back Button */}
        <div className="mb-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/comperision')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Comparison
          </Button>
        </div>
        
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-pink-600 mb-4">Simple, straightforward pricing</h1>
          <p className="text-xl text-gray-600 mb-8">Join 500,000+ professionals who use Mingle to boost their dating success.</p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-8 mb-8">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                billingPeriod === 'monthly' 
                  ? 'bg-pink-500 text-white shadow-md' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                billingPeriod === 'yearly' 
                  ? 'bg-pink-500 text-white shadow-md' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Yearly
            </button>
            <span className="text-base text-gray-600 font-medium ml-8">Save up to 15% by paying yearly</span>
            <Link href="/comperision" className="text-base text-pink-600 hover:text-pink-700 font-medium ml-10">
              View Full Comparison →
            </Link>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Basic Plan */}
          <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl p-8 text-white relative">
            <h3 className="text-2xl font-bold mb-2">Basic Plan</h3>
            <div className="text-4xl font-bold mb-2">${getPrice(49)}/{billingPeriod === 'yearly' ? 'year' : 'month'}</div>
            <p className="text-pink-100 mb-6">Perfect for new users starting their dating journey</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <span className="text-pink-200 mr-3">✓</span>
                2 date matches per month
              </li>
              <li className="flex items-center">
                <span className="text-pink-200 mr-3">✓</span>
                Basic profile insights
              </li>
              <li className="flex items-center">
                <span className="text-pink-200 mr-3">✓</span>
                Limited chat access
              </li>
              <li className="flex items-center">
                <span className="text-pink-200 mr-3">✓</span>
                Community access
              </li>
            </ul>
            <Button className="w-full bg-white text-pink-600 hover:bg-gray-100 font-bold py-3 rounded-xl">
              Start Free Trial
            </Button>
          </div>

          {/* Popular Plan */}
          <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl p-8 text-white relative transform scale-105">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-pink-400 text-white px-4 py-1 rounded-full text-sm font-bold">
              MOST POPULAR
            </div>
            <h3 className="text-2xl font-bold mb-2">Popular Plan</h3>
            <div className="text-4xl font-bold mb-2">${getPrice(124)}/{billingPeriod === 'yearly' ? 'year' : 'month'}</div>
            <p className="text-pink-100 mb-6">Perfect for active users seeking meaningful connections</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <span className="text-pink-200 mr-3">✓</span>
                AI Match Advisor
              </li>
              <li className="flex items-center">
                <span className="text-pink-200 mr-3">✓</span>
                Unlimited date matches
              </li>
              <li className="flex items-center">
                <span className="text-pink-200 mr-3">✓</span>
                1-day profile unlocks
              </li>
              <li className="flex items-center">
                <span className="text-pink-200 mr-3">✓</span>
                Priority chat support
              </li>
              <li className="flex items-center">
                <span className="text-pink-200 mr-3">✓</span>
                All feature access
              </li>
            </ul>
            <Button className="w-full bg-white text-pink-600 hover:bg-gray-100 font-bold py-3 rounded-xl">
              Start 7-days Free Trial
            </Button>
          </div>

          {/* Pro Plan */}
          <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl p-8 text-white relative">
            <h3 className="text-2xl font-bold mb-2">Pro Plan</h3>
            <div className="text-4xl font-bold mb-2">${getPrice(299)}/{billingPeriod === 'yearly' ? 'year' : 'month'}</div>
            <p className="text-pink-100 mb-6">Perfect for serious daters with premium features</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <span className="text-pink-200 mr-3">✓</span>
                Advanced AI Match Advisor
              </li>
              <li className="flex items-center">
                <span className="text-pink-200 mr-3">✓</span>
                Priority support
              </li>
              <li className="flex items-center">
                <span className="text-pink-200 mr-3">✓</span>
                24/7 priority assistance
              </li>
              <li className="flex items-center">
                <span className="text-pink-200 mr-3">✓</span>
                Email automation
              </li>
              <li className="flex items-center">
                <span className="text-pink-200 mr-3">✓</span>
                Exclusive events access
              </li>
            </ul>
            <Button className="w-full bg-white text-pink-600 hover:bg-gray-100 font-bold py-3 rounded-xl">
              Start Free Trial
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 