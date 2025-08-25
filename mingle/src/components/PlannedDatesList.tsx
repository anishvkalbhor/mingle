"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiCalendar, FiMapPin, FiClock, FiStar, FiExternalLink } from "react-icons/fi";
import { useAuth } from "@clerk/nextjs";

interface PlannedDate {
  _id: string;
  date: string;
  time: string;
  state: string;
  city: string;
  venueType: string;
  venueName: string;
  venueAddress: string;
  venueRating?: number;
  venueCategory?: string;
  venueMapsUrl?: string;
  status: 'planned' | 'completed' | 'cancelled';
  createdAt: string;
}

export default function PlannedDatesList() {
  const { getToken, isSignedIn } = useAuth();
  const [plannedDates, setPlannedDates] = useState<PlannedDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'planned' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    fetchPlannedDates();
  }, [filter]);

  const fetchPlannedDates = async () => {
    if (!isSignedIn) {
      setPlannedDates([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Get the auth token
      const token = await getToken();
      
      if (!token) {
        console.error('Unable to get auth token');
        setPlannedDates([]);
        setLoading(false);
        return;
      }

      const url = filter === 'all' 
        ? 'http://localhost:5000/api/planned-dates'
        : `http://localhost:5000/api/planned-dates?status=${filter}`;
        
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        setPlannedDates(result.data || []);
      } else {
        console.error('Failed to fetch planned dates:', response.status);
        setPlannedDates([]);
      }
    } catch (error) {
      console.error('Error fetching planned dates:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateDateStatus = async (id: string, status: 'completed' | 'cancelled') => {
    if (!isSignedIn) {
      console.error('User not signed in');
      return;
    }

    try {
      // Get the auth token
      const token = await getToken();
      
      if (!token) {
        console.error('Unable to get auth token');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/planned-dates/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        fetchPlannedDates(); // Refresh the list
      } else {
        console.error('Failed to update date status');
      }
    } catch (error) {
      console.error('Error updating date status:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (!isSignedIn) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">
            Please sign in to view your planned dates
          </h2>
          <p className="text-gray-500">
            You need to be authenticated to access this feature.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          My Planned Dates 💕
        </h1>
        
        {/* Filter buttons */}
        <div className="flex gap-2">
          {['all', 'planned', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {plannedDates.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <FiCalendar size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-lg">No planned dates found.</p>
          <p className="text-sm">Start planning your next romantic adventure!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plannedDates.map((plannedDate, index) => (
            <motion.div
              key={plannedDate._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Status badge */}
              <div className="p-4 pb-0">
                <div className="flex justify-between items-start mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(plannedDate.status)}`}>
                    {plannedDate.status.charAt(0).toUpperCase() + plannedDate.status.slice(1)}
                  </span>
                  {plannedDate.venueCategory && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                      {plannedDate.venueCategory}
                    </span>
                  )}
                </div>

                {/* Date and time */}
                <div className="flex items-center gap-2 mb-2">
                  <FiCalendar className="text-purple-600" size={16} />
                  <span className="text-sm text-gray-600">{formatDate(plannedDate.date)}</span>
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <FiClock className="text-purple-600" size={16} />
                  <span className="text-sm text-gray-600">{plannedDate.time}</span>
                </div>

                {/* Venue info */}
                <h3 className="font-semibold text-lg text-gray-800 mb-1">
                  {plannedDate.venueName}
                </h3>
                
                <div className="flex items-start gap-2 mb-3">
                  <FiMapPin className="text-pink-600 mt-1" size={14} />
                  <div className="text-sm text-gray-600">
                    <p>{plannedDate.city}, {plannedDate.state}</p>
                    <p className="text-xs">{plannedDate.venueAddress}</p>
                  </div>
                </div>

                {/* Rating */}
                {plannedDate.venueRating && (
                  <div className="flex items-center gap-1 mb-3">
                    <FiStar className="text-yellow-500" size={14} />
                    <span className="text-sm text-gray-600">{plannedDate.venueRating}</span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  {plannedDate.status === 'planned' && (
                    <>
                      <button
                        onClick={() => updateDateStatus(plannedDate._id, 'completed')}
                        className="flex-1 py-2 px-3 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Mark Complete
                      </button>
                      <button
                        onClick={() => updateDateStatus(plannedDate._id, 'cancelled')}
                        className="flex-1 py-2 px-3 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  
                  {plannedDate.venueMapsUrl && (
                    <a
                      href={plannedDate.venueMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 py-2 px-3 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FiExternalLink size={12} />
                      Maps
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
