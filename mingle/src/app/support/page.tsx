"use client"

import { useState } from "react"
import { useUser, useAuth } from "@clerk/nextjs"
import { CheckCircle, XCircle, Mail, Phone } from "lucide-react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"

const supportTypes = [
  { value: "Bug", label: "🐞 Bug", description: "Report a technical issue or bug" },
  { value: "Feedback", label: "💬 Feedback", description: "Share your thoughts and suggestions" },
  { value: "Account", label: "🔒 Account", description: "Account-related issues and questions" },
];

export default function SupportPage() {
  const { isLoaded, isSignedIn } = useUser()
  const { getToken } = useAuth();
  const router = useRouter()
  const [supportIssueType, setSupportIssueType] = useState("");
  const [supportMessage, setSupportMessage] = useState("");
  const [supportLoading, setSupportLoading] = useState(false);
  const [supportFeedback, setSupportFeedback] = useState<string|null>(null);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isSignedIn) {
    router.push('/sign-in')
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-8">
        <div className="text-center mb-12 mt-20">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">How can we help you?</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're here to help you with any questions, issues, or feedback. Let us know what you need!
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <form
            onSubmit={async e => {
              e.preventDefault();
              setSupportLoading(true);
              setSupportFeedback(null);
              try {
                const token = await getToken();
                const res = await fetch("http://localhost:5000/api/support-ticket", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    issueType: supportIssueType,
                    description: supportMessage,
                  }),
                });
                if (res.ok) {
                  setSupportFeedback("success");
                  setSupportIssueType("");
                  setSupportMessage("");
                  setTimeout(() => {
                    setSupportFeedback(null);
                  }, 3000);
                } else {
                  const data = await res.json();
                  setSupportFeedback(data.message || "Failed to submit ticket.");
                }
              } catch (err) {
                setSupportFeedback("Failed to submit ticket. Please try again.");
              } finally {
                setSupportLoading(false);
              }
            }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">What can we help you with?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {supportTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setSupportIssueType(type.value)}
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left group hover:shadow-lg text-gray-500 ${
                      supportIssueType === type.value
                        ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 text-purple-700 shadow-lg scale-105'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className={`text-5xl transition-transform duration-300 ${
                        supportIssueType === type.value ? 'scale-110' : 'group-hover:scale-105'
                      }`}>
                        {type.label.split(' ')[0]}
                      </div>
                      <div>
                        <span className="font-bold text-xl block mb-2">{type.label.split(' ')[1]}</span>
                        <p className="text-gray-600 text-sm">{type.description}</p>
                      </div>
                      <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        supportIssueType === type.value ? 'bg-purple-500 scale-150' : 'bg-gray-300'
                      }`}></div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Tell us more about your issue
              </h2>
              <div className="relative">
                                 <textarea
                   className="w-full border-2 border-gray-200 rounded-2xl px-6 py-4 text-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 resize-none text-black placeholder-gray-500"
                   rows={8}
                   required
                   placeholder="Please provide as much detail as possible so we can help you better. Include any error messages, steps to reproduce, or screenshots if applicable..."
                   value={supportMessage}
                   onChange={e => setSupportMessage(e.target.value)}
                   maxLength={1000}
                 />
                <div className="flex justify-between items-center mt-3 px-2">
                  <span className="text-sm text-gray-500">
                    {supportMessage.length}/1000 characters
                  </span>
                  <span className="text-sm text-gray-400 font-medium">
                    Required
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={supportLoading || !supportIssueType || !supportMessage.trim()}
                className={`w-full py-6 rounded-2xl font-bold text-xl transition-all duration-300 ${
                  supportLoading || !supportIssueType || !supportMessage.trim()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white transform hover:scale-[1.02] shadow-lg hover:shadow-xl'
                }`}
              >
                {supportLoading ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Submitting your ticket...</span>
                  </div>
                ) : (
                  'Submit Support Ticket'
                )}
              </button>
            </div>
          </form>

          {supportFeedback && (
            <div className={`mt-8 p-6 rounded-2xl text-center font-semibold text-lg ${
              supportFeedback === "success"
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-2 border-green-200'
                : 'bg-gradient-to-r from-red-50 to-pink-50 text-red-700 border-2 border-red-200'
            }`}>
              {supportFeedback === "success" ? (
                <div className="flex items-center justify-center space-x-3">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                  <span>Support ticket submitted successfully! We'll get back to you soon.</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-3">
                  <XCircle className="w-8 h-8 text-red-500" />
                  <span>{supportFeedback}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl border-2 border-blue-200 p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-blue-800 mb-4">Need immediate assistance?</h2>
            <p className="text-blue-700 text-lg">
              For urgent issues or if you need help right away, you can also reach our support team directly.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a 
              href="mailto:support@mingle.com" 
              className="flex items-center justify-center p-6 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-all duration-200 font-semibold text-lg group"
            >
              <Mail className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
              Email Support
            </a>
            <a 
              href="tel:+1234567890" 
              className="flex items-center justify-center p-6 bg-green-500 text-white rounded-2xl hover:bg-green-600 transition-all duration-200 font-semibold text-lg group"
            >
              <Phone className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
              Call Support
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
