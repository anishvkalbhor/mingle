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
        "service_f22swnm", 
        "template_821nl1w", 
        formRef.current!,
        "qXRSsWLLDUqAN-eR3"
      )
      .then(
        () => {
          setLoading(false);
          setStatusMessage("✅ Message sent successfully!");
          if (formRef.current) formRef.current.reset();
        },
        (error) => {
          setLoading(false);
          setStatusMessage("❌ Failed to send message. Try again later.");
          console.error(error);
        }
      );
  };

  return (
    <section id="contact" className="border-b">

    <div className="h-screen flex flex-col items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="text-center mb-5 sm:mb-12 w-full max-w-4xl">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-sans bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent tracking-tight">
          Get in Touch
        </h1>
        <p className="text-base sm:text-lg text-gray-500 mt-2 px-4">
          Questions about Mingle? We&apos;re here to help!
        </p>
      </div>  

      <div className="w-full max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 bg-white/10 backdrop-blur-md  p-4 sm:p-6 lg:p-8">
          
          <div className="space-y-4 sm:space-y-6 order-2 lg:order-1">
            <div className="bg-white rounded-lg p-4 sm:p-6  text-center border">
              <div className="flex justify-center mb-3">
                <Mail className="h-8 w-8 sm:h-10 sm:w-10 text-purple-600" />
              </div>
              <h3 className="text-base sm:text-lg text-gray-600 font-semibold">Email Support</h3>
              <p className="text-sm sm:text-base text-gray-600 break-all">support@lumovateintelligence.com</p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="bg-white border rounded-lg p-4 sm:p-6 shadow-md flex items-center space-x-3 sm:space-x-4">
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-600 text-sm sm:text-base">24/7 Support</h4>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Round-the-clock assistance for all your queries
                  </p>
                </div>
              </div>

              <div className="bg-white border rounded-lg p-4 sm:p-6 shadow-md flex items-center space-x-3 sm:space-x-4">
                <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-600 text-sm sm:text-base">Quick Response</h4>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Get responses within 24 hours
                  </p>
                </div>
              </div>

              <div className="bg-white border rounded-lg p-4 sm:p-6 shadow-md flex items-center space-x-3 sm:space-x-4">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-600 text-sm sm:text-base">Expert Help</h4>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Direct access to our AI platform specialists
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 sm:p-6 lg:p-8 shadow-md border order-1 lg:order-2">
            <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-gray-600">Send us a message</h2>
            
            <form ref={formRef} onSubmit={sendEmail} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="user_name"
                  placeholder="Your name"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-gray-600 text-sm sm:text-base transition-colors"
                />
              </div>

              <div>
                <input
                  type="email"
                  name="user_email"
                  placeholder="your@email.com"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-gray-600 text-sm sm:text-base transition-colors"
                />
              </div>

              <div>
                <input
                  type="text"
                  name="subject"
                  placeholder="How can we help?"
                  className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-gray-600 text-sm sm:text-base transition-colors"
                />
              </div>

              <div>
                <textarea
                  name="message"
                  placeholder="Tell us more about your inquiry..."
                  rows={4}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-gray-600 text-sm sm:text-base resize-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 sm:py-4 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 font-medium text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed cursor-pointer"
              >
                <span>{loading ? "Sending..." : "Send Message"}</span>
              </button>

              {statusMessage && (
                <div className={`text-center text-sm sm:text-base mt-3 p-3 rounded-lg ${
                  statusMessage.includes('✅') 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {statusMessage}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
    </section>
  );
};

export default Contact;