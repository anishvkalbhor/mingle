import React from "react";

export default function AboutUs() {
  return (
    <section
      id="about"
      className="relative py-20 px-4 sm:px-8 bg-white bg-[radial-gradient(60%_120%_at_50%_50%,hsla(0,0%,100%,0)_0,rgba(252,205,238,.5)_100%)] min-h-screen flex flex-col items-center justify-center"
    >
      <h1 className="text-5xl font-bold font-sans text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
        About Mingle
      </h1>
      <div className="max-w-3xl mx-auto py-12 px-6">
        <p className="text-lg text-gray-700 mb-6">
          Mingle is a next-gen dating app built for real and meaningful
          connections. With Aadhaar-based verification, AI-powered matchmaking,
          and a unique trust score system, we ensure every profile is genuine
          and safe.
        </p>
        <p className="text-lg text-gray-700 mb-6">
          From video bios to interest-based communities and virtual events,
          Mingle helps you connect beyond swipes and chats – creating space for
          authentic conversations and lasting relationships.
        </p>
        <div className="flex justify-center items-center space-x-2 mt-8">
          <span className="text-2xl">✨</span>
          <span className="text-xl font-bold text-purple-600">
            Mingle &mdash; Where authenticity meets love.
          </span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch w-full max-w-4xl">
        <div className="flex-1 bg-gradient-to-br from-pink-100 to-pink-50 rounded-2xl shadow p-8 flex flex-col items-center">
          <div className="bg-blue-400 text-white rounded-full p-3 mb-4">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Our Mission
          </h2>
          <p className="text-gray-700 text-center">
            To craft intelligent, scalable, and human-centered software that
            drives innovation and delivers real business value to our clients.
          </p>
        </div>
        <div className="flex-1 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl shadow p-8 flex flex-col items-center">
          <div className="bg-purple-400 text-white rounded-full p-3 mb-4">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
              <path
                d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm-1-13h2v6h-2zm0 8h2v2h-2z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Our Vision
          </h2>
          <p className="text-gray-700 text-center">
            To become a global catalyst for digital transformation by building
            future-ready technology solutions that empower progress.
          </p>
        </div>
      </div>
    </section>
  );
}
