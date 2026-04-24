import React from "react";
import { useNavigate } from "react-router-dom";

export default (props) => {
  const navigate = useNavigate();

  const services = [
    {
      category: "Online Classes (Live & Recorded)",
      icon: "🎥",
      color: "#0b8276",
      features: [
        "Live interactive classes with real-time engagement",
        "Recorded lectures for flexible access",
        "Structured dashboards for students & educators",
        "Class scheduling and session management"
      ]
    },
    {
      category: "Practical Learning Labs",
      icon: "🔬",
      color: "#FF8A33",
      features: [
        "Virtual lab simulations",
        "Live practical sessions",
        "Demonstration-based recorded modules",
        "Application-focused learning environment"
      ]
    },
    {
      category: "Teacher Training Programs",
      icon: "👨‍🏫",
      color: "#5B3CFF",
      features: [
        "Live training sessions",
        "Modern teaching methodologies",
        "Continuous skill enhancement programs"
      ]
    },
    {
      category: "E-Library",
      icon: "📚",
      color: "#e74c3c",
      features: [
        "Access to e-books, notes, and academic materials",
        "Smart search and categorized content",
        "Controlled and secure content usage",
        "Membership-based premium access"
      ]
    },
    {
      category: "Education Loan Assistance",
      icon: "💰",
      color: "#f39c12",
      features: [
        "Integration with multiple financial institutions",
        "Loan comparison and eligibility check",
        "Seamless application redirection"
      ]
    },
    {
      category: "Weekly Tests & Performance Tracking",
      icon: "📝",
      color: "#1abc9c",
      features: [
        "Weekly MCQ-based tests",
        "Automated evaluation and instant results",
        "Performance insights and progress tracking"
      ]
    },
    {
      category: "Tutors Marketplace",
      icon: "👥",
      color: "#9b59b6",
      features: [
        "Advanced tutor search and filtering",
        "Verified tutor profiles",
        "Direct student–tutor connection system"
      ]
    },
    {
      category: "School Events Management",
      icon: "🎉",
      color: "#e67e22",
      features: [
        "Competitions, quizzes, and exhibitions",
        "Event participation and tracking",
        "Real-time updates and engagement tools"
      ]
    }
  ];

  return (
    <div className="flex flex-col bg-[#f7efeb]">
      <div className="self-stretch bg-[#f7efeb]">
        {/* Hero Section with gradient */}
        <div className="self-stretch pt-[15px] pb-[78px] px-4 sm:px-8 md:px-16 lg:px-36"
          style={{
            background: "linear-gradient(135deg, #0e7c67 0%, #1a5c3a 100%)"
          }}>
          <div className="flex flex-col lg:flex-row items-center self-stretch mb-[31px] gap-8 lg:gap-12">
            <div className="flex flex-1 flex-col items-start">
              <button className="flex items-center bg-white/10 text-left py-2 px-3.5 mb-[19px] gap-2 rounded-xl border-0 hover:bg-white/20 transition-colors"
                onClick={() => alert("Pressed!")}>
                <span className="text-white text-[13px] font-bold">
                  {"Our Services"}
                </span>
              </button>
              <div className="flex flex-col items-start self-stretch pb-[1px] mb-5">
                <span className="text-white text-4xl sm:text-5xl lg:text-[64px] font-bold max-w-full lg:w-[507px] leading-tight">
                  {"Everything you need to power modern learning all in one platform"}
                </span>
              </div>
              <div className="flex flex-col self-stretch pt-0.5 mb-[21px]">
                <span className="text-white/90 text-base sm:text-lg leading-relaxed">
                  {"From live classes and practical labs to expert mentorship and performance tracking — we bring every essential learning tool together in one seamless experience."}
                </span>
              </div>
              <div className="flex items-start self-stretch pt-4 mb-5 gap-[17px] flex-wrap">
                <button className="flex flex-col shrink-0 items-start bg-[#FF8A33] text-left py-[17px] px-[22px] rounded-md border-0 hover:bg-[#e07a2e] transition-colors cursor-pointer"
                  onClick={() => navigate("/contact")}>
                  <span className="text-white text-sm font-bold">
                    {"Get Started"}
                  </span>
                </button>
                <button className="flex flex-col shrink-0 items-start bg-transparent text-left py-[13px] px-[19px] rounded-md border border-solid border-white/30 hover:bg-white/10 transition-colors cursor-pointer"
                  onClick={() => alert("Pressed!")}>
                  <span className="text-white text-sm font-bold">
                    {"Explore All Services"}
                  </span>
                </button>
              </div>
            </div>
            <div className="flex-1 w-full bg-white/5 p-4 sm:p-7 rounded-lg backdrop-blur-sm"
              style={{
                boxShadow: "0px 24px 48px rgba(0,0,0,0.2)"
              }}>
              <div className="flex flex-col self-stretch bg-white py-[23px] px-4 sm:px-6 gap-[22px] rounded-lg">
                <div className="flex justify-between items-center self-stretch flex-wrap gap-3">
                  <div className="flex flex-col shrink-0 items-start py-0.5">
                    <span className="text-[#111b2f] text-lg font-bold">
                      {"Why Choose EduMart?"}
                    </span>
                  </div>
                  <button className="flex flex-col shrink-0 items-start bg-[#5B3CFF1A] text-left py-2.5 px-3 rounded-xl border-0 cursor-pointer hover:bg-[#5B3CFF30] transition-colors"
                    onClick={() => alert("Pressed!")}>
                    <span className="text-[#5B3CFF] text-xs font-bold">
                      {"Loved by learners across India"}
                    </span>
                  </button>
                </div>
                <div className="flex flex-col self-stretch gap-[17px]">
                  <div className="flex flex-col sm:flex-row justify-center items-stretch self-stretch gap-[17px]">
                    <div className="flex flex-col flex-1 items-start bg-[#EEF2F6] p-[17px] gap-3 rounded-md">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">🎯</span>
                        <div className="flex flex-col shrink-0 items-start py-[1px]">
                          <span className="text-[#111b2f] text-sm font-bold">
                            {"End-to-end learning"}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-start pb-[1px]">
                        <span className="text-slate-500 text-[13px]">
                          {"Access everything from structured courses to certifications — all in one place without switching platforms."}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col flex-1 items-start bg-[#EEF2F6] p-[17px] gap-3 rounded-md">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">🚀</span>
                        <div className="flex flex-col shrink-0 items-start py-[3px]">
                          <span className="text-[#111b2f] text-sm font-bold">
                            {"Scalable solutions"}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-start pb-[1px]">
                        <span className="text-slate-500 text-[13px]">
                          {"Whether you're an individual learner or an institution, our platform grows with your needs."}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-center items-stretch self-stretch gap-[17px]">
                    <div className="flex flex-col flex-1 items-start bg-[#EEF2F6] p-[17px] gap-3 rounded-md">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">📊</span>
                        <div className="flex flex-col shrink-0 items-start py-[3px]">
                          <span className="text-[#111b2f] text-sm font-bold">
                            {"Performance tracking"}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-start pb-[1px]">
                        <span className="text-slate-500 text-[13px]">
                          {"Track progress, identify strengths, and improve continuously with smart analytics."}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col flex-1 items-start bg-[#EEF2F6] p-[17px] gap-3 rounded-md">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">💡</span>
                        <div className="flex flex-col shrink-0 items-start py-[1px]">
                          <span className="text-[#111b2f] text-sm font-bold">
                            {"Expert educators"}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-start pb-[1px]">
                        <span className="text-slate-500 text-[13px]">
                          {"Learn directly from experienced mentors and industry professionals who guide you at every step."}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* All Services Section */}
        <div className="flex flex-col items-center self-stretch bg-[#f7efeb] py-16 sm:py-24 px-4 sm:px-8 md:px-16 lg:px-[120px] gap-14">
          <div className="flex flex-col items-center pb-1.5 px-[18px] text-center">
            <button className="flex flex-col items-start bg-white text-left py-[9px] px-[13px] mb-5 rounded-xl border-0 cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
              onClick={() => alert("Pressed!")}>
              <span className="text-[#0b8276] text-[13px] font-bold">
                {"What We Offer"}
              </span>
            </button>
            <div className="flex flex-col items-center pb-[1px] mb-[21px]">
              <span className="text-[#111b2f] text-3xl sm:text-4xl lg:text-[44px] font-bold text-center max-w-[702px]">
                {"A complete ecosystem for modern education"}
              </span>
            </div>
            <div className="flex flex-col items-center pb-[1px]">
              <span className="text-slate-500 text-base text-center max-w-[781px]">
                {"Explore our comprehensive range of services designed to support students, teachers, and educational institutions at every step of the learning journey."}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 self-stretch">
            {services.map((service, idx) => (
              <div
                key={idx}
                className="flex flex-col items-start bg-white py-[30px] px-6 rounded-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div 
                  className="w-[52px] h-[52px] mb-[23px] rounded-lg flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${service.color}15` }}
                >
                  {service.icon}
                </div>
                <div className="flex flex-col items-start pb-[1px] mb-[18px]">
                  <span className="text-[#111b2f] text-lg font-bold leading-tight">
                    {service.category}
                  </span>
                </div>
                <div className="flex flex-col self-stretch gap-2">
                  {service.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2">
                      <span className="text-[#0b8276] text-sm mt-0.5">•</span>
                      <span className="text-slate-500 text-sm leading-relaxed">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="flex flex-col items-center self-stretch py-16 sm:py-24 px-4 sm:px-8 md:px-16 lg:px-[120px] gap-14"
          style={{
            background: "linear-gradient(135deg, #0e7c67 0%, #1a5c3a 100%)"
          }}>
          <div className="flex flex-col items-center pb-[5px] px-1 text-center">
            <button className="flex flex-col items-start bg-white/10 text-left py-2.5 px-3.5 mb-[21px] rounded-xl border-0 cursor-pointer hover:bg-white/20 transition-colors"
              onClick={() => alert("Pressed!")}>
              <span className="text-white text-[13px] font-bold">
                {"Why Choose Us"}
              </span>
            </button>
            <div className="flex flex-col items-center pb-[1px] mb-[29px]">
              <span className="text-white text-3xl sm:text-4xl lg:text-[44px] font-bold text-center max-w-[684px]">
                {"Transforming education through technology and innovation"}
              </span>
            </div>
            <div className="flex flex-col items-center pb-[1px]">
              <span className="text-white/90 text-base text-center max-w-[710px]">
                {"Our mission is to make learning smarter, more accessible, and impactful through cutting-edge technology and expert-driven content."}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 self-stretch">
            <div className="flex flex-col items-start bg-white/10 pt-7 px-6 pb-8 rounded-lg hover:bg-white/15 transition-colors">
              <div className="text-4xl mb-4">🎓</div>
              <div className="flex flex-col items-start pb-[1px] mb-[18px]">
                <span className="text-white text-[17px] font-bold">
                  {"50,000+ Students"}
                </span>
              </div>
              <div className="flex flex-col self-stretch pb-[1px]">
                <span className="text-white/80 text-sm leading-relaxed">
                  {"Trusted by thousands of learners across India for quality education."}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-start bg-white/10 py-7 px-6 pb-8 rounded-lg hover:bg-white/15 transition-colors">
              <div className="text-4xl mb-4">👨‍🏫</div>
              <div className="flex flex-col items-start pb-[1px] mb-4">
                <span className="text-white text-[17px] font-bold">
                  {"200+ Expert Tutors"}
                </span>
              </div>
              <div className="flex flex-col self-stretch pb-[1px]">
                <span className="text-white/80 text-sm leading-relaxed">
                  {"Learn from experienced educators and industry professionals."}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-start bg-white/10 pt-7 px-6 pb-8 rounded-lg hover:bg-white/15 transition-colors">
              <div className="text-4xl mb-4">🏫</div>
              <div className="flex flex-col items-start pb-[1px] mb-[15px]">
                <span className="text-white text-[17px] font-bold">
                  {"100+ Partner Schools"}
                </span>
              </div>
              <div className="flex flex-col items-start pb-[1px]">
                <span className="text-white/80 text-sm leading-relaxed">
                  {"Collaborating with educational institutions nationwide."}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-start bg-white/10 pt-7 px-6 pb-8 rounded-lg hover:bg-white/15 transition-colors">
              <div className="text-4xl mb-4">📚</div>
              <div className="flex flex-col items-start pb-[1px] mb-[15px]">
                <span className="text-white text-[17px] font-bold">
                  {"1000+ Learning Resources"}
                </span>
              </div>
              <div className="flex flex-col self-stretch pb-[1px]">
                <span className="text-white/80 text-sm leading-relaxed">
                  {"Extensive library of e-books, notes, and video content."}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="self-stretch bg-[#f7efeb] py-[88px] px-4 sm:px-8 md:px-16 lg:px-36">
          <div className="flex flex-col lg:flex-row items-center self-stretch bg-white max-w-[1152px] mx-auto p-6 sm:p-8 lg:p-11 gap-8 rounded-lg shadow-lg">
            <div className="flex flex-1 flex-col items-start pb-[5px] text-center lg:text-left">
              <button className="flex flex-col items-start bg-[#EEF2F6] text-left py-[9px] px-3.5 mb-1 rounded-xl border-0 cursor-pointer hover:bg-[#e2e8f0] transition-colors"
                onClick={() => alert("Pressed!")}>
                <span className="text-[#0b8276] text-[13px] font-bold">
                  {"Ready to begin?"}
                </span>
              </button>
              <span className="text-[#111b2f] text-2xl sm:text-3xl lg:text-[34px] font-bold max-w-[672px] mb-[19px]">
                {"Start your learning journey with EduMart today"}
              </span>
              <span className="text-slate-500 text-[15px] max-w-[503px]">
                {"Join thousands of students who are already experiencing the future of education. Get access to live classes, e-library, test series, and more."}
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-4 flex-wrap justify-center">
              <button className="flex flex-col shrink-0 items-start bg-[#FF8A33] text-left py-3.5 px-[21px] rounded-md border-0 cursor-pointer hover:bg-[#e07a2e] transition-colors"
                onClick={() => navigate("/signup")}>
                <span className="text-white text-sm font-bold">
                  {"Get Started"}
                </span>
              </button>
              <button className="flex flex-col shrink-0 items-start bg-[#EEF2F6] text-left py-4 px-[22px] rounded-md border-0 cursor-pointer hover:bg-[#e2e8f0] transition-colors"
                onClick={() => navigate("/contact")}>
                <span className="text-[#111b2f] text-sm font-bold">
                  {"Contact Us"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}