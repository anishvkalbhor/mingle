"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: 'How does the AI matching work?',
    answer: 'Our AI algorithm analyzes your profile, preferences, and behavior to suggest the most compatible matches. It learns from your interactions to improve its recommendations over time.',
  },
  {
    question: 'Is Mingle safe and secure?',
    answer: 'Yes, we take your safety and privacy very seriously. We use advanced security measures to protect your data and have a dedicated team to monitor and remove fake profiles.',
  },
  {
    question: 'Can I use Mingle for free?',
    answer: 'Mingle offers a free tier that allows you to create a profile, browse matches, and send a limited number of messages. For unlimited access and advanced features, you can upgrade to our premium subscription.',
  },
  {
    question: 'What makes Mingle different from other dating apps?',
    answer: 'Mingle focuses on fostering genuine, long-term connections rather than casual hookups. Our AI-powered matching, in-depth profiles, and vibrant community set us apart.',
  },
];

export const FAQSection = () => {
  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-800">Frequently Asked Questions</h2>
          <p className="mt-4 text-lg text-gray-600">Have questions? We have answers.</p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-lg font-semibold">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-base text-gray-600">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
