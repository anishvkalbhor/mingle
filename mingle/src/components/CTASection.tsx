import React from 'react'
import { motion } from "framer-motion";
import { useUser, SignUpButton } from "@clerk/nextjs";
import { PiStarThin } from "react-icons/pi";




const CTASection = () => {
    const { isSignedIn } = useUser();

  return (
  <section className="py-8 xs:py-12 sm:py-16 lg:py-20 text-black bg-white font-sans">
      {!isSignedIn && (
        <motion.div
          className="text-center px-4 xs:px-6 sm:px-8"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            className="rounded-2xl xs:rounded-3xl p-6 xs:p-8 sm:p-12 shadow-2xl border-0 w-full max-w-7xl mx-auto bg-gradient-to-r from-purple-500 to-pink-600 text-white flex flex-col items-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
            </motion.div>
            <motion.h3
              className="text-6xl font-bold mb-3 text-gray-100"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Ready to mingle?
            </motion.h3>
            <motion.p
              className="text-gray-200 text-lg mb-8 w-full max-w-2xl"
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
                  className="group relative w-full sm:w-auto px-8 py-4 font-semibold text-purple-800 bg-white rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 overflow-hidden cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className='flex gap-2 items-center justify-center'>
                  <PiStarThin className='font-bold' size={20}/>
                  <span className="relative z-10">Signup Now!</span>
                  </div>
                </motion.button>
              </SignUpButton>

              <motion.button
                className="w-full sm:w-auto px-8 py-4 font-semibold text-pink-100 border rounded-2xl hover:bg-white/10 hover:border-white/60 transition-all duration-300 cursor-pointer"
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
