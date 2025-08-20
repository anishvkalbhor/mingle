import React from 'react'
import { motion } from "framer-motion";
import { useUser, SignUpButton } from "@clerk/nextjs";
import { Heart } from 'lucide-react';



const CTASection = () => {
    const { isSignedIn } = useUser();

  

  return (
  <section className="py-16 sm:py-20 text-black bg-white font-sans">
      {!isSignedIn && (
        <motion.div
          className="text-center"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            className="rounded-3xl p-6 sm:p-12 shadow-2xl border-0 w-full max-w-2xl mx-auto bg-white bg-[radial-gradient(60%_120%_at_50%_50%,hsla(0,0%,100%,0)_0,rgba(252,205,238,.5)_100%)] text-white flex flex-col items-center pr-5 pl-5"
          >
            <motion.div
              className="mb-6"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full mb-4 shadow-lg"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <Heart className="w-8 h-8 text-white" />
              </motion.div>
            </motion.div>
            <motion.h3
              className="text-3xl font-extrabold mb-3 text-gray-600 drop-shadow-lg"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Ready to mingle?
            </motion.h3>
            <motion.p
              className="text-gray-500 text-lg mb-8 leading-relaxed drop-shadow"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              Join Mingle and start your journey to meaningful connections. Our team is here to help you every step of the way!
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center w-full"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <SignUpButton mode="modal">
                <motion.button
                  className="group relative w-full sm:w-auto px-8 py-4 font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10">Get Started Free</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.button>
              </SignUpButton>

              <motion.button
                className="w-full sm:w-auto px-8 py-4 font-semibold text-pink-100 bg-purple-900 hover:bg-purple-800 rounded-2xl border border-pink-400 hover:border-pink-300 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
      </section>
  )
}

export default CTASection
