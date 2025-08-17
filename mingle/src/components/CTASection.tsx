import React from 'react'
import { motion } from "framer-motion";
import { useUser, SignUpButton } from "@clerk/nextjs";
import { MessageCircle } from 'lucide-react';



const CTASection = () => {
    const { isSignedIn } = useUser();

  return (
    <section className="mb-15">
      {!isSignedIn && (
        <motion.div
          className="text-center"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            className="bg-white/5 backdrop-blur-md rounded-3xl p-12 shadow-xl border border-white/20 max-w-2xl mx-auto"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              className="mb-6"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-2xl mb-4 shadow-lg"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <MessageCircle className="w-8 h-8 text-gray-700" />
              </motion.div>
            </motion.div>
            <motion.h3
              className="text-2xl font-bold text-gray-700 mb-3"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Still have questions?
            </motion.h3>
            <motion.p
              className="text-gray-500 text-lg mb-8 leading-relaxed"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              Our support team is here to help you get the most out of Every AI.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <SignUpButton mode="modal">
                <motion.button
                  className="group relative px-8 py-4 font-semibold text-white bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10">Get Started Free</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.button>
              </SignUpButton>

              <motion.button
                className="px-8 py-4 font-semibold text-indigo-300 bg-indigo-900 hover:bg-indigo-800 rounded-2xl border border-indigo-700 hover:border-indigo-500 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Browse Documentation
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
      </section>
  )
}

export default CTASection
