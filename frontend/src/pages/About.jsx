import React from "react";
import { useNavigate } from "react-router-dom";

export default (props) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col bg-white">
      <div className="self-stretch bg-[#F7FCFF]">
        {/* Hero Section - About Us */}
        <div className="self-stretch pt-[30px] pb-[78px] px-4 sm:px-8 md:px-16 lg:px-36 mb-[7px]"
          style={{
            background: "linear-gradient(135deg, #0e7c67 0%, #1a5c3a 100%)"
          }}>
          <div className="flex flex-col lg:flex-row items-center self-stretch gap-8 lg:gap-14">
            <div className="flex-1">
              <button className="flex flex-col items-start bg-white/10 text-left py-[13px] px-3.5 mb-4 rounded-xl border-0 cursor-pointer hover:bg-white/20 transition-colors w-fit"
                onClick={() => alert("Pressed!")}>
                <span className="text-white text-[15px]">
                  {"About EduMart — Powering the Future of Learning"}
                </span>
              </button>
              <div className="flex flex-col self-stretch pb-[1px] mb-[17px]">
                <span className="text-white text-4xl sm:text-5xl lg:text-[45px] font-bold leading-tight">
                  {"Redefining learning experiences with technology, innovation, and limitless access."}
                </span>
              </div>
              <div className="flex flex-col items-start self-stretch py-[7px] mb-[18px]">
                <span className="text-white/90 text-base sm:text-[17px] leading-relaxed max-w-full lg:w-[545px]">
                  {"EduMart is a next-generation learning platform built to simplify, scale, and supercharge digital education for students, educators, and institutions."}
                </span>
              </div>
              <div className="flex items-start self-stretch pb-7 gap-3.5 flex-wrap">
                <button className="flex flex-col shrink-0 items-start bg-[#FF8A33] text-left py-[17px] px-5 rounded-md border-0 hover:bg-[#e07a2e] transition-colors cursor-pointer"
                  onClick={() => navigate("/signup")}>
                  <span className="text-white text-sm">
                    {"Start Your Journey"}
                  </span>
                </button>
                <button className="flex flex-col shrink-0 items-start bg-transparent text-left py-[17px] px-[22px] rounded-md border border-solid border-white/30 hover:bg-white/10 transition-colors cursor-pointer"
                  onClick={() => navigate("/contact")}>
                  <span className="text-white text-sm">
                    {"Schedule a Demo"}
                  </span>
                </button>
              </div>
            </div>
            <img
              src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/tiz0xrlu_expires_30_days.png"}
              className="flex-1 h-[300px] sm:h-[350px] lg:h-[394px] mt-0 lg:mt-[51px] object-cover rounded-lg"
              alt="About EduMart"
            />
          </div>

          {/* Stats Section */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-8 lg:mt-0 lg:ml-0">
            <div className="flex flex-col shrink-0 items-start bg-white/10 py-[19px] px-5 gap-0.5 rounded-lg backdrop-blur-sm">
              <div className="flex flex-col items-start pb-[1px]">
                <span className="text-white text-[28px] font-bold">
                  {"50k+"}
                </span>
              </div>
              <div className="flex flex-col items-start pb-[1px]">
                <span className="text-white/80 text-[13px]">
                  {"Learners Empowered"}
                </span>
              </div>
            </div>
            <div className="flex flex-col shrink-0 items-start bg-white/10 py-[19px] px-5 gap-0.5 rounded-lg backdrop-blur-sm">
              <div className="flex flex-col items-start pb-[1px]">
                <span className="text-white text-[28px] font-bold">
                  {"200+"}
                </span>
              </div>
              <div className="flex flex-col items-start pb-[1px]">
                <span className="text-white/80 text-[13px]">
                  {"Trusted Institutions"}
                </span>
              </div>
            </div>
            <div className="flex flex-col shrink-0 items-start bg-white/10 py-[19px] px-5 gap-0.5 rounded-lg backdrop-blur-sm">
              <div className="flex flex-col items-start pb-[1px]">
                <span className="text-white text-[28px] font-bold">
                  {"1000+"}
                </span>
              </div>
              <div className="flex flex-col items-start pb-[1px]">
                <span className="text-white/80 text-[13px]">
                  {"Industry Experts"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Our Vision Section */}
        <div className="flex flex-col lg:flex-row items-stretch self-stretch py-[88px] px-4 sm:px-8 md:px-16 lg:px-36 gap-9 max-w-[1400px] mx-auto">
          <div className="flex-1 bg-white pt-10 px-6 sm:px-10 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-start self-stretch">
              <button className="flex flex-col items-start bg-[#EEF2F6] text-left py-[11px] px-3.5 rounded-xl border-0 cursor-pointer hover:bg-[#e2e8f0] transition-colors"
                onClick={() => alert("Pressed!")}>
                <span className="text-[#0b8276] text-[13px] font-bold">
                  {"Our Vision"}
                </span>
              </button>
              <div className="flex flex-col items-start self-stretch pb-[1px] mt-4">
                <span className="text-[#111b2f] text-2xl sm:text-[28px] font-bold max-w-[426px]">
                  {"Building a future where learning is seamless, scalable, and accessible to everyone."}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-start self-stretch pt-4 mb-[1px]">
              <span className="text-slate-500 text-[15px] leading-relaxed max-w-[451px]">
                {"EduMart delivers a unified platform combining live learning, digital resources, and smart assessments to create a complete education ecosystem."}
              </span>
            </div>
            <div className="flex flex-col items-start self-stretch pt-3.5 mb-[55px]">
              <span className="text-slate-500 text-[15px] leading-relaxed max-w-[459px]">
                {"We’re not just an LMS — we’re shaping the digital backbone of modern education across India."}
              </span>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-start bg-white pt-10 px-6 sm:px-10 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <button className="flex flex-col items-start bg-[#EEF2F6] text-left py-[11px] px-3.5 mb-[23px] rounded-xl border-0 cursor-pointer hover:bg-[#e2e8f0] transition-colors w-fit"
              onClick={() => alert("Pressed!")}>
              <span className="text-[#0b8276] text-[13px] font-bold">
                {"Why choose EduMart"}
              </span>
            </button>
            <div className="flex flex-col self-stretch mb-[67px] gap-[15px]">
              <div className="flex items-start self-stretch gap-3.5">
                <img
                  src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/bhewvn19_expires_30_days.png"}
                  className="w-10 h-10 object-fill"
                  alt="icon"
                />
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex flex-col items-start self-stretch py-1">
                    <span className="text-[#111b2f] text-base font-bold">
                      {"Live Classes"}
                    </span>
                  </div>
                  <div className="flex flex-col self-stretch py-[3px]">
                    <span className="text-slate-500 text-sm leading-relaxed">
                      {"Interactive live sessions with expert educators, designed for real-time engagement and clarity."}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-start self-stretch gap-3.5">
                <img
                  src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/wl4z82nr_expires_30_days.png"}
                  className="w-10 h-10 object-fill"
                  alt="icon"
                />
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex flex-col items-start self-stretch py-[5px] pl-[1px]">
                    <span className="text-[#111b2f] text-base font-bold">
                      {"E-Library"}
                    </span>
                  </div>
                  <div className="flex flex-col self-stretch py-[5px]">
                    <span className="text-slate-500 text-sm leading-relaxed">
                      {"A powerful digital library with curated content, notes, and resources available anytime, anywhere."}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-start self-stretch gap-3.5">
                <img
                  src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/mur6nhdk_expires_30_days.png"}
                  className="w-10 h-10 object-fill"
                  alt="icon"
                />
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex flex-col items-start self-stretch py-[5px] pl-[1px]">
                    <span className="text-[#111b2f] text-base font-bold">
                      {"Online Examinations"}
                    </span>
                  </div>
                  <div className="flex flex-col self-stretch py-[3px]">
                    <span className="text-slate-500 text-sm leading-relaxed">
                      {"Smart assessments with insights, analytics, and performance tracking to help students improve faster."}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Core Values Section */}
        <div className="flex flex-col items-center self-stretch bg-[#f7efeb] py-16 sm:py-24 px-4 sm:px-8 md:px-16 lg:px-[120px] gap-14">
          <div className="flex flex-col items-center pb-1.5 px-[18px] text-center">
            <button className="flex flex-col items-start bg-white text-left py-[11px] px-3.5 mb-5 rounded-xl border-0 cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
              onClick={() => alert("Pressed!")}>
              <span className="text-[#0b8276] text-[13px] font-bold">
                {"Our Core Values"}
              </span>
            </button>
            <div className="flex flex-col items-center pb-[1px] mb-[17px]">
              <span className="text-[#111b2f] text-3xl sm:text-4xl lg:text-[42px] font-bold text-center">
                {"Our Values That Define Us"}
              </span>
            </div>
            <div className="flex flex-col items-center pb-[1px]">
              <span className="text-slate-500 text-base text-center max-w-[736px]">
                {"We create meaningful impact by combining innovation, dedication, and a student-first approach."}
              </span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-stretch self-stretch gap-6">
            <div className="flex flex-1 flex-col items-start bg-white py-[34px] px-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <img
                src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/2ueyrujl_expires_30_days.png"}
                className="w-[52px] h-[52px] mb-[26px] rounded-lg object-fill"
                alt="icon"
              />
              <div className="flex flex-col items-start pb-[1px] mb-[19px]">
                <span className="text-[#111b2f] text-xl font-bold">
                  {"Quality Education"}
                </span>
              </div>
              <div className="flex flex-col self-stretch pb-[1px]">
                <span className="text-slate-500 text-sm leading-relaxed">
                  {"Delivering impactful learning experiences that prepare students for real-world success."}
                </span>
              </div>
            </div>
            <div className="flex flex-1 flex-col items-start bg-white py-[34px] px-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <img
                src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/gfi4vl2l_expires_30_days.png"}
                className="w-[52px] h-[52px] mb-[26px] rounded-lg object-fill"
                alt="icon"
              />
              <div className="flex flex-col items-start pb-[1px] mb-[19px]">
                <span className="text-[#111b2f] text-xl font-bold">
                  {"Accessibility"}
                </span>
              </div>
              <div className="flex flex-col items-start pb-[1px]">
                <span className="text-slate-500 text-sm leading-relaxed">
                  {"Breaking barriers to make quality education available to every learner, everywhere."}
                </span>
              </div>
            </div>
            <div className="flex flex-1 flex-col items-start bg-white py-[34px] px-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <img
                src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/lqmlgkjp_expires_30_days.png"}
                className="w-[52px] h-[52px] mb-[26px] rounded-lg object-fill"
                alt="icon"
              />
              <div className="flex flex-col items-start pb-[1px] mb-[23px]">
                <span className="text-[#111b2f] text-xl font-bold">
                  {"Innovation"}
                </span>
              </div>
              <div className="flex flex-col self-stretch pb-[1px]">
                <span className="text-slate-500 text-sm leading-relaxed">
                  {"Breaking barriers to make quality education available to every learner, everywhere."}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Our Journey Section */}
        <div className="flex flex-col items-center self-stretch py-16 sm:py-24 px-4 sm:px-8 md:px-16 lg:px-[120px] gap-14"
          style={{
            background: "linear-gradient(135deg, #0e7c67 0%, #1a5c3a 100%)"
          }}>
          <div className="flex flex-col items-center pb-[3px] px-[39px] text-center">
            <button className="flex flex-col items-start bg-white/10 text-left py-[11px] px-[15px] mb-[19px] rounded-xl border-0 cursor-pointer hover:bg-white/20 transition-colors"
              onClick={() => alert("Pressed!")}>
              <span className="text-white text-[13px] font-bold">
                {"Our Journey"}
              </span>
            </button>
            <div className="flex flex-col items-center pb-[1px] mb-[18px]">
              <span className="text-white text-3xl sm:text-4xl lg:text-[42px] font-bold text-center max-w-[670px]">
                {"From Vision to Impact Our Journey"}
              </span>
            </div>
            <div className="flex flex-col items-center pb-[1px]">
              <span className="text-white/90 text-base text-center max-w-[679px]">
                {"Growing with every learner, educator, and institution that trusts us."}
              </span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-stretch self-stretch gap-6">
            <div className="flex flex-1 flex-col items-start bg-white/10 pt-7 px-6 pb-8 rounded-lg hover:bg-white/15 transition-colors">
              <button className="flex flex-col items-start bg-white/20 text-left py-[13px] px-[21px] mb-[22px] rounded-xl border-0 cursor-pointer"
                onClick={() => alert("Pressed!")}>
                <span className="text-white text-[13px] font-bold">
                  {"The Beginning"}
                </span>
              </button>
              <div className="flex flex-col items-start pb-[1px] mb-6">
                <span className="text-white text-[19px] font-bold">
                  {"Launched with a vision"}
                </span>
              </div>
              <div className="flex flex-col self-stretch pb-[1px]">
                <span className="text-white/80 text-sm leading-relaxed">
                  {"EduMart started as a platform to bridge the gap between quality education and student accessibility."}
                </span>
              </div>
            </div>
            <div className="flex flex-1 flex-col items-start bg-white/10 pt-7 px-6 pb-8 rounded-lg hover:bg-white/15 transition-colors">
              <button className="flex flex-col items-start bg-white/20 text-left py-[13px] px-5 mb-[22px] rounded-xl border-0 cursor-pointer"
                onClick={() => alert("Pressed!")}>
                <span className="text-white text-[13px] font-bold">
                  {"Growth"}
                </span>
              </button>
              <div className="flex flex-col items-start pb-[1px] mb-6">
                <span className="text-white text-[19px] font-bold">
                  {"Expanding our reach"}
                </span>
              </div>
              <div className="flex flex-col self-stretch pb-[1px]">
                <span className="text-white/80 text-sm leading-relaxed">
                  {"Partnered with schools and tutors across India to deliver comprehensive learning solutions."}
                </span>
              </div>
            </div>
            <div className="flex flex-1 flex-col items-start bg-white/10 pt-7 px-6 pb-8 rounded-lg hover:bg-white/15 transition-colors">
              <button className="flex flex-col items-start bg-white/20 text-left py-[13px] px-[19px] mb-[22px] rounded-xl border-0 cursor-pointer"
                onClick={() => alert("Pressed!")}>
                <span className="text-white text-[13px] font-bold">
                  {"Innovation"}
                </span>
              </button>
              <div className="flex flex-col items-start pb-[1px] mb-6">
                <span className="text-white text-[19px] font-bold">
                  {"Tech-driven learning"}
                </span>
              </div>
              <div className="flex flex-col self-stretch pb-[1px]">
                <span className="text-white/80 text-sm leading-relaxed">
                  {"Introduced live classes, e-library, and online test series for complete exam preparation."}
                </span>
              </div>
            </div>
            <div className="flex flex-1 flex-col items-start bg-white/10 pt-7 px-6 pb-8 rounded-lg hover:bg-white/15 transition-colors">
              <button className="flex flex-col items-start bg-white/20 text-left py-[13px] px-[19px] mb-[22px] rounded-xl border-0 cursor-pointer"
                onClick={() => alert("Pressed!")}>
                <span className="text-white text-[13px] font-bold">
                  {"Today & Beyond"}
                </span>
              </button>
              <div className="flex flex-col items-start pb-[1px] mb-6">
                <span className="text-white text-[19px] font-bold">
                  {"Empowering learners"}
                </span>
              </div>
              <div className="flex flex-col self-stretch pb-[1px]">
                <span className="text-white/80 text-sm leading-relaxed">
                  {"Thousands of students trust EduMart to learn, practice, and succeed in competitive exams."}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Our Team Section */}
        <div className="flex flex-col items-center self-stretch bg-[#f7efeb] py-16 sm:py-24 px-4 sm:px-8 md:px-16 lg:px-[120px] gap-14">
          <div className="flex flex-col items-center pb-0.5 px-2 text-center">
            <button className="flex flex-col items-start bg-white text-left py-[13px] px-[15px] mb-5 rounded-xl border-0 cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
              onClick={() => alert("Pressed!")}>
              <span className="text-[#0b8276] text-[13px] font-bold">
                {"Our Leadership"}
              </span>
            </button>
            <div className="flex flex-col items-center pb-[1px] mb-[18px]">
              <span className="text-[#111b2f] text-3xl sm:text-4xl lg:text-[42px] font-bold text-center">
                {"Meet the team behind EduMart"}
              </span>
            </div>
            <div className="flex flex-col items-center pb-[1px]">
              <span className="text-slate-500 text-base text-center max-w-[740px]">
                {"A passionate team of educators, technologists, and innovators committed to transforming education in India."}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:grid sm:grid-cols-2 lg:flex lg:flex-row items-stretch gap-6">
            <div className="flex flex-1 flex-col items-center bg-white py-6 px-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <img
                src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/vwiue9y6_expires_30_days.png"}
                className="w-24 h-24 mb-6 rounded-full object-cover"
                alt="Team member"
              />
              <div className="flex flex-col items-center pb-[1px] mb-[18px]">
                <span className="text-[#111b2f] text-lg font-bold">
                  {"Rahul Mehta"}
                </span>
              </div>
              <div className="flex flex-col items-center pb-[1px] mb-2.5">
                <span className="text-[#0b8276] text-sm font-medium">
                  {"Founder & CEO"}
                </span>
              </div>
              <div className="flex flex-col self-stretch pb-[1px] text-center">
                <span className="text-slate-500 text-sm leading-relaxed">
                  {"Visionary leader driving EduMart's mission to make quality education accessible across India."}
                </span>
              </div>
            </div>
            <div className="flex flex-1 flex-col items-center bg-white py-6 px-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <img
                src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/wzh17xdx_expires_30_days.png"}
                className="w-24 h-24 mb-6 rounded-full object-cover"
                alt="Team member"
              />
              <div className="flex flex-col items-center pb-[1px] mb-[17px]">
                <span className="text-[#111b2f] text-lg font-bold">
                  {"Priya Sharma"}
                </span>
              </div>
              <div className="flex flex-col items-center pb-[1px] mb-[11px]">
                <span className="text-[#0b8276] text-sm font-medium">
                  {"Head of Academics"}
                </span>
              </div>
              <div className="flex flex-col self-stretch pb-[1px] text-center">
                <span className="text-slate-500 text-sm leading-relaxed">
                  {"Leads curriculum development and ensures high-quality learning content for all students."}
                </span>
              </div>
            </div>
            <div className="flex flex-1 flex-col items-center bg-white py-6 px-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <img
                src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/x943adnz_expires_30_days.png"}
                className="w-24 h-24 mb-6 rounded-full object-cover"
                alt="Team member"
              />
              <div className="flex flex-col items-center pb-[1px] mb-[15px]">
                <span className="text-[#111b2f] text-lg font-bold">
                  {"Amit Kumar"}
                </span>
              </div>
              <div className="flex flex-col items-center pb-[1px] mb-2.5">
                <span className="text-[#0b8276] text-sm font-medium">
                  {"Chief Technology Officer"}
                </span>
              </div>
              <div className="flex flex-col self-stretch pb-[1px] text-center">
                <span className="text-slate-500 text-sm leading-relaxed">
                  {"Builds and scales the technology platform to deliver seamless learning experiences."}
                </span>
              </div>
            </div>
            <div className="flex flex-1 flex-col items-center bg-white py-6 px-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <img
                src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/3jop35i9_expires_30_days.png"}
                className="w-24 h-24 mb-6 rounded-full object-cover"
                alt="Team member"
              />
              <div className="flex flex-col items-center pb-[1px] mb-[17px]">
                <span className="text-[#111b2f] text-lg font-bold">
                  {"Neha Gupta"}
                </span>
              </div>
              <div className="flex flex-col items-center pb-[1px] mb-2">
                <span className="text-[#0b8276] text-sm font-medium">
                  {"Student Success Lead"}
                </span>
              </div>
              <div className="flex flex-col self-stretch pb-[1px] text-center">
                <span className="text-slate-500 text-sm leading-relaxed">
                  {"Ensures every student gets the support and guidance they need to succeed."}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="self-stretch py-16 px-4 sm:px-8 md:px-16 lg:px-36"
          style={{
            background: "linear-gradient(135deg, #0e7c67 0%, #1a5c3a 100%)"
          }}>
          <div className="flex flex-col lg:flex-row justify-between items-center self-stretch bg-white/10 max-w-[1152px] mx-auto py-[31px] px-6 sm:px-9 rounded-lg">
            <div className="flex flex-col shrink-0 items-start gap-3 text-center lg:text-left mb-6 lg:mb-0">
              <div className="flex flex-col items-start py-0.5">
                <span className="text-white text-2xl sm:text-[32px] font-bold max-w-[572px]">
                  {"Ready to transform your learning journey?"}
                </span>
              </div>
              <div className="flex flex-col items-start py-1">
                <span className="text-white/90 text-[15px] max-w-[559px]">
                  {"Join thousands of students and educators already using EduMart to learn, teach, and grow. Start your journey today."}
                </span>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-4 flex-wrap justify-center">
              <button className="flex flex-col shrink-0 items-start bg-[#FF8A33] text-left py-[13px] px-[22px] rounded-md border-0 hover:bg-[#e07a2e] transition-colors cursor-pointer"
                onClick={() => navigate("/signup")}>
                <span className="text-white text-sm font-bold">
                  {"Start Learning"}
                </span>
              </button>
              <button className="flex flex-col shrink-0 items-start bg-white/10 text-left py-[13px] px-[23px] rounded-md border border-solid border-white/30 hover:bg-white/20 transition-colors cursor-pointer"
                onClick={() => navigate("/contact")}>
                <span className="text-white text-sm font-bold">
                  {"Contact Us"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}