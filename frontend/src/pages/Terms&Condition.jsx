import React from "react";
import { motion } from "framer-motion";

const TermsAndConditions = () => {
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
      title: "Acceptance of Terms",
      content: "By accessing or using our services, you confirm that you have read, understood, and agreed to these Terms & Conditions. If you do not agree with any part of these terms, you should discontinue use of the platform immediately.",
    },
    {
      title: "Eligibility",
      content: "Users must: Be legally capable of entering into binding agreements; Provide accurate and complete registration information; Use the platform lawfully and responsibly.",
    },
    {
      title: "User Accounts",
      content: "Users are responsible for: Maintaining confidentiality of account credentials; Protecting login information; All activities conducted through their accounts. Karom Edusupplies Private Limited reserves the right to suspend or terminate accounts violating platform policies or applicable laws.",
    },
    {
      title: "Course Access and Usage",
      content: "All educational materials, videos, content, branding, graphics, and resources are protected intellectual property and are intended solely for personal educational use. Users may not: Reproduce, copy, or redistribute course materials; Share account access with unauthorized users; Use platform content for unauthorized commercial purposes; Modify or misuse copyrighted materials.",
    },
    {
      title: "Payments",
      content: "Certain courses or services may require payment. Users agree to: Provide accurate billing information; Pay applicable fees and taxes; Follow payment provider terms and conditions. Failure to complete payments may result in restricted or suspended access to services.",
    },
    {
      title: "Intellectual Property",
      content: "All trademarks, logos, designs, platform assets, educational content, and intellectual property remain the exclusive property of Karom Edusupplies Private Limited or its licensors. Unauthorized usage is strictly prohibited and may result in legal action.",
    },
    {
      title: "Prohibited Activities",
      content: "Users may not: Violate applicable laws or regulations; Upload malicious or harmful content; Attempt unauthorized access to systems or servers; Disrupt platform operations or security; Engage in fraudulent, abusive, or deceptive activities.",
    },
    {
      title: "Disclaimer",
      content: "The platform and services are provided on an 'as-is' and 'as-available' basis without warranties of any kind. Karom Edusupplies Private Limited does not guarantee: Continuous or uninterrupted availability; Specific educational outcomes; Employment, placement, or certification guarantees.",
    },
    {
      title: "Limitation of Liability",
      content: "To the maximum extent permitted by applicable law, Karom Edusupplies Private Limited shall not be liable for: Indirect or consequential damages; Financial or business losses; Service interruptions; Loss of data or information; Technical issues caused by third-party providers.",
    },
    {
      title: "Termination",
      content: "We reserve the right to suspend, restrict, or terminate user access without prior notice for violations of these Terms & Conditions or misuse of the platform.",
    },
    {
      title: "Governing Law",
      content: "These Terms & Conditions shall be governed and interpreted in accordance with applicable laws and jurisdiction.",
    },
    {
      title: "Changes to Terms",
      content: "Karom Edusupplies Private Limited reserves the right to update or modify these Terms at any time. Continued use of the platform after updates constitutes acceptance of revised terms.",
    },
  ];

  return (
    <div className="relative flex flex-col overflow-hidden bg-white">
      <div className="self-stretch bg-[#F7FCFF]">
        {/* Hero Section */}
        <div className="flex flex-col items-center self-stretch bg-white py-[1px] px-4 sm:px-8 md:px-16 lg:px-36 pt-20 pb-12">
          <div className="flex flex-col items-center self-stretch py-1.5 mb-[11px] mx-8">
            <span className="text-[#111b2f] text-3xl sm:text-4xl lg:text-[48px] font-bold text-center">
              Terms & Conditions
            </span>
          </div>
          <div className="flex flex-col items-start py-1 px-[17px] mb-3">
            <span className="text-slate-500 text-[15px] text-center max-w-[584px]">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Terms Content Section */}
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
                  Terms & Conditions of Use
                </h1>
                <p className="text-slate-600 text-base leading-relaxed">
                  Welcome to <span className="font-semibold text-[#0b8276]">Karom Edusupplies Private Limited</span>. 
                  By accessing or using our website, products, or services, you agree to be bound by these Terms & Conditions.
                </p>
              </div>
            </motion.div>

            {/* Terms Sections */}
            <motion.div
              className="w-full space-y-5"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              variants={stagger}
            >
              {sections.map((section, index) => (
                <motion.div
                  key={section.title}
                  variants={fadeUp}
                  className="bg-white rounded-xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow border border-[#00000008]"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0b8276]/10 flex items-center justify-center">
                      <span className="text-[#0b8276] font-bold text-sm">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg sm:text-xl font-bold text-[#111b2f] mb-2">
                        {section.title}
                      </h2>
                      <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                        {section.content}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Acknowledgment Section */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              className="w-full mt-4"
            >
              <div className="bg-[#0b8276]/5 rounded-xl p-6 sm:p-8 border border-[#0b8276]/20">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-[#0b8276] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-[#111b2f] mb-1">
                      Acknowledgment
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      By using our platform, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions. 
                      If you do not agree with any part of these terms, please discontinue use of the platform immediately.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Information */}
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
                  If you have any questions about these Terms & Conditions, please contact us:
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;