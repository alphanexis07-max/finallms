import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "How do I enroll in a course?",
      answer: "To enroll in a course, simply browse our course catalog, click on the course that interests you, and click the 'Register' or 'Buy Now' button. You'll need to create an account if you haven't already."
    },
    {
      question: "Can I access my courses offline?",
      answer: "While most of our platform requires an active internet connection to stream high-quality video content, certain materials like PDFs and resources can be downloaded for offline use."
    },
    {
      question: "Do I get a certificate after completion?",
      answer: "Yes! Every course on EduMart comes with a Certificate of Completion once you finish all the lessons and pass the final evaluation."
    },
    {
      question: "What payment methods are supported?",
      answer: "We support a wide range of payment options including Credit/Debit Cards, UPI (Google Pay, PhonePe), and Net Banking via our secure payment gateway."
    },
    {
      question: "Can I get a refund if I'm not satisfied?",
      answer: "We have a 7-day refund policy for most of our courses. Please refer to our Refund Policy page for more detailed terms and conditions."
    },
    {
      question: "Are the live classes recorded?",
      answer: "Yes, all live classes are recorded and uploaded to the dashboard within 24 hours so you can re-watch them anytime if you missed the session."
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F7FCFF] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold text-[#111b2f] sm:text-5xl"
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-lg text-slate-500"
          >
            Have questions? We're here to help you get the most out of EduMart.
          </motion.p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-10">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search for answers..."
            className="block w-full pl-10 pr-3 py-4 border border-slate-200 rounded-2xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0e7c67] focus:border-transparent transition-all sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className="text-lg font-semibold text-[#111b2f] pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${
                      activeIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {activeIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 text-slate-600 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-slate-500">No matching questions found.</p>
            </div>
          )}
        </div>

        {/* Still have questions? */}
        <div className="mt-16 text-center bg-[#0e7c67] rounded-3xl p-8 sm:p-12 text-white overflow-hidden relative">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
            <p className="text-white/80 mb-8 max-w-lg mx-auto">
              If you couldn't find what you were looking for, our support team is happy to assist you.
            </p>
            <button 
              onClick={() => window.location.href = '/contact'}
              className="bg-white text-[#0e7c67] font-bold py-3 px-8 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Contact Support
            </button>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-black/10 rounded-full blur-3xl opacity-50"></div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
