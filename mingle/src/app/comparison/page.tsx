'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function ComparisonPage() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center py-12 px-4">
      {/* Back Button */}
      <div className="w-full max-w-4xl mb-8">
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
      </div>
      
      <h1 className="text-4xl font-bold text-pink-600 mb-2 text-center">Choose the Right Plan for You <span role="img" aria-label="hearts">💕</span></h1>
      <p className="text-lg text-gray-700 mb-10 text-center max-w-2xl">Whether you're looking for a basic start or full premium perks, we've got a match for you.</p>
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl justify-center">
        {/* Normal User Card */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg p-8 border border-pink-100 flex flex-col">
          <h2 className="text-2xl font-bold text-pink-500 mb-2">Normal User</h2>
          <p className="text-gray-500 mb-6">Enjoy essential features and start your matching journey.</p>
          <ul className="mb-8 text-gray-700 space-y-2 text-sm">
            <li className="flex justify-between"><span>Create Profile</span> <span>✔️</span></li>
            <li className="flex justify-between"><span>Like / Pass</span> <span>30/day</span></li>
            <li className="flex justify-between"><span>Send Messages</span> <span>❌</span></li>
            <li className="flex justify-between"><span>View Who Liked You</span> <span>❌</span></li>
            <li className="flex justify-between"><span>AI-based Match Suggestions</span> <span>Basic Matching</span></li>
            <li className="flex justify-between"><span>Profile Boost</span> <span>❌</span></li>
            <li className="flex justify-between"><span>Watch Video Bios</span> <span>❌</span></li>
            <li className="flex justify-between"><span>Access Verified Profiles</span> <span>❌</span></li>
            <li className="flex justify-between"><span>Trust Score Visibility</span> <span>❌</span></li>
            <li className="flex justify-between"><span>Join Virtual Events</span> <span>❌</span></li>
            <li className="flex justify-between"><span>Filter Matches (Location, Job, etc.)</span> <span>❌</span></li>
            <li className="flex justify-between"><span>Verified-Only Mode</span> <span>❌</span></li>
            <li className="flex justify-between"><span>Priority in Search Results</span> <span>❌</span></li>
            <li className="flex justify-between"><span>No Ads</span> <span>❌</span></li>
            <li className="flex justify-between"><span>Customer Support Priority</span> <span>❌</span></li>
          </ul>
          <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-3 rounded-xl mt-auto" onClick={() => router.push('/sign-up')}>Try Free</Button>
        </div>
        {/* Premium User Card */}
        <div className="flex-1 bg-pink-100/60 rounded-2xl shadow-lg p-8 border-2 border-pink-300 flex flex-col relative">
          <span className="absolute top-4 right-4 bg-pink-500 text-white text-xs px-3 py-1 rounded-full font-bold">Most Popular</span>
          <h2 className="text-2xl font-bold text-pink-600 mb-2">Premium User</h2>
          <p className="text-gray-600 mb-6">Unlock everything Mingle has to offer — unmatched access and power.</p>
          <ul className="mb-8 text-gray-800 space-y-2 text-sm">
            <li className="flex justify-between"><span>Create Profile</span> <span>✔️</span></li>
            <li className="flex justify-between"><span>Like / Pass</span> <span>Unlimited</span></li>
            <li className="flex justify-between"><span>Send Messages</span> <span>✔️</span></li>
            <li className="flex justify-between"><span>View Who Liked You</span> <span>✔️</span></li>
            <li className="flex justify-between"><span>AI-based Match Suggestions</span> <span>Smart Matching</span></li>
            <li className="flex justify-between"><span>Profile Boost</span> <span>Weekly Boost</span></li>
            <li className="flex justify-between"><span>Watch Video Bios</span> <span>✔️</span></li>
            <li className="flex justify-between"><span>Access Verified Profiles</span> <span>✔️</span></li>
            <li className="flex justify-between"><span>Trust Score Visibility</span> <span>✔️</span></li>
            <li className="flex justify-between"><span>Join Virtual Events</span> <span>✔️</span></li>
            <li className="flex justify-between"><span>Filter Matches (Location, Job, etc.)</span> <span>✔️</span></li>
            <li className="flex justify-between"><span>Verified-Only Mode</span> <span>✔️</span></li>
            <li className="flex justify-between"><span>Priority in Search Results</span> <span>✔️</span></li>
            <li className="flex justify-between"><span>No Ads</span> <span>✔️</span></li>
            <li className="flex justify-between"><span>Customer Support Priority</span> <span>✔️</span></li>
          </ul>
          <Button className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold py-3 rounded-xl mt-auto" onClick={() => router.push('/premium')}>Go Premium</Button>
        </div>
      </div>
    </div>
  );
} 