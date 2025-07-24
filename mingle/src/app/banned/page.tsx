"use client";
import React, { useState } from 'react';

export default function BannedPage() {
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    try {
      const res = await fetch("http://localhost:5000/api/contact-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, email }),
      });
      if (res.ok) {
        setFeedback("Your message has been sent to the admin. We'll review your request.");
        setMessage("");
        setEmail("");
        setTimeout(() => setShowModal(false), 2000);
      } else {
        setFeedback("Failed to send message. Please try again later.");
      }
    } catch {
      setFeedback("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 to-pink-200">
      <div className="text-center p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Account Banned</h1>
        <p className="text-gray-700 mb-4">Your account has been banned. If you believe this is a mistake, you can send a request to the admin for review.</p>
        <div className="mt-6">
          <button className="text-pink-600 underline font-semibold" onClick={() => setShowModal(true)}>
            Contact Admin
          </button>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-pink-500 text-2xl"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Request Unban / Explain Issue</h2>
            <form onSubmit={handleSubmit}>
              <label className="block mb-2 font-medium">Your Email (optional)</label>
              <input
                type="email"
                className="w-full border rounded px-3 py-2 mb-4"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email (optional)"
              />
              <label className="block mb-2 font-medium">Message to Admin</label>
              <textarea
                className="w-full border rounded px-3 py-2 mb-4"
                rows={5}
                required
                placeholder="Describe why you think your account should be unbanned or explain your issue."
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
              <button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 rounded font-semibold" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </button>
              {feedback && (
                <div className="mt-3 text-center text-sm font-medium text-pink-600">{feedback}</div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 