import React from "react";

export default function AboutUs() {
  return (
    <section className="relative py-20 px-4 sm:px-8 bg-white bg-[radial-gradient(60%_120%_at_50%_50%,hsla(0,0%,100%,0)_0,rgba(252,205,238,.5)_100%)] min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold font-sans text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
        About Us
      </h1>
      <p className="text-xl text-center text-gray-700 max-w-3xl mx-auto mb-8">
        A premium software development brand powered by <span className="font-bold text-blue-600">Lumovate Intelligence</span>, focused on building meaningful, scalable, and high-performing digital products.
      </p>
      <p className="text-lg text-gray-600 text-center max-w-4xl mx-auto mb-12">
        TekLume is not just another <span className="font-bold">Software</span> solution brand — we're a digital craftsmanship unit focused on building <span className="font-bold">Intelligent, Scalable, and Purposeful</span> software. From robust <span className="font-bold">SaaS platforms</span> and <span className="font-bold">AI-powered</span> tools to elegant <span className="font-bold">UI systems</span> and <span className="font-bold">smart automation</span> workflows, we engineer solutions that are both practical and future-ready. We believe <span className="font-bold">great software</span> isn't just built — it's thoughtfully crafted to solve <span className="font-bold">real problems</span> and drive <span className="font-bold">real growth</span>.
      </p>
      <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch w-full max-w-4xl">
        <div className="flex-1 bg-blue-50 rounded-2xl shadow p-8 flex flex-col items-center">
          <div className="bg-blue-400 text-white rounded-full p-3 mb-4">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="currentColor"/></svg>
          </div>
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">Our Mission</h2>
          <p className="text-gray-700 text-center">
            To craft intelligent, scalable, and human-centered software that drives innovation and delivers real business value to our clients.
          </p>
        </div>
        <div className="flex-1 bg-purple-50 rounded-2xl shadow p-8 flex flex-col items-center">
          <div className="bg-purple-400 text-white rounded-full p-3 mb-4">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="currentColor"/></svg>
          </div>
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Our Vision</h2>
          <p className="text-gray-700 text-center">
            To become a global catalyst for digital transformation by building future-ready technology solutions that empower progress.
          </p>
        </div>
      </div>
    </section>
  );
}
