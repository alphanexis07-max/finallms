import React from "react";
import { motion } from "framer-motion";

const RefundPolicy = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const stagger = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05,
      },
    },
  };

  // Sections based on the attached PDF
  const sections = [
    {
      title: "Course Enrollment",
      icon: "📚",
      color: "#0b8276",
      points: [
        "Users are encouraged to review all course details, eligibility requirements, pricing, and descriptions carefully before making any payment or enrollment decision.",
      ],
    },
    {
      title: "Refund Eligibility",
      icon: "✅",
      color: "#0b8276",
      points: [
        "Duplicate payment transactions",
        "Technical issues preventing access to purchased services",
        "Accidental purchases reported within the eligible timeframe",
        "Services not delivered as described",
        "All refund requests are reviewed on a case-by-case basis, and refund approval remains at the sole discretion of Karom Edusupplies Private Limited.",
      ],
    },
    {
      title: "Non-Refundable Situations",
      icon: "🚫",
      color: "#e74c3c",
      points: [
        "Change of mind after successful course access",
        "Partial or complete course consumption",
        "Failure to attend live or scheduled sessions",
        "Violation of platform policies or terms",
        "Subscription periods already utilized",
        "Downloaded or accessed digital resources",
      ],
    },
    {
      title: "Refund Request Process",
      icon: "🔄",
      color: "#FF8A33",
      points: [
        "Submit a refund request through official support channels",
        "Provide valid payment proof and transaction details",
        "Share relevant supporting information if requested",
        "Allow reasonable processing time for verification and review",
        "Incomplete or unverifiable requests may be rejected.",
      ],
    },
    {
      title: "Processing Time",
      icon: "⏱️",
      color: "#f39c12",
      points: [
        "Approved refunds may take several business days to process depending on banking institutions, payment gateways, and financial providers.",
        "Karom Edusupplies Private Limited shall not be responsible for delays caused by third-party payment providers or banks.",
      ],
    },
    {
      title: "Payment Disputes & Chargebacks",
      icon: "⚠️",
      color: "#e67e22",
      points: [
        "Users are encouraged to contact our support team before initiating chargebacks or payment disputes.",
        "Fraudulent disputes, unauthorized claims, abuse of refund systems, or policy violations may result in:",
        "• Immediate account suspension",
        "• Permanent restriction from platform services",
        "• Legal action where applicable",
      ],
    },
    {
      title: "Policy Modifications",
      icon: "📝",
      color: "#16a085",
      points: [
        "Karom Edusupplies Private Limited reserves the right to modify, update, or change this Refund Policy at any time without prior notice.",
        "Continued use of the platform after updates constitutes acceptance of the revised policy.",
      ],
    },
  ];

  return (
    <div className="relative flex flex-col overflow-hidden bg-white">
      <div className="self-stretch bg-[#F7FCFF]">
        {/* Hero Section */}
        <div className="flex flex-col items-center self-stretch bg-white py-[1px] px-4 sm:px-8 md:px-16 lg:px-36 pt-20 pb-12">
          <div className="flex flex-col items-center self-stretch py-1.5 mb-[11px] mx-8">
            <span className="text-[#111b2f] text-3xl sm:text-4xl lg:text-[48px] font-bold text-center">
              Refund Policy
            </span>
          </div>
          <div className="flex flex-col items-start py-1 px-[17px] mb-3">
            <span className="text-slate-500 text-[15px] text-center max-w-[584px]">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Refund Policy Content Section */}
        <div className="flex flex-col items-center self-stretch py-8 px-4 sm:px-8 md:px-16 lg:px-36">
          <div className="flex flex-col items-start self-stretch pt-[45px] mx-8 gap-8 max-w-4xl mx-auto">
            
            {/* Introduction */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              className="w-full"
            >
              <div className="bg-[#f7efeb] rounded-xl p-6 sm:p-8">
                <h1 className="text-xl sm:text-2xl font-bold text-[#111b2f] mb-3">
                  Refund Policy
                </h1>
                <p className="text-slate-600 text-base leading-relaxed">
                  At <span className="font-semibold text-[#0b8276]">Karom Edusupplies Private Limited</span>, we strive to provide our customers with quality products and smooth services. 
                  Please review our refund policy carefully before making any payment or enrollment decision.
                </p>
              </div>
            </motion.div>

            {/* Policy Sections */}
            <motion.div
              className="w-full space-y-5"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              variants={stagger}
            >
              {sections.map((section) => (
                <motion.div
                  key={section.title}
                  variants={fadeUp}
                  className="bg-white rounded-xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow border border-[#00000008]"
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xl"
                      style={{ backgroundColor: `${section.color}15` }}
                    >
                      {section.icon}
                    </div>
                    <div className="flex-1">
                      <h2 
                        className="text-lg sm:text-xl font-bold mb-3"
                        style={{ color: section.color }}
                      >
                        {section.title}
                      </h2>
                      <ul className="space-y-2">
                        {section.points.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-slate-500 text-sm sm:text-base leading-relaxed">
                            <span className="text-[#0b8276] mt-1">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Contact Information Section - from PDF */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              className="w-full"
            >
              <div className="bg-[#f7efeb] rounded-xl p-6 sm:p-8">
                <h3 className="text-base sm:text-lg font-semibold text-[#111b2f] mb-3">
                  Contact Information
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-2">
                  For any refund-related queries or to submit a refund request, please contact us:
                </p>
                <div className="mt-3 space-y-1 text-sm text-slate-600">
                  <p>🏢 <span className="font-medium">Karom Edusupplies Private Limited</span></p>
                  <p>📍 Scheme No. 54, Vijay Nagar, Indore, Madhya Pradesh, India</p>
                  <p>📞 <a href="tel:+917898781533" className="text-[#0b8276] hover:underline">+91 78987 81533</a></p>
                  <p>✉️ <a href="mailto:karominfo@kacpl.in" className="text-[#0b8276] hover:underline">karominfo@kacpl.in</a></p>
                  <p>🌐 <a href="https://learn.edu-mart.com/" target="_blank" rel="noopener noreferrer" className="text-[#0b8276] hover:underline">https://learn.edu-mart.com/</a></p>
                </div>
              </div>
            </motion.div>

            {/* Important Note about Chargebacks */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              className="w-full mt-4"
            >
              <div className="bg-[#FF8A33]/10 rounded-xl p-6 sm:p-8 border border-[#FF8A33]/30">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-[#FF8A33] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-[#111b2f] mb-1">
                      Important Note
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      Please contact our support team before initiating chargebacks or payment disputes. 
                      Fraudulent disputes or abuse of refund systems may result in account suspension, 
                      permanent restriction from platform services, or legal action.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;