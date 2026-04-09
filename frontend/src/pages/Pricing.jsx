import React, { useState } from "react";

export default (props) => {
  const [input1, onChangeInput1] = useState('');
  const [input2, onChangeInput2] = useState('');

  return (
    <div className="flex flex-col bg-white">
      <div className="self-stretch bg-[#F7FCFF]">
        {/* Hero Section with gradient - Matching Features.jsx */}
        <div className="self-stretch pt-[60px] pb-[78px] px-4 sm:px-8 md:px-16 lg:px-36 mb-[97px]"
          style={{
            background: "linear-gradient(135deg, #0e7c67 0%, #1a5c3a 100%)"
          }}>
          <div className="flex flex-col lg:flex-row items-center self-stretch mb-[31px] gap-8 lg:gap-12">
            <div className="flex flex-1 flex-col items-start">
              <div className="flex items-center mb-[23px] flex-wrap gap-2">
                <button className="flex flex-col shrink-0 items-start bg-white/10 text-left py-[9px] px-3.5 rounded-xl border border-solid border-white/20 hover:bg-white/20 transition-colors cursor-pointer"
                  onClick={() => alert("Pressed!")}>
                  <span className="text-white text-[13px] font-bold">
                    {"14-day free trial"}
                  </span>
                </button>
                <button className="flex flex-col shrink-0 items-start bg-white/10 text-left py-[9px] px-[15px] rounded-xl border border-solid border-white/20 hover:bg-white/20 transition-colors cursor-pointer"
                  onClick={() => alert("Pressed!")}>
                  <span className="text-white text-[13px] font-bold">
                    {"No setup fee"}
                  </span>
                </button>
                <button className="flex flex-col shrink-0 items-start bg-white/10 text-left py-2.5 px-[15px] rounded-xl border border-solid border-white/20 hover:bg-white/20 transition-colors cursor-pointer"
                  onClick={() => alert("Pressed!")}>
                  <span className="text-white text-[13px] font-bold">
                    {"Built for course businesses"}
                  </span>
                </button>
              </div>
              <div className="flex flex-col items-start self-stretch pb-[1px] mb-7">
                <span className="text-white text-4xl sm:text-5xl lg:text-[64px] font-bold max-w-full lg:w-[501px] leading-tight">
                  {"Simple pricing to\nlaunch, sell, and\nscale your LMS"}
                </span>
              </div>
              <div className="flex flex-col items-start self-stretch pb-[1px] mb-7">
                <span className="text-white/90 text-base sm:text-[17px] max-w-full lg:w-[531px] leading-relaxed">
                  {"Choose a plan that fits your stage today, then upgrade as your learners, instructors, and revenue grow. Everything is designed for modern educational businesses that want clarity and speed."}
                </span>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <button className="flex flex-col shrink-0 items-start bg-[#FF8A33] text-left py-[18px] px-[21px] rounded-md border-0 hover:bg-[#e07a2e] transition-colors cursor-pointer"
                  onClick={() => alert("Pressed!")}>
                  <span className="text-white text-sm font-bold">
                    {"Get Started"}
                  </span>
                </button>
                <button className="flex flex-col shrink-0 items-start bg-white/10 text-left py-[18px] px-[23px] rounded-md border border-solid border-white/30 hover:bg-white/20 transition-colors cursor-pointer"
                  onClick={() => alert("Pressed!")}>
                  <span className="text-white text-sm font-bold">
                    {"Book Demo"}
                  </span>
                </button>
              </div>
            </div>

            {/* Card - Matching Features.jsx style */}
            <div className="flex-1 w-full bg-white/5 p-4 sm:p-7 rounded-lg backdrop-blur-sm"
              style={{
                boxShadow: "0px 24px 60px rgba(0,0,0,0.2)"
              }}>
              <div className="flex flex-col self-stretch bg-white py-7 px-4 sm:px-6 gap-5 rounded-lg">
                <div className="flex items-center bg-[#F3F6F9] p-1.5 rounded-xl w-fit">
                  <button className="flex flex-col shrink-0 items-start bg-white text-left py-[11px] px-4 rounded-xl border-0 shadow-sm cursor-pointer"
                    onClick={() => alert("Pressed!")}>
                    <span className="text-[#15192D] text-[13px] font-bold">
                      {"Monthly billing"}
                    </span>
                  </button>
                  <div className="flex flex-col shrink-0 items-start py-[11px] px-[15px] rounded-xl">
                    <span className="text-[#15192D] text-[13px] font-bold">
                      {"Yearly billing"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-5">
                  <div className="flex justify-between items-center flex-wrap gap-3">
                    <div className="flex flex-col shrink-0 items-start gap-1.5">
                      <div className="flex flex-col items-start py-[5px] px-[1px]">
                        <span className="text-slate-500 text-sm">
                          {"Most teams choose"}
                        </span>
                      </div>
                      <div className="flex flex-col items-start py-2 pl-[1px] pr-[42px]">
                        <span className="text-[#111b2f] text-[22px] font-bold">
                          {"Pro Plan"}
                        </span>
                      </div>
                    </div>
                    <button className="flex flex-col shrink-0 items-start bg-[#FF8A3324] text-left py-[9px] px-3.5 rounded-xl border-0 cursor-pointer hover:bg-[#FF8A3340] transition-colors"
                      onClick={() => alert("Pressed!")}>
                      <span className="text-[#FF8A33] text-[13px] font-bold">
                        {"Most Popular"}
                      </span>
                    </button>
                  </div>

                  <div className="flex justify-between items-start flex-wrap gap-3">
                    <div className="flex shrink-0 items-start gap-2">
                      <div className="flex flex-col shrink-0 items-start py-0.5 px-[1px]">
                        <span className="text-[#111b2f] text-[56px] font-bold">
                          {"$79"}
                        </span>
                      </div>
                      <div className="flex flex-col shrink-0 items-start py-2 mt-[25px]">
                        <span className="text-slate-500 text-[15px]">
                          {"/month"}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col shrink-0 items-start py-[3px] mt-9">
                      <span className="text-green-600 text-[13px] font-bold">
                        {"Save 18% yearly"}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-center items-stretch flex-wrap gap-3">
                    <div className="flex flex-col flex-1 min-w-[100px] items-start bg-[#F3F6F9] pt-3.5 px-[13px] rounded-md">
                      <div className="flex flex-col items-start pb-[1px] mb-[3px]">
                        <span className="text-[#111b2f] text-lg font-bold">
                          {"Unlimited"}
                        </span>
                      </div>
                      <div className="flex flex-col items-start pb-[1px] pr-[38px] mb-[33px]">
                        <span className="text-slate-500 text-[13px]">
                          {"Students"}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col flex-1 min-w-[100px] items-start bg-[#F3F6F9] py-3.5 px-[13px] gap-[3px] rounded-md">
                      <div className="flex flex-col items-start pb-[1px]">
                        <span className="text-[#111b2f] text-lg font-bold">
                          {"24/7"}
                        </span>
                      </div>
                      <div className="flex flex-col items-start pb-[1px]">
                        <span className="text-slate-500 text-[13px]">
                          {"Priority support"}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col flex-1 min-w-[100px] items-start bg-[#F3F6F9] py-3.5 px-[13px] gap-[3px] rounded-md">
                      <div className="flex flex-col items-start pb-[1px]">
                        <span className="text-[#111b2f] text-lg font-bold">
                          {"1-click"}
                        </span>
                      </div>
                      <div className="flex flex-col items-start pb-[1px]">
                        <span className="text-slate-500 text-[13px]">
                          {"Custom domain"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3.5">
                    <div className="flex items-center gap-[13px]">
                      <img
                        src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/BywfetPpbr/nxulcuv4_expires_30_days.png"}
                        className="w-5 h-5 object-fill"
                        alt="check"
                      />
                      <span className="text-[#111b2f] text-sm">
                        {"Unlimited courses and landing pages"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <img
                        src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/BywfetPpbr/8973s6ul_expires_30_days.png"}
                        className="w-5 h-5 object-fill"
                        alt="check"
                      />
                      <span className="text-[#111b2f] text-sm">
                        {"Stripe and Razorpay payment support"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <img
                        src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/BywfetPpbr/qz5imtdx_expires_30_days.png"}
                        className="w-5 h-5 object-fill"
                        alt="check"
                      />
                      <span className="text-[#111b2f] text-sm">
                        {"Analytics, coupons, and team seats"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Plans Section - Matching Features.jsx "Six modules" style */}
        <div className="flex flex-col items-center self-stretch bg-[#f7efeb] py-16 sm:py-24 px-4 sm:px-8 md:px-16 lg:px-[120px] gap-14">
          <div className="flex flex-col items-center pb-1.5 px-[18px] text-center">
            <button className="flex flex-col items-start bg-white text-left py-[9px] px-[13px] mb-5 rounded-xl border-0 cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
              onClick={() => alert("Pressed!")}>
              <span className="text-[#0b8276] text-[13px] font-bold">
                {"Pricing"}
              </span>
            </button>
            <div className="flex flex-col items-center pb-[1px] mb-[21px]">
              <span className="text-[#111b2f] text-3xl sm:text-4xl lg:text-[44px] font-bold text-center max-w-[654px]">
                {"Pick the plan that matches your growth stage"}
              </span>
            </div>
            <div className="flex flex-col items-center pb-[1px]">
              <span className="text-slate-500 text-base text-center max-w-[582px]">
                {"Clear monthly pricing, core LMS features included, and room to scale without changing platforms."}
              </span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-stretch self-stretch gap-6">
            {/* Basic Plan */}
            <div className="flex flex-1 flex-col items-start bg-white py-[31px] px-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex flex-col self-stretch mb-6 gap-2.5">
                <div className="flex flex-col items-start self-stretch pb-[1px]">
                  <span className="text-[#111b2f] text-2xl font-bold">
                    {"Basic"}
                  </span>
                </div>
                <div className="flex flex-col items-start self-stretch pb-[1px]">
                  <span className="text-slate-500 text-sm">
                    {"For new creators and small academies launching their first paid courses."}
                  </span>
                </div>
              </div>
              <div className="flex items-start self-stretch mb-[17px] gap-[9px]">
                <div className="flex flex-col shrink-0 items-start py-0.5 px-[1px]">
                  <span className="text-[#111b2f] text-[56px] font-bold">
                    {"$29"}
                  </span>
                </div>
                <div className="flex flex-col shrink-0 items-start py-2 mt-[25px]">
                  <span className="text-slate-500 text-[15px]">
                    {"/mo"}
                  </span>
                </div>
              </div>
              <span className="text-slate-500 text-[13px] mb-[29px]">
                {"Up to 100 students"}
              </span>
              <div className="flex flex-col self-stretch pb-[18px] mb-6 gap-3.5">
                <div className="flex items-center self-stretch py-[1px] gap-3">
                  <img
                    src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/BywfetPpbr/gpwlobgx_expires_30_days.png"}
                    className="w-5 h-5 object-fill"
                    alt="check"
                  />
                  <div className="flex flex-col shrink-0 items-start py-[3px]">
                    <span className="text-[#111b2f] text-sm">
                      {"5 published courses"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center self-stretch py-[1px] gap-3">
                  <img
                    src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/BywfetPpbr/ss5djwbn_expires_30_days.png"}
                    className="w-5 h-5 object-fill"
                    alt="check"
                  />
                  <div className="flex flex-col shrink-0 items-start py-[3px]">
                    <span className="text-[#111b2f] text-sm">
                      {"Video, quiz, and file lessons"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center self-stretch py-[1px] gap-3">
                  <img
                    src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/BywfetPpbr/blr70v7d_expires_30_days.png"}
                    className="w-5 h-5 object-fill"
                    alt="check"
                  />
                  <div className="flex flex-col shrink-0 items-start py-[3px] px-[1px]">
                    <span className="text-[#111b2f] text-sm">
                      {"Basic coupons and checkout"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center self-stretch py-[1px] gap-3">
                  <img
                    src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/BywfetPpbr/dewhpy6x_expires_30_days.png"}
                    className="w-5 h-5 object-fill"
                    alt="check"
                  />
                  <div className="flex flex-col shrink-0 items-start py-[3px] px-[1px]">
                    <span className="text-[#111b2f] text-sm">
                      {"Email support"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center self-stretch py-[1px] gap-3">
                  <img
                    src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/BywfetPpbr/40japh7b_expires_30_days.png"}
                    className="w-5 h-5 object-fill"
                    alt="check"
                  />
                  <div className="flex flex-col shrink-0 items-start py-[5px]">
                    <span className="text-[#111b2f] text-sm">
                      {"Custom domain"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center self-stretch py-[1px] gap-3">
                  <img
                    src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/BywfetPpbr/cas72wdr_expires_30_days.png"}
                    className="w-5 h-5 object-fill"
                    alt="check"
                  />
                  <div className="flex flex-col shrink-0 items-start py-[3px]">
                    <span className="text-[#111b2f] text-sm">
                      {"Advanced analytics"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col self-stretch gap-3.5">
                <input
                  placeholder={"Best for solo educators validating their course idea."}
                  value={input1}
                  onChange={(event) => onChangeInput1(event.target.value)}
                  className="self-stretch text-slate-600 bg-[#F3F6F9] text-[13px] py-[18px] px-3.5 rounded-md border-0 focus:outline-none focus:ring-2 focus:ring-[#0b8276]"
                />
                <button className="flex flex-col items-center self-stretch bg-transparent text-left py-[18px] rounded-md border border-solid border-[#00000012] hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => alert("Pressed!")}>
                  <span className="text-[#111b2f] text-sm font-bold">
                    {"Choose Basic"}
                  </span>
                </button>
              </div>
            </div>

            {/* Pro Plan - Highlighted matching Features.jsx highlighted style */}
            <div className="flex-1 relative">
              <div className="flex flex-col items-start self-stretch bg-[#141B2D] py-[31px] px-6 rounded-lg shadow-xl"
                style={{
                  boxShadow: "0px 28px 64px rgba(0,0,0,0.2)"
                }}>
                <div className="flex flex-col self-stretch mb-6 gap-2.5">
                  <div className="flex flex-col items-start self-stretch pb-[1px]">
                    <span className="text-white text-2xl font-bold">
                      {"Pro"}
                    </span>
                  </div>
                  <div className="flex flex-col items-start self-stretch pb-[1px]">
                    <span className="text-white/80 text-sm">
                      {"For growing learning brands that want automation, scale, and premium control."}
                    </span>
                  </div>
                </div>
                <div className="flex items-start self-stretch mb-[17px] gap-2">
                  <div className="flex flex-col shrink-0 items-start py-0.5 px-[1px]">
                    <span className="text-white text-[56px] font-bold">
                      {"$79"}
                    </span>
                  </div>
                  <div className="flex flex-col shrink-0 items-start py-2 mt-[25px]">
                    <span className="text-white/60 text-[15px]">
                      {"/mo"}
                    </span>
                  </div>
                </div>
                <span className="text-white/80 text-[13px] mb-8">
                  {"Unlimited students and courses"}
                </span>
                <div className="flex flex-col self-stretch mb-6 gap-3.5">
                  <div className="flex items-center self-stretch py-[1px] gap-3">
                    <img
                      src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/BywfetPpbr/2une7vr2_expires_30_days.png"}
                      className="w-5 h-5 object-fill"
                      alt="check"
                    />
                    <div className="flex flex-col shrink-0 items-start py-[3px] px-[1px]">
                      <span className="text-white text-sm">
                        {"Unlimited published courses"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center self-stretch py-[1px] gap-3">
                    <img
                      src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/BywfetPpbr/uvh9xu2n_expires_30_days.png"}
                      className="w-5 h-5 object-fill"
                      alt="check"
                    />
                    <div className="flex flex-col shrink-0 items-start py-[5px]">
                      <span className="text-white text-sm">
                        {"Custom domain and branded site"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center self-stretch gap-[13px]">
                    <img
                      src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/BywfetPpbr/3avotvwn_expires_30_days.png"}
                      className="w-[19px] h-5 object-fill"
                      alt="check"
                    />
                    <div className="flex flex-1 flex-col items-start py-[5px]">
                      <span className="text-white text-sm">
                        {"Automation, certificates, and drip content"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center self-stretch py-[1px] gap-3">
                    <img
                      src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/BywfetPpbr/44whzh12_expires_30_days.png"}
                      className="w-5 h-5 object-fill"
                      alt="check"
                    />
                    <div className="flex flex-col shrink-0 items-start py-[3px] px-[1px]">
                      <span className="text-white text-sm">
                        {"Priority support and team seats"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center self-stretch py-[1px] gap-3">
                    <img
                      src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/BywfetPpbr/ep8p2utz_expires_30_days.png"}
                      className="w-5 h-5 object-fill"
                      alt="check"
                    />
                    <div className="flex flex-col shrink-0 items-start py-[3px]">
                      <span className="text-white text-sm">
                        {"Advanced analytics and reports"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center self-stretch py-[1px] gap-3">
                    <img
                      src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/BywfetPpbr/7xnnrlu4_expires_30_days.png"}
                      className="w-5 h-5 object-fill"
                      alt="check"
                    />
                    <div className="flex flex-col shrink-0 items-start py-[3px]">
                      <span className="text-white text-sm">
                        {"API and integrations"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col self-stretch gap-3.5">
                  <input
                    placeholder={"Ideal for serious course sellers and modern academies."}
                    value={input2}
                    onChange={(event) => onChangeInput2(event.target.value)}
                    className="self-stretch text-white bg-white/10 text-[13px] py-[18px] px-3.5 rounded-md border-0 focus:outline-none focus:ring-2 focus:ring-[#FF8A33] placeholder:text-white/50"
                  />
                  <button className="flex flex-col items-center self-stretch bg-[#FF8A33] text-left py-[18px] rounded-md border-0 hover:bg-[#e07a2e] transition-colors cursor-pointer"
                    onClick={() => alert("Pressed!")}>
                    <span className="text-white text-sm font-bold">
                      {"Choose Pro"}
                    </span>
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-center self-stretch absolute top-[-14px] right-0 left-0">
                <button className="flex flex-col items-start bg-[#FF8A33] text-left py-2 px-[11px] rounded-xl border-0 cursor-pointer hover:bg-[#e07a2e] transition-colors"
                  onClick={() => alert("Pressed!")}>
                  <span className="text-white text-xs font-bold">
                    {"Most Popular"}
                  </span>
                </button>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="flex flex-1 flex-col items-start bg-white py-[31px] px-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex flex-col self-stretch mb-6 gap-2.5">
                <div className="flex flex-col items-start self-stretch pb-[1px]">
                  <span className="text-[#111b2f] text-2xl font-bold">
                    {"Enterprise"}
                  </span>
                </div>
                <div className="flex flex-col items-start self-stretch pb-[1px]">
                  <span className="text-slate-500 text-sm">
                    {"For institutions, franchises, and multi-brand education businesses with custom needs."}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-start self-stretch pb-[1px] mb-[17px]">
                <span className="text-[#111b2f] text-[46px] font-bold">
                  {"Custom"}
                </span>
              </div>
              <span className="text-slate-500 text-[13px] mb-[29px]">
                {"Tailored onboarding and architecture"}
              </span>
              <div className="flex flex-col self-stretch pb-7 mb-6 gap-3.5">
                <div className="flex items-center self-stretch py-[1px] gap-3">
                  <img
                    src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/BywfetPpbr/rciozmjo_expires_30_days.png"}
                    className="w-5 h-5 object-fill"
                    alt="check"
                  />
                  <div className="flex flex-col shrink-0 items-start py-[3px] px-[1px]">
                    <span className="text-[#111b2f] text-sm">
                      {"Multi-tenant LMS setup"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center self-stretch py-[1px] gap-3">
                  <img
                    src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/BywfetPpbr/bx5mjimu_expires_30_days.png"}
                    className="w-5 h-5 object-fill"
                    alt="check"
                  />
                  <div className="flex flex-col shrink-0 items-start py-[3px] px-[1px]">
                    <span className="text-[#111b2f] text-sm">
                      {"Dedicated success manager"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center self-stretch py-[1px] gap-3">
                  <img
                    src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/BywfetPpbr/gb6jil35_expires_30_days.png"}
                    className="w-5 h-5 object-fill"
                    alt="check"
                  />
                  <div className="flex flex-col shrink-0 items-start py-[3px]">
                    <span className="text-[#111b2f] text-sm">
                      {"Advanced SSO and permissions"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center self-stretch py-[1px] gap-3">
                  <img
                    src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/BywfetPpbr/tc648xi2_expires_30_days.png"}
                    className="w-5 h-5 object-fill"
                    alt="check"
                  />
                  <div className="flex flex-col shrink-0 items-start py-[3px]">
                    <span className="text-[#111b2f] text-sm">
                      {"Migration and implementation help"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center self-stretch py-[1px] gap-3">
                  <img
                    src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/BywfetPpbr/1w818b29_expires_30_days.png"}
                    className="w-5 h-5 object-fill"
                    alt="check"
                  />
                  <div className="flex flex-col shrink-0 items-start py-[3px]">
                    <span className="text-[#111b2f] text-sm">
                      {"Custom SLAs and security review"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center self-stretch py-[1px] gap-3">
                  <img
                    src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/BywfetPpbr/sig2tpg6_expires_30_days.png"}
                    className="w-5 h-5 object-fill"
                    alt="check"
                  />
                  <div className="flex flex-col shrink-0 items-start py-[3px] px-[1px]">
                    <span className="text-[#111b2f] text-sm">
                      {"Private infrastructure options"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col self-stretch gap-3.5">
                <div className="flex flex-col items-start self-stretch bg-[#F3F6F9] py-[18px] pl-3.5 rounded-md">
                  <span className="text-slate-600 text-[13px]">
                    {"Built for larger rollouts, partner networks, and custom workflows."}
                  </span>
                </div>
                <button className="flex flex-col items-center self-stretch bg-transparent text-left py-[18px] rounded-md border border-solid border-[#00000012] hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => alert("Pressed!")}>
                  <span className="text-[#111b2f] text-sm font-bold">
                    {"Contact Sales"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Compare Plans Table - Matching Features.jsx style */}
        <div className="self-stretch py-[88px] px-4 sm:px-8">
          <div className="flex flex-col items-center self-stretch bg-white max-w-[1152px] mx-auto pt-10 rounded-lg shadow-md"
            style={{
              boxShadow: "0px 18px 40px rgba(0,0,0,0.05)"
            }}>
            <div className="flex flex-col items-center mb-[33px] text-center">
              <button className="flex flex-col items-start bg-[#FF8A331C] text-left py-[9px] px-3.5 mb-4 rounded-xl border-0 cursor-pointer hover:bg-[#FF8A3330] transition-colors"
                onClick={() => alert("Pressed!")}>
                <span className="text-[#FF8A33] text-[13px] font-bold">
                  {"Compare plans"}
                </span>
              </button>
              <span className="text-[#111b2f] text-3xl sm:text-[38px] font-bold mb-3 text-center">
                {"Everything you need, clearly compared"}
              </span>
              <div className="flex flex-col items-start py-[3px] px-2">
                <span className="text-slate-500 text-base text-center max-w-[623px]">
                  {"A simple side-by-side look at the LMS capabilities that matter most when choosing your plan."}
                </span>
              </div>
            </div>

            {/* Table Header */}
            <div className="flex items-center self-stretch mb-[37px] mx-4 sm:mx-10">
              <div className="flex flex-1 flex-col items-start py-[5px] pl-[1px] mr-[13px]">
                <span className="text-[#111b2f] text-sm font-bold">
                  {"Features"}
                </span>
              </div>
              <div className="flex flex-col shrink-0 items-start pt-[5px] pb-1.5 px-8 sm:px-[95px] mr-3">
                <span className="text-[#111b2f] text-[15px] font-bold">
                  {"Basic"}
                </span>
              </div>
              <div className="flex flex-col shrink-0 items-start pt-[5px] pb-1.5 px-8 sm:px-[103px] mr-3">
                <span className="text-[#111b2f] text-[15px] font-bold">
                  {"Pro"}
                </span>
              </div>
              <div className="flex flex-col shrink-0 items-start pt-1 pb-[5px] px-8 sm:px-[77px]">
                <span className="text-[#111b2f] text-[15px] font-bold">
                  {"Enterprise"}
                </span>
              </div>
            </div>

            {/* Table Rows */}
            <div className="flex items-center self-stretch mb-[37px] mx-4 sm:mx-10">
              <div className="flex flex-1 flex-col items-start py-[3px] mr-[13px]">
                <span className="text-[#111b2f] text-sm font-bold">
                  {"Student capacity"}
                </span>
              </div>
              <div className="flex flex-col shrink-0 items-start py-1.5 px-8 sm:px-[103px] mr-3">
                <span className="text-slate-500 text-sm">
                  {"100"}
                </span>
              </div>
              <div className="flex flex-col shrink-0 items-start py-1.5 px-8 sm:px-[84px] mr-3">
                <span className="text-slate-500 text-sm">
                  {"Unlimited"}
                </span>
              </div>
              <div className="flex flex-col shrink-0 items-start py-1.5 px-8 sm:px-[84px]">
                <span className="text-slate-500 text-sm">
                  {"Unlimited"}
                </span>
              </div>
            </div>

            <div className="flex items-center self-stretch mb-9 mx-4 sm:mx-10">
              <div className="flex flex-1 flex-col items-start py-[5px] pl-[1px] mr-[13px]">
                <span className="text-[#111b2f] text-sm font-bold">
                  {"Published courses"}
                </span>
              </div>
              <div className="flex flex-col shrink-0 items-start py-1.5 px-8 sm:px-[111px] mr-3">
                <span className="text-slate-500 text-sm">
                  {"5"}
                </span>
              </div>
              <div className="flex flex-col shrink-0 items-start py-1.5 px-8 sm:px-[84px] mr-3">
                <span className="text-slate-500 text-sm">
                  {"Unlimited"}
                </span>
              </div>
              <div className="flex flex-col shrink-0 items-start py-1.5 px-8 sm:px-[84px]">
                <span className="text-slate-500 text-sm">
                  {"Unlimited"}
                </span>
              </div>
            </div>

            <div className="flex items-center self-stretch mb-9 mx-4 sm:mx-10 gap-3">
              <div className="flex flex-1 flex-col items-start py-[5px]">
                <span className="text-[#111b2f] text-sm font-bold">
                  {"Custom domain"}
                </span>
              </div>
              <img
                src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/BywfetPpbr/ttt7zy82_expires_30_days.png"}
                className="w-[100px] sm:w-[230px] h-6 object-contain"
                alt="check"
              />
              <img
                src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/BywfetPpbr/wcp1vi84_expires_30_days.png"}
                className="w-[100px] sm:w-[230px] h-6 object-contain"
                alt="check"
              />
              <img
                src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/BywfetPpbr/4qslfmeg_expires_30_days.png"}
                className="w-[100px] sm:w-[230px] h-6 object-contain"
                alt="check"
              />
            </div>

            <div className="flex items-center self-stretch mb-9 mx-4 sm:mx-10 gap-3">
              <div className="flex flex-1 flex-col items-start py-[3px]">
                <span className="text-[#111b2f] text-sm font-bold">
                  {"Advanced analytics"}
                </span>
              </div>
              <img
                src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/BywfetPpbr/jram7mev_expires_30_days.png"}
                className="w-[100px] sm:w-[230px] h-6 object-contain"
                alt="check"
              />
              <img
                src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/BywfetPpbr/ls8fih8a_expires_30_days.png"}
                className="w-[100px] sm:w-[230px] h-6 object-contain"
                alt="check"
              />
              <img
                src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/BywfetPpbr/7rpj7m2u_expires_30_days.png"}
                className="w-[100px] sm:w-[230px] h-6 object-contain"
                alt="check"
              />
            </div>

            <div className="flex items-center self-stretch mb-[37px] mx-4 sm:mx-10">
              <div className="flex flex-1 flex-col items-start py-[3px] pl-[1px] mr-3">
                <span className="text-[#111b2f] text-sm font-bold">
                  {"Multi-tenant setup"}
                </span>
              </div>
              <img
                src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/BywfetPpbr/wwkc0c92_expires_30_days.png"}
                className="w-[100px] sm:w-[230px] h-6 mr-3 object-contain"
                alt="cross"
              />
              <div className="flex flex-col shrink-0 items-start py-[5px] px-8 sm:px-[87px] mr-[11px]">
                <span className="text-slate-500 text-sm">
                  {"Optional"}
                </span>
              </div>
              <img
                src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/BywfetPpbr/1xtslfas_expires_30_days.png"}
                className="w-[100px] sm:w-[230px] h-6 object-contain"
                alt="check"
              />
            </div>

            <div className="flex items-center self-stretch mb-[57px] mx-4 sm:mx-10">
              <div className="flex flex-1 flex-col items-start py-[3px] pl-[1px] mr-[13px]">
                <span className="text-[#111b2f] text-sm font-bold">
                  {"Dedicated support"}
                </span>
              </div>
              <div className="flex flex-col shrink-0 items-start py-1.5 px-8 sm:px-[98px] mr-3">
                <span className="text-slate-500 text-sm">
                  {"Email"}
                </span>
              </div>
              <div className="flex flex-col shrink-0 items-start py-[5px] px-8 sm:px-[92px] mr-3">
                <span className="text-slate-500 text-sm">
                  {"Priority"}
                </span>
              </div>
              <div className="flex flex-col shrink-0 items-start py-[5px] px-8 sm:px-14">
                <span className="text-slate-500 text-sm">
                  {"Success manager"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section - Matching Features.jsx "How teams use it" style but reversed */}
        <div className="flex flex-col self-stretch py-[78px] px-4 sm:px-8 gap-4 max-w-[1152px] mx-auto">
          <div className="flex flex-col lg:flex-row items-start self-stretch gap-8">
            <div className="flex flex-1 flex-col items-start gap-[18px]">
              <button className="flex flex-col items-start bg-[#7C4DFF1C] text-left py-2.5 px-3.5 rounded-xl border-0 cursor-pointer hover:bg-[#7C4DFF30] transition-colors"
                onClick={() => alert("Pressed!")}>
                <span className="text-[#7C4DFF] text-[13px] font-bold">
                  {"FAQ"}
                </span>
              </button>
              <div className="flex flex-col items-start pt-[7px] pl-[1px] pr-[92px]">
                <span className="text-[#111b2f] text-3xl sm:text-[40px] font-bold max-w-[326px]">
                  {"Frequently asked questions about billing"}
                </span>
              </div>
              <div className="flex flex-col items-start py-1 pl-[1px] pr-[22px]">
                <span className="text-slate-500 text-base max-w-[396px]">
                  {"Everything your team usually asks before choosing a plan or booking a demo."}
                </span>
              </div>
              <button className="flex flex-col items-start bg-transparent text-left py-[18px] px-[23px] rounded-md border border-solid border-[#00000012] hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => alert("Pressed!")}>
                <span className="text-[#111b2f] text-sm font-bold">
                  {"Talk to sales"}
                </span>
              </button>
            </div>

            <div className="flex flex-1 flex-col gap-4">
              <div className="flex flex-col self-stretch bg-white py-[23px] px-6 gap-[9px] rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col items-start self-stretch pb-[1px]">
                  <span className="text-[#111b2f] text-[17px] font-bold">
                    {"Can I start with a free trial before paying?"}
                  </span>
                </div>
                <div className="flex flex-col items-start self-stretch pb-[1px]">
                  <span className="text-slate-500 text-sm">
                    {"Yes. Every new account gets a 14-day free trial so you can explore course creation, checkout, and student management before subscribing."}
                  </span>
                </div>
              </div>
              <div className="flex flex-col self-stretch bg-white py-[23px] px-6 gap-[9px] rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col items-start self-stretch pb-[1px]">
                  <span className="text-[#111b2f] text-[17px] font-bold">
                    {"Do you charge transaction fees on course sales?"}
                  </span>
                </div>
                <div className="flex flex-col items-start self-stretch pb-[1px]">
                  <span className="text-slate-500 text-sm">
                    {"No platform transaction fee is charged on paid plans. Standard payment gateway fees from Stripe or Razorpay still apply."}
                  </span>
                </div>
              </div>
              <div className="flex flex-col self-stretch bg-white py-[23px] px-6 gap-[9px] rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col items-start self-stretch pb-[1px]">
                  <span className="text-[#111b2f] text-[17px] font-bold">
                    {"What happens when I outgrow the Basic plan?"}
                  </span>
                </div>
                <div className="flex flex-col self-stretch pb-[1px]">
                  <span className="text-slate-500 text-sm">
                    {"You can upgrade at any time and keep your content, students, and storefront settings without needing to migrate."}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end self-stretch">
            <div className="flex flex-col items-start bg-white py-[23px] px-6 gap-[9px] rounded-lg shadow-sm hover:shadow-md transition-shadow w-full lg:w-auto lg:mr-36">
              <div className="flex flex-col items-start pb-[1px]">
                <span className="text-[#111b2f] text-[17px] font-bold">
                  {"Is Enterprise required for multi-tenant LMS use cases?"}
                </span>
              </div>
              <div className="flex flex-col items-start pb-[1px]">
                <span className="text-slate-500 text-sm">
                  {"Enterprise is the best fit for complex multi-brand or franchise setups, but some Pro customers can enable lighter multi-tenant workflows as an add-on."}
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
              <div className="flex flex-col items-start py-[3px]">
                <span className="text-white text-2xl sm:text-[32px] font-bold max-w-[637px]">
                  {"Need a custom rollout for your academy, franchise, or institution?"}
                </span>
              </div>
              <div className="flex flex-col items-start py-1">
                <span className="text-white/90 text-[15px] max-w-[603px]">
                  {"Get a tailored walkthrough, pricing guidance, and implementation plan from our team. We'll help you choose the right setup from day one."}
                </span>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-4 flex-wrap justify-center">
              <button className="flex flex-col shrink-0 items-start bg-[#FF8A33] text-left py-[18px] px-[22px] rounded-md border-0 hover:bg-[#e07a2e] transition-colors cursor-pointer"
                onClick={() => alert("Pressed!")}>
                <span className="text-white text-sm font-bold">
                  {"Book Demo"}
                </span>
              </button>
              <button className="flex flex-col shrink-0 items-start bg-white/10 text-left py-[18px] px-[23px] rounded-md border border-solid border-white/30 hover:bg-white/20 transition-colors cursor-pointer"
                onClick={() => alert("Pressed!")}>
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