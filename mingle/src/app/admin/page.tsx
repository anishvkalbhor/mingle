'use client';

import React, { useEffect, useState } from 'react';
import { useUser, UserButton, useAuth } from '@clerk/nextjs';
import { Heart } from 'lucide-react';
import FlaggedUsers from './flagged-users';
import DashboardPage from '../dashboard/page';

const ADMIN_SIDEBAR_TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'flagged-users', label: 'Flagged Users' },
  // Add more admin tabs here if needed
];

export default function AdminDashboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const fetchUser = async () => {
      if (isSignedIn && user) {
        const res = await fetch(`/api/users/me`);
        if (res.ok) {
          const data = await res.json();
          setIsAdmin(data?.data?.isAdmin || false);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [isSignedIn, user]);

  if (!isLoaded || loading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return <div style={{ padding: 32, color: 'red' }}>Unauthorized: You do not have access to the admin dashboard.</div>;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Sidebar */}
      <div className="w-64 bg-white/80 backdrop-blur-md border-r border-pink-100 flex flex-col p-6">
        <div className="flex items-center gap-2 mb-8">
          <Heart className="w-8 h-8 text-pink-500 fill-current" />
          <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Mingle</span>
        </div>
        <nav className="flex flex-col gap-2 mb-8">
          {ADMIN_SIDEBAR_TABS.map(tab => (
            <button
              key={tab.id}
              className={`text-left px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === tab.id ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg' : 'text-gray-700 hover:bg-pink-50 hover:text-pink-700'}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="mt-auto">
          <UserButton appearance={{ elements: { avatarBox: 'w-8 h-8 sm:w-10 sm:h-10' } }} />
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 p-6 pt-4">
        {activeTab === 'dashboard' && <DashboardPage isAdmin={true} />}
        {activeTab === 'flagged-users' && <FlaggedUsers />}
      </div>
    </div>
  );
} 