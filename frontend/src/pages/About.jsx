import React from "react";

export default (props) => {
  return (
    <div className="flex flex-col bg-white">
      <div className="self-stretch bg-[#F7FCFF]">
        {/* Hero Section - About Us with matching gradient */}
        <div className="self-stretch pt-[60px] pb-[78px] px-4 sm:px-8 md:px-16 lg:px-36 mb-[97px]"
          style={{
            background: "linear-gradient(135deg, #0e7c67 0%, #1a5c3a 100%)"
          }}>
          <div className="flex flex-col lg:flex-row items-center self-stretch gap-8 lg:gap-14">
            <div className="flex-1">
              <button className="flex flex-col items-start bg-white/10 text-left py-[13px] px-3.5 mb-4 rounded-xl border-0 cursor-pointer hover:bg-white/20 transition-colors w-fit"
                onClick={() => alert("Pressed!")}>
                <span className="text-white text-[13px]">
                  {"About Us"}
                </span>
              </button>
              <div className="flex flex-col self-stretch pb-[1px] mb-[17px]">
                <span className="text-white text-4xl sm:text-5xl lg:text-[58px] font-bold leading-tight">
                  {"We help educators build better learning businesses."}
                </span>
              </div>
              <div className="flex flex-col items-start self-stretch py-[7px] mb-[18px]">
                <span className="text-white/90 text-base sm:text-[17px] leading-relaxed max-w-full lg:w-[545px]">
                  {"LMS was created to make online education easier to launch, simpler to manage, and more rewarding to grow. From individual instructors to multi-branch institutes, we give teams the tools to teach, sell, and scale with confidence."}
                </span>
              </div>
              <div className="flex items-start self-stretch pt-[15px] gap-3.5 flex-wrap">
                <button className="flex flex-col shrink-0 items-start bg-[#FF8A33] text-left py-[17px] px-5 rounded-md border-0 hover:bg-[#e07a2e] transition-colors cursor-pointer"
                  onClick={() => alert("Pressed!")}>
                  <span className="text-white text-sm">
                    {"Get Started"}
                  </span>
                </button>
                <button className="flex flex-col shrink-0 items-start bg-transparent text-left py-[17px] px-[22px] rounded-md border border-solid border-white/30 hover:bg-white/10 transition-colors cursor-pointer"
                  onClick={() => alert("Pressed!")}>
                  <span className="text-white text-sm">
                    {"Book Demo"}
                  </span>
                </button>
              </div>
            </div>
            <img
              src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/tiz0xrlu_expires_30_days.png"}
              className="flex-1 h-[300px] sm:h-[350px] lg:h-[394px] mt-0 lg:mt-[51px] object-cover rounded-lg"
              alt="About us"
            />
          </div>

          {/* Stats Section */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-8 lg:mt-0 lg:ml-0">
            <div className="flex flex-col shrink-0 items-start bg-white/10 py-[19px] px-5 gap-0.5 rounded-lg backdrop-blur-sm">
              <div className="flex flex-col items-start pb-[1px]">
                <span className="text-white text-[28px] font-bold">
                  {"12k+"}
                </span>
              </div>
              <div className="flex flex-col items-start pb-[1px]">
                <span className="text-white/80 text-[13px]">
                  {"Active educators"}
                </span>
              </div>
            </div>
            <div className="flex flex-col shrink-0 items-start bg-white/10 py-[19px] px-5 gap-0.5 rounded-lg backdrop-blur-sm">
              <div className="flex flex-col items-start pb-[1px]">
                <span className="text-white text-[28px] font-bold">
                  {"1.8M"}
                </span>
              </div>
              <div className="flex flex-col items-start pb-[1px]">
                <span className="text-white/80 text-[13px]">
                  {"Learners reached"}
                </span>
              </div>
            </div>
            <div className="flex flex-col shrink-0 items-start bg-white/10 py-[19px] px-5 gap-0.5 rounded-lg backdrop-blur-sm">
              <div className="flex flex-col items-start pb-[1px]">
                <span className="text-white text-[28px] font-bold">
                  {"48"}
                </span>
              </div>
              <div className="flex flex-col items-start pb-[1px]">
                <span className="text-white/80 text-[13px]">
                  {"Countries served"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Our Story Section - Matching Features.jsx style */}
        <div className="flex flex-col lg:flex-row items-stretch self-stretch py-[88px] px-4 sm:px-8 md:px-16 lg:px-36 gap-9 max-w-[1400px] mx-auto">
          <div className="flex-1 bg-white pt-10 px-6 sm:px-10 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-start self-stretch">
              <button className="flex flex-col items-start bg-[#EEF2F6] text-left py-[11px] px-3.5 rounded-xl border-0 cursor-pointer hover:bg-[#e2e8f0] transition-colors"
                onClick={() => alert("Pressed!")}>
                <span className="text-[#0b8276] text-[13px] font-bold">
                  {"Our Story"}
                </span>
              </button>
              <div className="flex flex-col items-start self-stretch pb-[1px] mt-4">
                <span className="text-[#111b2f] text-2xl sm:text-[28px] font-bold max-w-[426px]">
                  {"Built for the people shaping the future of learning."}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-start self-stretch pt-4 mb-[1px]">
              <span className="text-slate-500 text-[15px] leading-relaxed max-w-[451px]">
                {"What started as a platform for a small group of online educators quickly grew into a full LMS ecosystem for schools, academies, and digital course businesses. We saw the same problem everywhere: powerful learning tools were either too fragmented or too hard to use."}
              </span>
            </div>
            <div className="flex flex-col items-start self-stretch pt-3.5 mb-[55px]">
              <span className="text-slate-500 text-[15px] leading-relaxed max-w-[459px]">
                {"So we designed LMS to feel modern, trustworthy, and easy from day one — giving education teams one place to manage courses, students, payments, analytics, and growth."}
              </span>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-start bg-white pt-10 px-6 sm:px-10 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <button className="flex flex-col items-start bg-[#EEF2F6] text-left py-[11px] px-3.5 mb-[23px] rounded-xl border-0 cursor-pointer hover:bg-[#e2e8f0] transition-colors w-fit"
              onClick={() => alert("Pressed!")}>
              <span className="text-[#0b8276] text-[13px] font-bold">
                {"Why teams choose us"}
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
                      {"All-in-one operations"}
                    </span>
                  </div>
                  <div className="flex flex-col self-stretch py-[3px]">
                    <span className="text-slate-500 text-sm leading-relaxed">
                      {"Course delivery, billing, student management, and reporting in one streamlined workspace."}
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
                      {"Built for scale"}
                    </span>
                  </div>
                  <div className="flex flex-col self-stretch py-[5px]">
                    <span className="text-slate-500 text-sm leading-relaxed">
                      {"Perfect for solo creators, fast-growing academies, and multi-tenant institute networks."}
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
                      {"Reliable and secure"}
                    </span>
                  </div>
                  <div className="flex flex-col self-stretch py-[3px]">
                    <span className="text-slate-500 text-sm leading-relaxed">
                      {"Trusted infrastructure, payment integrations, and learner-friendly experiences built in."}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Values Section - Matching Features.jsx "Six modules" style */}
        <div className="flex flex-col items-center self-stretch bg-[#f7efeb] py-16 sm:py-24 px-4 sm:px-8 md:px-16 lg:px-[120px] gap-14">
          <div className="flex flex-col items-center pb-1.5 px-[18px] text-center">
            <button className="flex flex-col items-start bg-white text-left py-[11px] px-3.5 mb-5 rounded-xl border-0 cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
              onClick={() => alert("Pressed!")}>
              <span className="text-[#0b8276] text-[13px] font-bold">
                {"Our Values"}
              </span>
            </button>
            <div className="flex flex-col items-center pb-[1px] mb-[17px]">
              <span className="text-[#111b2f] text-3xl sm:text-4xl lg:text-[42px] font-bold text-center">
                {"What guides every product decision"}
              </span>
            </div>
            <div className="flex flex-col items-center pb-[1px]">
              <span className="text-slate-500 text-base text-center max-w-[736px]">
                {"We believe education platforms should be simple to run, delightful to use, and powerful enough to support long-term growth."}
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
                  {"Clarity first"}
                </span>
              </div>
              <div className="flex flex-col self-stretch pb-[1px]">
                <span className="text-slate-500 text-sm leading-relaxed">
                  {"We remove friction so educators can focus on teaching, not on managing complicated software."}
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
                  {"Human-centered learning"}
                </span>
              </div>
              <div className="flex flex-col items-start pb-[1px]">
                <span className="text-slate-500 text-sm leading-relaxed">
                  {"Every workflow is designed around better outcomes for teams, instructors, and learners."}
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
                  {"Growth with confidence"}
                </span>
              </div>
              <div className="flex flex-col self-stretch pb-[1px]">
                <span className="text-slate-500 text-sm leading-relaxed">
                  {"We help education businesses expand with tools that are dependable, scalable, and measurable."}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Our Journey Section - Gradient matching Features.jsx */}
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
                {"From a course platform to a full LMS ecosystem"}
              </span>
            </div>
            <div className="flex flex-col items-center pb-[1px]">
              <span className="text-white/90 text-base text-center max-w-[679px]">
                {"We have grown alongside the educators and institutes who trust us to power their learning experience."}
              </span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-stretch self-stretch gap-6">
            <div className="flex flex-1 flex-col items-start bg-white/10 pt-7 px-6 pb-8 rounded-lg hover:bg-white/15 transition-colors">
              <button className="flex flex-col items-start bg-white/20 text-left py-[13px] px-[21px] mb-[22px] rounded-xl border-0 cursor-pointer"
                onClick={() => alert("Pressed!")}>
                <span className="text-white text-[13px] font-bold">
                  {"2021"}
                </span>
              </button>
              <div className="flex flex-col items-start pb-[1px] mb-6">
                <span className="text-white text-[19px] font-bold">
                  {"The idea"}
                </span>
              </div>
              <div className="flex flex-col self-stretch pb-[1px]">
                <span className="text-white/80 text-sm leading-relaxed">
                  {"We launched our first version to help instructors publish and monetize their courses faster."}
                </span>
              </div>
            </div>
            <div className="flex flex-1 flex-col items-start bg-white/10 pt-7 px-6 pb-8 rounded-lg hover:bg-white/15 transition-colors">
              <button className="flex flex-col items-start bg-white/20 text-left py-[13px] px-5 mb-[22px] rounded-xl border-0 cursor-pointer"
                onClick={() => alert("Pressed!")}>
                <span className="text-white text-[13px] font-bold">
                  {"2022"}
                </span>
              </button>
              <div className="flex flex-col items-start pb-[1px] mb-6">
                <span className="text-white text-[19px] font-bold">
                  {"Multi-tenant launch"}
                </span>
              </div>
              <div className="flex flex-col self-stretch pb-[1px]">
                <span className="text-white/80 text-sm leading-relaxed">
                  {"Institutes gained branded portals, flexible admin controls, and stronger organization tools."}
                </span>
              </div>
            </div>
            <div className="flex flex-1 flex-col items-start bg-white/10 pt-7 px-6 pb-8 rounded-lg hover:bg-white/15 transition-colors">
              <button className="flex flex-col items-start bg-white/20 text-left py-[13px] px-[19px] mb-[22px] rounded-xl border-0 cursor-pointer"
                onClick={() => alert("Pressed!")}>
                <span className="text-white text-[13px] font-bold">
                  {"2023"}
                </span>
              </button>
              <div className="flex flex-col items-start pb-[1px] mb-6">
                <span className="text-white text-[19px] font-bold">
                  {"Global reach"}
                </span>
              </div>
              <div className="flex flex-col self-stretch pb-[1px]">
                <span className="text-white/80 text-sm leading-relaxed">
                  {"Expanded payments, analytics, and integrations helped customers serve learners worldwide."}
                </span>
              </div>
            </div>
            <div className="flex flex-1 flex-col items-start bg-white/10 pt-7 px-6 pb-8 rounded-lg hover:bg-white/15 transition-colors">
              <button className="flex flex-col items-start bg-white/20 text-left py-[13px] px-[19px] mb-[22px] rounded-xl border-0 cursor-pointer"
                onClick={() => alert("Pressed!")}>
                <span className="text-white text-[13px] font-bold">
                  {"2024"}
                </span>
              </button>
              <div className="flex flex-col items-start pb-[1px] mb-6">
                <span className="text-white text-[19px] font-bold">
                  {"Smarter growth"}
                </span>
              </div>
              <div className="flex flex-col self-stretch pb-[1px]">
                <span className="text-white/80 text-sm leading-relaxed">
                  {"Today LMS powers modern learning businesses with better automation, insights, and support."}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Our Team Section - Matching Features.jsx style */}
        <div className="flex flex-col items-center self-stretch bg-[#f7efeb] py-16 sm:py-24 px-4 sm:px-8 md:px-16 lg:px-[120px] gap-14">
          <div className="flex flex-col items-center pb-0.5 px-2 text-center">
            <button className="flex flex-col items-start bg-white text-left py-[13px] px-[15px] mb-5 rounded-xl border-0 cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
              onClick={() => alert("Pressed!")}>
              <span className="text-[#0b8276] text-[13px] font-bold">
                {"Our Team"}
              </span>
            </button>
            <div className="flex flex-col items-center pb-[1px] mb-[18px]">
              <span className="text-[#111b2f] text-3xl sm:text-4xl lg:text-[42px] font-bold text-center">
                {"Meet the people behind LMS"}
              </span>
            </div>
            <div className="flex flex-col items-center pb-[1px]">
              <span className="text-slate-500 text-base text-center max-w-[740px]">
                {"A small, focused team of product builders, education thinkers, and operators committed to helping learning businesses grow."}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:grid sm:grid-cols-2 lg:flex lg:flex-row items-stretch gap-6">
            <div className="flex flex-1 flex-col items-center bg-white py-6 px-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <img
                src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/vwiue9y6_expires_30_days.png"}
                className="w-24 h-24 mb-6 rounded-full object-cover"
                alt="Sarah Jenkins"
              />
              <div className="flex flex-col items-center pb-[1px] mb-[18px]">
                <span className="text-[#111b2f] text-lg font-bold">
                  {"Sarah Jenkins"}
                </span>
              </div>
              <div className="flex flex-col items-center pb-[1px] mb-2.5">
                <span className="text-[#0b8276] text-sm font-medium">
                  {"Co-Founder & CEO"}
                </span>
              </div>
              <div className="flex flex-col self-stretch pb-[1px] text-center">
                <span className="text-slate-500 text-sm leading-relaxed">
                  {"Shapes product vision and works closely with education partners on platform strategy."}
                </span>
              </div>
            </div>
            <div className="flex flex-1 flex-col items-center bg-white py-6 px-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <img
                src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/wzh17xdx_expires_30_days.png"}
                className="w-24 h-24 mb-6 rounded-full object-cover"
                alt="David Chen"
              />
              <div className="flex flex-col items-center pb-[1px] mb-[17px]">
                <span className="text-[#111b2f] text-lg font-bold">
                  {"David Chen"}
                </span>
              </div>
              <div className="flex flex-col items-center pb-[1px] mb-[11px]">
                <span className="text-[#0b8276] text-sm font-medium">
                  {"Head of Product"}
                </span>
              </div>
              <div className="flex flex-col self-stretch pb-[1px] text-center">
                <span className="text-slate-500 text-sm leading-relaxed">
                  {"Leads roadmap planning and keeps the platform intuitive for instructors and admins."}
                </span>
              </div>
            </div>
            <div className="flex flex-1 flex-col items-center bg-white py-6 px-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <img
                src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/x943adnz_expires_30_days.png"}
                className="w-24 h-24 mb-6 rounded-full object-cover"
                alt="Priya Nair"
              />
              <div className="flex flex-col items-center pb-[1px] mb-[15px]">
                <span className="text-[#111b2f] text-lg font-bold">
                  {"Priya Nair"}
                </span>
              </div>
              <div className="flex flex-col items-center pb-[1px] mb-2.5">
                <span className="text-[#0b8276] text-sm font-medium">
                  {"Customer Success Lead"}
                </span>
              </div>
              <div className="flex flex-col self-stretch pb-[1px] text-center">
                <span className="text-slate-500 text-sm leading-relaxed">
                  {"Helps schools and course creators launch smoothly and scale with confidence."}
                </span>
              </div>
            </div>
            <div className="flex flex-1 flex-col items-center bg-white py-6 px-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <img
                src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/3jop35i9_expires_30_days.png"}
                className="w-24 h-24 mb-6 rounded-full object-cover"
                alt="Lucas Rivera"
              />
              <div className="flex flex-col items-center pb-[1px] mb-[17px]">
                <span className="text-[#111b2f] text-lg font-bold">
                  {"Lucas Rivera"}
                </span>
              </div>
              <div className="flex flex-col items-center pb-[1px] mb-2">
                <span className="text-[#0b8276] text-sm font-medium">
                  {"Engineering Lead"}
                </span>
              </div>
              <div className="flex flex-col self-stretch pb-[1px] text-center">
                <span className="text-slate-500 text-sm leading-relaxed">
                  {"Builds secure, reliable systems that support modern learning experiences at scale."}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Section - Matching Features.jsx gradient CTA */}
        <div className="self-stretch py-16 px-4 sm:px-8 md:px-16 lg:px-36"
          style={{
            background: "linear-gradient(135deg, #0e7c67 0%, #1a5c3a 100%)"
          }}>
          <div className="flex flex-col lg:flex-row justify-between items-center self-stretch bg-white/10 max-w-[1152px] mx-auto py-[31px] px-6 sm:px-9 rounded-lg">
            <div className="flex flex-col shrink-0 items-start gap-3 text-center lg:text-left mb-6 lg:mb-0">
              <div className="flex flex-col items-start py-0.5">
                <span className="text-white text-2xl sm:text-[32px] font-bold max-w-[572px]">
                  {"Want to build the next great learning platform?"}
                </span>
              </div>
              <div className="flex flex-col items-start py-1">
                <span className="text-white/90 text-[15px] max-w-[559px]">
                  {"Join thousands of educators, academies, and training businesses already using LMS to launch courses, manage students, and grow revenue."}
                </span>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-4 flex-wrap justify-center">
              <button className="flex flex-col shrink-0 items-start bg-[#FF8A33] text-left py-[13px] px-[22px] rounded-md border-0 hover:bg-[#e07a2e] transition-colors cursor-pointer"
                onClick={() => alert("Pressed!")}>
                <span className="text-white text-sm font-bold">
                  {"Start for Free"}
                </span>
              </button>
              <button className="flex flex-col shrink-0 items-start bg-white/10 text-left py-[13px] px-[23px] rounded-md border border-solid border-white/30 hover:bg-white/20 transition-colors cursor-pointer"
                onClick={() => alert("Pressed!")}>
                <span className="text-white text-sm font-bold">
                  {"Talk to Sales"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}