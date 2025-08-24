import React from 'react'
import { FaqAccordion, FAQItem } from './ui/faq-chat-accordion'

const defaultData: FAQItem[] = [
  {
    answer: "The internet doesn't close. It's available 24/7.",
    icon: "❤️",
    iconPosition: "right",
    id: 1,
    question: "How late does the internet close?",
  },
  {
    answer: "No, you don't need a license to browse this website.",
    icon: undefined,
    iconPosition: undefined,
    id: 2,
    question: "Do I need a license to browse this website?",
  },
  {
    answer:
      "Our cookies are digital, not edible. They're used for website functionality.",
    icon: undefined,
    iconPosition: undefined,
    id: 3,
    question: "What flavour are the cookies?",
  },
  {
    answer: "Yes, but we do have a return policy",
    icon: "⭐",
    iconPosition: "left",
    id: 4,
    question: "Can I get lost here?",
  },
  {
    answer: "Don't worry, you can always go back or refresh the page.",
    icon: undefined,
    iconPosition: undefined,
    id: 5,
    question: "What if I click the wrong button?",
  },
];

const FAQSection = () => {
  return (
    <section className="py-8 xs:py-12 sm:py-16 lg:py-20 text-black bg-white bg-[radial-gradient(60%_120%_at_50%_50%,hsla(0,0%,100%,0)_0,rgba(252,205,238,.5)_100%)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row items-center lg:items-start lg:gap-12">
                <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start justify-center mb-10 lg:mb-0">
                  <h2
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 text-center mt-8 lg:text-left font-sans"
                  >
                    FAQ&apos;s
                  </h2>
                  <p className="text-lg text-gray-600 max-w-md lg:pr-8 text-center lg:text-left">
                    Got questions? We've got answers. Here are some of the most
                    common things people ask about Mingle.
                  </p>
                </div>
                <div className="w-full lg:w-3/5 flex items-start justify-center lg:justify-start">
                  <div className="w-full max-w-xl scale-100">
                    <FaqAccordion
                      data={defaultData}
                      className="max-w-full"
                      questionClassName="bg-secondary hover:bg-secondary/80 text-lg md:text-xl py-5"
                      answerClassName="bg-secondary text-secondary-foreground text-base md:text-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
  )
}

export default FAQSection
