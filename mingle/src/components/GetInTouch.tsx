'use client';
import React, { useRef, useState } from "react";
import { Mail, Clock, MessageSquare, Users } from "lucide-react";
import emailjs from "emailjs-com";
const Contact = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage("");
    emailjs
      .sendForm(
        "YOUR_SERVICE_ID", 
        "YOUR_TEMPLATE_ID", 
        formRef.current!,
        "YOUR_PUBLIC_KEY"
      )
      .then(
        () => {
          setLoading(false);
          setStatusMessage(":white_check_mark: Message sent successfully!");
          if (formRef.current) formRef.current.reset();
        },
        (error) => {
          setLoading(false);
          setStatusMessage(":x: Failed to send message. Try again later.");
          console.error(error);
        }
      );
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-gray-900 to-black flex flex-col items-center justify-center py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-300 via-pink-300 to-yellow-300 bg-clip-text text-transparent">
          Get in Touch
        </h1>
        <p className="text-lg text-gray-300 mt-2">
          Questions about UnifiedAIHub? We&apos;re here to help!
        </p>
      </div>
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8">
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <div className="flex justify-center mb-3">
              <Mail className="h-10 w-10 text-purple-600" />
            </div>
            <h3 className="text-lg text-gray-600 font-semibold">Email Support</h3>
            <p className="text-gray-600">support@lumovateintelligence.com</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md flex items-center space-x-4">
            <Clock className="h-8 w-8 text-purple-600" />
            <div>
              <h4 className="font-semibold text-gray-600">24/7 Support</h4>
              <p className="text-gray-600 text-sm">
                Round-the-clock assistance for all your queries
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md flex items-center space-x-4">
            <MessageSquare className="h-8 w-8 text-purple-600" />
            <div>
              <h4 className="font-semibold text-gray-600">Quick Response</h4>
              <p className="text-gray-600 text-sm">
                Get responses within 24 hours
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md flex items-center space-x-4">
            <Users className="h-8 w-8 text-purple-600" />
            <div>
              <h4 className="font-semibold text-gray-600">Expert Help</h4>
              <p className="text-gray-600 text-sm">
                Direct access to our AI platform specialists
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-8 shadow-md">
          <h2 className="text-xl font-bold mb-6 text-gray-600">Send us a message</h2>
          <form ref={formRef} onSubmit={sendEmail} className="space-y-4">
            <input
              type="text"
              name="user_name"
              placeholder="Your name"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500 text-gray-600"
            />
            <input
              type="email"
              name="user_email"
              placeholder="your@email.com"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500 text-gray-600"
            />
            <input
              type="text"
              name="subject"
              placeholder="How can we help?"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500 text-gray-600"
            />
            <textarea
              name="message"
              placeholder="Tell us more about your inquiry..."
              rows={5}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500 text-gray-600"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-800 transition "
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
            {statusMessage && (
              <p className="text-center text-sm mt-2">{statusMessage}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
export default Contact;