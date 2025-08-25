"use client";

import { FaFacebookF, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import { LuPhone } from "react-icons/lu";
import { CiMail } from "react-icons/ci";

export default function Footer() {
  return (
    <>
      <footer className="bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_60%,#f3f4f6_100%)] text-[#1F2937]">
        <div className="w-full px-6 sm:px-8">
          <div className="flex flex-col justify-between items-start sm:flex-row sm:flex-wrap mb-8 lg:mb-12">
            
            {/* Brand Section */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex flex-col items-start mb-6">
                <span className="text-3xl sm:text-4xl font-black font-['Arial',_Helvetica,_sans-serif] bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-2">
                  Mingle
                </span>
                <p className="text-[#4B5563] text-base leading-relaxed">
                  Your soulmate might be one swipe away
                </p>
              </div>

              <div className="flex space-x-4 mb-6">
                <div className="w-10 h-10 bg-white rounded-xl shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] hover:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1),inset_-1px_-1px_2px_rgba(255,255,255,0.8),0_4px_8px_rgba(0,0,0,0.1)] flex items-center justify-center transition-all duration-300 cursor-pointer">
                  <FaXTwitter className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-white rounded-xl shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] hover:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1),inset_-1px_-1px_2px_rgba(255,255,255,0.8),0_4px_8px_rgba(0,0,0,0.1)] flex items-center justify-center transition-all duration-300 cursor-pointer">
                  <FaLinkedinIn className="w-5 h-5 text-[#0077B5]" />
                </div>
                <div className="w-10 h-10 bg-white rounded-xl shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] hover:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1),inset_-1px_-1px_2px_rgba(255,255,255,0.8),0_4px_8px_rgba(0,0,0,0.1)] flex items-center justify-center transition-all duration-300 cursor-pointer">
                  <FaFacebookF className="w-5 h-5 text-[#1877F2]" />
                </div>
                <div className="w-10 h-10 bg-white rounded-xl shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] hover:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1),inset_-1px_-1px_2px_rgba(255,255,255,0.8),0_4px_8px_rgba(0,0,0,0.1)] flex items-center justify-center transition-all duration-300 cursor-pointer">
                  <FaInstagram className="w-5 h-5 text-[#E4405F]" />
                </div>
                <div className="w-10 h-10 bg-white rounded-xl shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] hover:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1),inset_-1px_-1px_2px_rgba(255,255,255,0.8),0_4px_8px_rgba(0,0,0,0.1)] flex items-center justify-center transition-all duration-300 cursor-pointer">
                  <FaWhatsapp className="w-5 h-5 text-[#25D366]" />
                </div>
              </div>
              
              <p className="text-[#6B7280] text-sm">
                © 2025 Mingle. All rights reserved.
              </p>
            </div>

            {/* Services Section */}
            <div className="mt-6 sm:mt-0 mb-2">
              <h3 className="font-bold font-sans mb-2 text-purple-600 text-base">Services</h3>
              <ul className="space-y-1 text-[#4B5563] text-base">
                <li>
                  <a
                    href="/profile/setup"
                    className="hover:text-[#0F172A] transition-colors block py-1"
                  >
                    AI-Powered Matching
                  </a>
                </li>
                <li>
                  <a
                    href="/generate-date"
                    className="hover:text-[#0F172A] transition-colors block py-1"
                  >
                    Date Idea Generator
                  </a>
                </li>
                <li>
                  <a
                    href="/premium"
                    className="hover:text-[#0F172A] transition-colors block py-1"
                  >
                    Premium Memberships
                  </a>
                </li>
                <li>
                  <a
                    href="/dashboard"
                    className="hover:text-[#0F172A] transition-colors block py-1"
                  >
                    Profile Analytics
                  </a>
                </li>
                <li>
                  <a
                    href="/support"
                    className="hover:text-[#0F172A] transition-colors block py-1"
                  >
                    Customer Support
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal Section */}
            <div className="mt-6 sm:mt-0 mb-2">
              <h3 className="font-bold font-sans mb-2 text-purple-600 text-base">Legal</h3>
              <ul className="space-y-1 text-[#4B5563] text-base">
                <li>
                  <a
                    href="#"
                    className="hover:text-[#0F172A] transition-colors block py-1"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-[#0F172A] transition-colors block py-1"
                  >
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-[#0F172A] transition-colors block py-1"
                  >
                    Shipping & Delivery
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-[#0F172A] transition-colors block py-1"
                  >
                    Cancellation & Refund
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Section */}
            <div className="flex flex-col items-startmt-6 sm:mt-0 mb-2">
              <h3 className="font-bold font-sans mb-2 text-purple-600 text-base">Contact</h3>
              <div className="space-y-2 text-[#4B5563] text-base">
                <div className="flex items-center space-x-2">
                  <CiMail className="w-4 h-4 text-purple-600 font-bold flex-shrink-0" />
                  <span>hi@mingle.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <LuPhone className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-start space-x-2">
                  <FiMapPin className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                  <span className="text-sm leading-relaxed">
                    123 Dating Street, Love City, <br /> LC 12345, United States
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Large Mingle Text */}
        <div className="relative text-center overflow-hidden">
          <div className="w-full px-6 sm:px-8 lg:px-16">
            <div className="relative">
              <p
                className="text-center text-[5rem] sm:text-[8rem] md:text-[10rem] lg:text-[14rem] xl:text-[16rem] font-black font-['Arial',_Helvetica,_sans-serif] bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent select-none leading-none whitespace-nowrap tracking-wider sm:pb-8 "
                style={{
                  WebkitMaskImage:
                    "linear-gradient(to top, transparent 0%, black 60%)",
                  maskImage:
                    "linear-gradient(to top, transparent 0%, black 60%)",
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                }}
              >
                Mingle
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}