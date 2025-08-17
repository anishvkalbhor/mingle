"use client";

import { FaFacebookF, FaLinkedinIn, FaPhone, FaXTwitter } from "react-icons/fa6";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import { LuPhone } from "react-icons/lu";
import { CiMail } from "react-icons/ci";

export default function Footer() {
  return (
    <>
      <footer className="bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_60%,#f3f4f6_100%)] text-[#1F2937] py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex flex-col items-start space-x-2 mb-4">
                <span className="text-4xl pb-2 font-black font-['Arial',_Helvetica,_sans-serif] bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                  Mingle
                </span>
                <p className="text-[#4B5563] mb-4 ">
                  Your soulmate might be one swipe away
                </p>
              </div>

              <div className="flex space-x-4">
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
                  <FaInstagram  className="w-5 h-5 text-[#E4405F]" />
                </div>
                <div className="w-10 h-10 bg-white rounded-xl shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] hover:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1),inset_-1px_-1px_2px_rgba(255,255,255,0.8),0_4px_8px_rgba(0,0,0,0.1)] flex items-center justify-center transition-all duration-300 cursor-pointer">
                  <FaWhatsapp className="w-5 h-5 text-[#25D366]" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-purple-600">Services</h3>
              <ul className="space-y-2 text-[#4B5563]">
                <li>
                  <a
                    href="#"
                    className="hover:text-[#0F172A] transition-colors"
                  >
                    Web Apps
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-[#0F172A] transition-colors"
                  >
                    Mobile Development
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-[#0F172A] transition-colors"
                  >
                    Cloud Solutions
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-[#0F172A] transition-colors"
                  >
                    API Development
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-purple-600">Legal</h3>
              <ul className="space-y-2 text-[#4B5563]">
                <li>
                  <a
                    href="#"
                    className="hover:text-[#0F172A] transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-[#0F172A] transition-colors"
                  >
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-[#0F172A] transition-colors"
                  >
                    Shipping & Delivery
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-[#0F172A] transition-colors"
                  >
                    Cancellation & Refund
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-purple-600">Contact</h3>
              <div className="space-y-3 text-[#4B5563]">
                <div className="flex items-center space-x-2">
                  <CiMail className="w-4 h-4 text-purple-600 font-bold" />
                  <span>hi@mingle.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <LuPhone className="w-4 h-4 text-purple-600" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-start space-x-2">
                  <FiMapPin className="w-4 h-4 text-purple-600 mt-1" />
                  <span className="text-sm">
                    123 Dating Street, Love City, <br /> LC 12345, United States
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pl-5 pr-5 flex flex-col md:flex-row justify-between items-center">
          <p className="text-[#6B7280] text-sm">
            © 2025 Mingle. All rights reserved.
          </p>
        </div>

        <div className="relative text-center mt-8 overflow-hidden ">
          <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8">
            <div className="relative">
              <p
                className="text-center text-[5rem] sm:text-[8rem] md:text-[10rem] lg:text-[16rem] font-black font-['Arial',_Helvetica,_sans-serif] bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent select-none leading-none whitespace-nowrap tracking-wider pb-8"
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
