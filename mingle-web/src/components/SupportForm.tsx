"use client";

import { useState } from "react";

export default function SupportForm() {
  const [issueType, setIssueType] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = { issueType, message };

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("✅ Ticket submitted successfully!");
        setIssueType("");
        setMessage("");
      } else {
        alert("❌ Failed to submit. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting ticket:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-100 to-blue-50 px-4 py-10 sm:py-20">
      <form
        onSubmit={handleSubmit}
        className="w-full sm:max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
          🛠️ Support Ticket
        </h1>

        {/* Issue Type Dropdown */}
        <div className="mb-4">
          <label htmlFor="issueType" className="block text-sm font-medium text-gray-700 mb-1">
            Select Issue Type
          </label>
          <select
            id="issueType"
            value={issueType}
            onChange={(e) => setIssueType(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none text-black"
          >
            <option value="">-- Choose an issue --</option>
            <option value="bug">🐞 Bug</option>
            <option value="feedback">💬 Feedback</option>
            <option value="account">🔐 Account</option>
          </select>
        </div>

        {/* Message Textarea */}
        <div className="mb-6">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            placeholder="Describe the issue in detail..."
            className="w-full px-4 py-3 border rounded-lg resize-none text-black focus:ring-2 focus:ring-purple-400 focus:outline-none"
            rows={5}
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition"
        >
          📩 Submit
        </button>
      </form>
    </div>
  );
}
