'use client';
import { Facebook, Twitter, Linkedin, Instagram as InstagramIcon } from 'lucide-react';
export default function Footer() {
  return (
    <>
      {/* Footer */}
      <footer className="bg-[radial-gradient(125%_125%_at_50%_10%,_white_40%,_#f9c3d4_100%)] text-[#1F2937] py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-1 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-4xl font-extrabold font-sans bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Mingle</span>
              </div>
              <p className="text-[#4B5563] mb-4">
              Your soulmate might be one swipe away 👀
              </p>
              <div className="flex space-x-4">
                <Facebook className="w-5 h-5 text-[#6B7280] hover:text-[#4F46E5] cursor-pointer" />
                <Twitter className="w-5 h-5 text-[#6B7280] hover:text-[#4F46E5] cursor-pointer" />
                <Linkedin className="w-5 h-5 text-[#6B7280] hover:text-[#4F46E5] cursor-pointer" />
                <InstagramIcon className="w-5 h-5 text-[#6B7280] hover:text-[#4F46E5] cursor-pointer" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-[#4B5563]">
                <li><a href="#" className="hover:text-[#0F172A]">Features</a></li>
                <li><a href="#" className="hover:text-[#0F172A]">Pricing</a></li>
                <li><a href="#" className="hover:text-[#0F172A]">Integrations</a></li>
                <li><a href="#" className="hover:text-[#0F172A]">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-[#4B5563]">
                <li><a href="#" className="hover:text-[#0F172A]">About</a></li>
                <li><a href="#" className="hover:text-[#0F172A]">Blog</a></li>
                <li><a href="#" className="hover:text-[#0F172A]">Careers</a></li>
                <li><a href="#" className="hover:text-[#0F172A]">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-[#4B5563]">
                <li><a href="#" className="hover:text-[#0F172A]">Help Center</a></li>
                <li><a href="#" className="hover:text-[#0F172A]">Documentation</a></li>
                <li><a href="#" className="hover:text-[#0F172A]">Status</a></li>
                <li><a href="#" className="hover:text-[#0F172A]">Security</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-[#6B7280] text-sm ml-5">© 2024 StreamLine. All rights reserved.</p>
            <div className="flex space-x-6 text-sm text-[#6B7280] mt-4 md:mt-0">
              <a href="#" className="hover:text-[#1F2937]">Privacy Policy</a>
              <a href="#" className="hover:text-[#1F2937]">Terms of Service</a>
              <a href="#" className="hover:text-[#1F2937] mr-5">Cookie Policy</a>
            </div>
          </div>
        {/* Gradient Brand Below Footer */}
      <div className=" text-center">
        <div className="max-w-screen-2xl mx-auto px-4">
          <p className="text-center text-xl md:text-xl lg:text-[10rem] font-bold bg-clip-text text-transparent bg-gradient-to-b from-[#D1D5DB] to-[#A2A3A3]">
            Mingle
          </p>
        </div>
      </div>
      
      </footer>
      
    </>
  );
}