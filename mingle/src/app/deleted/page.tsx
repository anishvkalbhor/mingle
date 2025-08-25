import React from 'react';

export default function DeletedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-red-200">
      <div className="text-center p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Account Deleted</h1>
        <p className="text-gray-700 mb-4">Your account has been deleted. If you believe this is a mistake, please contact support for more information.</p>
        <div className="mt-6">
          <a href="mailto:support@example.com" className="text-pink-600 underline font-semibold">Contact Support</a>
        </div>
      </div>
    </div>
  );
} 