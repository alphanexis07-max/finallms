import React from "react";

export default (props) => {
  return (
    <div className="flex flex-col bg-white">
      <div className="self-stretch bg-[#F7FCFF]">
        {/* Hero Section with gradient - Updated colors to match Home.jsx vibe */}
        <div className="self-stretch pt-[60px] pb-[78px] px-4 sm:px-8 md:px-16 lg:px-36 mb-[97px]"
          style={{
            background: "linear-gradient(135deg, #0e7c67 0%, #1a5c3a 100%)"
          }}>
          <div className="flex flex-col lg:flex-row items-center self-stretch mb-[31px] gap-8 lg:gap-12">
            <div className="flex flex-1 flex-col items-start">
              <button className="flex items-center bg-white/10 text-left py-2 px-3.5 mb-[19px] gap-2 rounded-xl border-0 hover:bg-white/20 transition-colors"
                onClick={() => alert("Pressed!")}>
                <img
                  src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/8zwnlefu_expires_30_days.png"}
                  className="w-3.5 h-3.5 rounded-xl object-fill"
                  alt="feature"
                />
                <span className="text-white text-[13px] font-bold">
                  {"Feature detail"}
                </span>
              </button>
              <div className="flex flex-col items-start self-stretch pb-[1px] mb-5">
                <span className="text-white text-4xl sm:text-5xl lg:text-[64px] font-bold max-w-full lg:w-[407px] leading-tight">
                  {"One powerful\nMulti-Tenant LMS"}
                </span>
              </div>
              <div className="flex flex-col self-stretch pt-0.5 mb-[21px]">
                <span className="text-white/90 text-base sm:text-lg leading-relaxed">
                  {"This inner page focuses on a single feature from your landing page. Show schools, coaching brands, and training partners how one platform can power multiple academies with separate branding, users, catalogs, and reporting."}
                </span>
              </div>
              <div className="flex items-start self-stretch pt-4 mb-5 gap-[17px] flex-wrap">
                <button className="flex flex-col shrink-0 items-start bg-[#FF8A33] text-left py-[17px] px-[22px] rounded-md border-0 hover:bg-[#e07a2e] transition-colors cursor-pointer"
                  onClick={() => alert("Pressed!")}>
                  <span className="text-white text-sm font-bold">
                    {"Book a Demo"}
                  </span>
                </button>
                <button className="flex flex-col shrink-0 items-start bg-transparent text-left py-[13px] px-[19px] rounded-md border border-solid border-white/30 hover:bg-white/10 transition-colors cursor-pointer"
                  onClick={() => alert("Pressed!")}>
                  <span className="text-white text-sm font-bold">
                    {"Explore Details"}
                  </span>
                </button>
              </div>
              <div className="flex items-center self-stretch py-1 gap-[13px] flex-wrap">
                <button className="flex shrink-0 items-center bg-white/10 text-left py-[9px] px-3.5 gap-2 rounded-xl border-0 hover:bg-white/20 transition-colors cursor-pointer"
                  onClick={() => alert("Pressed!")}>
                  <img
                    src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/g1uw29ew_expires_30_days.png"}
                    className="w-4 h-4 rounded-xl object-fill"
                    alt="icon"
                  />
                  <span className="text-white text-[13px] font-bold">
                    {"Separate portals"}
                  </span>
                </button>
                <button className="flex shrink-0 items-center bg-white/10 text-left py-[9px] px-[13px] gap-2 rounded-xl border-0 hover:bg-white/20 transition-colors cursor-pointer"
                  onClick={() => alert("Pressed!")}>
                  <img
                    src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/lgp457vn_expires_30_days.png"}
                    className="w-4 h-4 rounded-xl object-fill"
                    alt="icon"
                  />
                  <span className="text-white text-[13px] font-bold">
                    {"Central control"}
                  </span>
                </button>
                <button className="flex shrink-0 items-center bg-white/10 text-left py-[9px] px-[13px] gap-2 rounded-xl border-0 hover:bg-white/20 transition-colors cursor-pointer"
                  onClick={() => alert("Pressed!")}>
                  <img
                    src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/6t4b11te_expires_30_days.png"}
                    className="w-4 h-4 rounded-xl object-fill"
                    alt="icon"
                  />
                  <span className="text-white text-[13px] font-bold">
                    {"Branch analytics"}
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
                      {"Tenant Management"}
                    </span>
                  </div>
                  <button className="flex flex-col shrink-0 items-start bg-[#5B3CFF1A] text-left py-2.5 px-3 rounded-xl border-0 cursor-pointer hover:bg-[#5B3CFF30] transition-colors"
                    onClick={() => alert("Pressed!")}>
                    <span className="text-[#5B3CFF] text-xs font-bold">
                      {"Live overview"}
                    </span>
                  </button>
                </div>
                <div className="flex flex-col self-stretch gap-[17px]">
                  <div className="flex flex-col sm:flex-row justify-center items-stretch self-stretch gap-[17px]">
                    <div className="flex flex-col flex-1 items-start bg-[#EEF2F6] p-[17px] gap-3 rounded-md">
                      <div className="flex items-center">
                        <img
                          src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/e2g2jlcu_expires_30_days.png"}
                          className="w-9 h-9 mr-3 object-fill"
                          alt="icon"
                        />
                        <div className="flex flex-col shrink-0 items-start py-[1px]">
                          <span className="text-[#111b2f] text-sm font-bold">
                            {"North Campus"}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-start pb-[1px]">
                        <span className="text-slate-500 text-[13px]">
                          {"Custom branding, local admins, 1,240 active learners."}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col flex-1 items-start bg-[#EEF2F6] p-[17px] gap-3 rounded-md">
                      <div className="flex items-center">
                        <img
                          src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/a2xtznvc_expires_30_days.png"}
                          className="w-9 h-9 mr-3 object-fill"
                          alt="icon"
                        />
                        <div className="flex flex-col shrink-0 items-start py-[3px]">
                          <span className="text-[#111b2f] text-sm font-bold">
                            {"Brand Control"}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-start pb-[1px]">
                        <span className="text-slate-500 text-[13px]">
                          {"Set logos, domains, colors, and catalogs independently."}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-center items-stretch self-stretch gap-[17px]">
                    <div className="flex flex-col flex-1 items-start bg-[#EEF2F6] p-[17px] gap-3 rounded-md">
                      <div className="flex items-center">
                        <img
                          src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/m0e6j7so_expires_30_days.png"}
                          className="w-9 h-9 mr-3 object-fill"
                          alt="icon"
                        />
                        <div className="flex flex-col shrink-0 items-start py-[3px]">
                          <span className="text-[#111b2f] text-sm font-bold">
                            {"Shared Users"}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-start pb-[1px]">
                        <span className="text-slate-500 text-[13px]">
                          {"Control permissions for super admins, instructors, and managers."}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col flex-1 items-start bg-[#EEF2F6] p-[17px] gap-3 rounded-md">
                      <div className="flex items-center">
                        <img
                          src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/flp1mje2_expires_30_days.png"}
                          className="w-9 h-9 mr-3 object-fill"
                          alt="icon"
                        />
                        <div className="flex flex-col shrink-0 items-start py-[1px]">
                          <span className="text-[#111b2f] text-sm font-bold">
                            {"Unified Reports"}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-start pb-[1px]">
                        <span className="text-slate-500 text-[13px]">
                          {"View branch-level performance while keeping data neatly organized."}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why this feature matters - Updated colors */}
        <div className="flex flex-col items-center self-stretch max-w-[1200px] pb-[1px] mb-24 mx-auto px-4 sm:px-6 gap-14">
          <div className="flex flex-col items-center pb-[69px] px-[11px] text-center">
            <button className="flex flex-col items-start bg-[#EEF2F6] text-left py-[9px] px-[13px] mb-[31px] rounded-xl border-0 cursor-pointer hover:bg-[#e2e8f0] transition-colors"
              onClick={() => alert("Pressed!")}>
              <span className="text-slate-500 text-[13px] font-bold">
                {"Why this feature matters"}
              </span>
            </button>
            <span className="text-[#111b2f] text-3xl sm:text-4xl lg:text-[44px] font-bold mb-[38px] text-center">
              {"Run multiple learning brands"}
            </span>
            <div className="flex flex-col items-start pb-[1px]">
              <span className="text-slate-500 text-base text-center max-w-[695px]">
                {"Designed for institutes with branches, franchise models, partner academies, and enterprise education teams that need separation for each unit but one place to manage everything."}
              </span>
            </div>
          </div>

          {/* Stats and Features Section - Updated colors */}
          <div className="flex flex-col lg:flex-row items-stretch self-stretch gap-8">
            <div className="flex flex-1 flex-col bg-white pt-[63px] pb-[223px] px-6 sm:px-9 gap-[18px] rounded-lg shadow-md">
              <div className="flex items-start self-stretch gap-3.5">
                <img
                  src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/6idsmysi_expires_30_days.png"}
                  className="w-10 h-10 object-fill"
                  alt="icon"
                />
                <div className="flex flex-1 flex-col gap-1.5">
                  <div className="flex flex-col items-start self-stretch py-0.5">
                    <span className="text-[#111b2f] text-base font-bold">
                      {"Central dashboard with local autonomy"}
                    </span>
                  </div>
                  <div className="flex flex-col self-stretch py-1">
                    <span className="text-slate-500 text-sm leading-relaxed">
                      {"Head office can monitor every branch from one place, while each tenant still gets its own portal, instructors, learners, and course catalog."}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-start self-stretch gap-3.5">
                <img
                  src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/21ycopqh_expires_30_days.png"}
                  className="w-10 h-10 object-fill"
                  alt="icon"
                />
                <div className="flex flex-1 flex-col gap-[5px]">
                  <div className="flex flex-col items-start self-stretch py-0.5">
                    <span className="text-[#111b2f] text-base font-bold">
                      {"Separate domains and branded experiences"}
                    </span>
                  </div>
                  <div className="flex flex-col self-stretch py-[5px]">
                    <span className="text-slate-500 text-sm leading-relaxed">
                      {"Give every academy its own public website feel while still using the same backend system, curriculum engine, and reporting layer."}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-start self-stretch gap-3.5">
                <img
                  src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/853fi7bs_expires_30_days.png"}
                  className="w-10 h-10 object-fill"
                  alt="icon"
                />
                <div className="flex flex-1 flex-col pb-[1px] gap-[5px]">
                  <div className="flex flex-col items-start self-stretch py-0.5">
                    <span className="text-[#111b2f] text-base font-bold">
                      {"Clean permissions and data boundaries"}
                    </span>
                  </div>
                  <div className="flex flex-col self-stretch py-1">
                    <span className="text-slate-500 text-sm leading-relaxed">
                      {"Keep branch admins focused on their own learners and content while platform owners retain secure visibility and full platform governance."}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col shrink-0 items-stretch gap-[17px] w-full lg:w-auto">
              <div className="flex flex-col items-start bg-white py-[31px] pl-7 pr-7 lg:pr-[45px] rounded-lg shadow-md">
                <div className="flex flex-col items-start pb-[1px] mb-4">
                  <span className="text-slate-500 text-[13px] font-bold">
                    {"Tenants launched"}
                  </span>
                </div>
                <div className="flex flex-col items-start pb-[1px] mb-[19px]">
                  <span className="text-[#111b2f] text-[34px] font-bold">
                    {"24"}
                  </span>
                </div>
                <div className="flex flex-col items-start pb-[1px]">
                  <span className="text-slate-500 text-sm max-w-[373px]">
                    {"Spin up branded portals for franchise partners, districts, or regional teams in minutes."}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-start bg-white py-[30px] pl-7 pr-7 lg:pr-[78px] rounded-lg shadow-md">
                <div className="flex flex-col items-start pb-[1px] mb-4">
                  <span className="text-slate-500 text-[13px] font-bold">
                    {"Admin time saved"}
                  </span>
                </div>
                <div className="flex flex-col items-start pb-[1px] mb-[19px]">
                  <span className="text-[#111b2f] text-[34px] font-bold">
                    {"61%"}
                  </span>
                </div>
                <div className="flex flex-col items-start pb-[1px]">
                  <span className="text-slate-500 text-sm max-w-[339px]">
                    {"Reusable settings and centralized oversight reduce repetitive setup and reporting work."}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-start bg-white py-[30px] pl-7 pr-7 lg:pr-[103px] rounded-lg shadow-md">
                <div className="flex flex-col items-start pb-[1px] mb-3.5">
                  <span className="text-slate-500 text-[13px] font-bold">
                    {"Reporting view"}
                  </span>
                </div>
                <div className="flex flex-col items-start pb-[1px] mb-[19px]">
                  <span className="text-[#111b2f] text-[34px] font-bold">
                    {"1 dashboard"}
                  </span>
                </div>
                <div className="flex flex-col items-start pb-[1px]">
                  <span className="text-slate-500 text-sm max-w-[315px]">
                    {"Compare branches, track enrollments, and spot performance trends at a glance."}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Six modules section - Updated colors to match Home.jsx */}
        <div className="flex flex-col items-center self-stretch bg-[#f7efeb] py-16 sm:py-24 px-4 sm:px-8 md:px-16 lg:px-[120px] gap-14">
          <div className="flex flex-col items-center pb-1.5 px-[18px] text-center">
            <button className="flex flex-col items-start bg-white text-left py-[9px] px-[13px] mb-5 rounded-xl border-0 cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
              onClick={() => alert("Pressed!")}>
              <span className="text-[#0b8276] text-[13px] font-bold">
                {"What you get"}
              </span>
            </button>
            <div className="flex flex-col items-center pb-[1px] mb-[21px]">
              <span className="text-[#111b2f] text-3xl sm:text-4xl lg:text-[44px] font-bold text-center max-w-[602px]">
                {"Six modules that make multi-tenant management simple."}
              </span>
            </div>
            <div className="flex flex-col items-center pb-[1px]">
              <span className="text-slate-500 text-base text-center max-w-[681px]">
                {"This single feature page stays marketing-focused, but goes deeper than the landing page with clear breakdowns of what the feature actually includes."}
              </span>
            </div>
          </div>

          <div className="flex flex-col self-stretch gap-6">
            <div className="flex flex-col lg:flex-row items-stretch self-stretch gap-6">
              <div className="flex flex-1 flex-col items-start bg-white py-[30px] px-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <img
                  src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/e9kdbzj9_expires_30_days.png"}
                  className="w-[52px] h-[52px] mb-[23px] rounded-lg object-fill"
                  alt="icon"
                />
                <div className="flex flex-col items-start pb-[1px] mb-[18px]">
                  <span className="text-[#111b2f] text-lg font-bold">
                    {"Branch creation"}
                  </span>
                </div>
                <div className="flex flex-col self-stretch pb-[1px]">
                  <span className="text-slate-500 text-sm leading-relaxed">
                    {"Launch a new tenant with its own name, branding, language preferences, admin team, and catalog structure."}
                  </span>
                </div>
              </div>
              <div className="flex flex-1 flex-col items-start bg-white py-[30px] px-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <img
                  src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/niczo0hi_expires_30_days.png"}
                  className="w-[52px] h-[52px] mb-[23px] rounded-lg object-fill"
                  alt="icon"
                />
                <div className="flex flex-col items-start pb-[1px] mb-[15px]">
                  <span className="text-[#111b2f] text-lg font-bold">
                    {"White-label branding"}
                  </span>
                </div>
                <div className="flex flex-col self-stretch pb-[1px]">
                  <span className="text-slate-500 text-sm leading-relaxed">
                    {"Customize logos, theme accents, page banners, and custom domains for every tenant experience."}
                  </span>
                </div>
              </div>
              <div className="flex flex-1 flex-col items-start bg-white py-[31px] px-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <img
                  src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/ng2zhlmr_expires_30_days.png"}
                  className="w-[52px] h-[52px] mb-[23px] rounded-lg object-fill"
                  alt="icon"
                />
                <div className="flex flex-col items-start pb-[1px] mb-[18px]">
                  <span className="text-[#111b2f] text-lg font-bold">
                    {"Role-based access"}
                  </span>
                </div>
                <div className="flex flex-col items-start pb-[1px]">
                  <span className="text-slate-500 text-sm leading-relaxed">
                    {"Assign super admins, branch managers, instructors, and support staff with the exact access each team needs."}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row items-stretch self-stretch gap-6">
              <div className="flex flex-1 flex-col items-start bg-white py-[29px] px-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <img
                  src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/xink2pzf_expires_30_days.png"}
                  className="w-[52px] h-[52px] mb-[23px] rounded-lg object-fill"
                  alt="icon"
                />
                <div className="flex flex-col items-start pb-[1px] mb-4">
                  <span className="text-[#111b2f] text-lg font-bold">
                    {"Reusable course templates"}
                  </span>
                </div>
                <div className="flex flex-col self-stretch pb-[1px]">
                  <span className="text-slate-500 text-sm leading-relaxed">
                    {"Duplicate successful courses across branches while still allowing local edits for pricing, schedules, or instructors."}
                  </span>
                </div>
              </div>
              <div className="flex flex-1 flex-col items-start bg-white py-[29px] px-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <img
                  src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/oe8m4bv0_expires_30_days.png"}
                  className="w-[52px] h-[52px] mb-[23px] rounded-lg object-fill"
                  alt="icon"
                />
                <div className="flex flex-col items-start pb-[1px] mb-4">
                  <span className="text-[#111b2f] text-lg font-bold">
                    {"Tenant-specific billing"}
                  </span>
                </div>
                <div className="flex flex-col items-start pb-[1px]">
                  <span className="text-slate-500 text-sm leading-relaxed">
                    {"Configure plans, payment settings, and monetization logic for each academy while maintaining central ownership."}
                  </span>
                </div>
              </div>
              <div className="flex flex-1 flex-col items-start bg-white py-[29px] px-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <img
                  src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/1xbc2zb7_expires_30_days.png"}
                  className="w-[52px] h-[52px] mb-[23px] rounded-lg object-fill"
                  alt="icon"
                />
                <div className="flex flex-col items-start pb-[1px] mb-4">
                  <span className="text-[#111b2f] text-lg font-bold">
                    {"Cross-tenant analytics"}
                  </span>
                </div>
                <div className="flex flex-col self-stretch pb-[1px]">
                  <span className="text-slate-500 text-sm leading-relaxed">
                    {"Track enrollments, completion, revenue, and learner activity across every branch or partner portal."}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How teams use it - Gradient section with updated colors */}
        <div className="flex flex-col items-center self-stretch py-16 sm:py-24 px-4 sm:px-8 md:px-16 lg:px-[120px] gap-[57px]"
          style={{
            background: "linear-gradient(135deg, #0e7c67 0%, #1a5c3a 100%)"
          }}>
          <div className="flex flex-col items-center pb-[5px] px-1 text-center">
            <button className="flex flex-col items-start bg-white/10 text-left py-2.5 px-3.5 mb-[21px] rounded-xl border-0 cursor-pointer hover:bg-white/20 transition-colors"
              onClick={() => alert("Pressed!")}>
              <span className="text-white text-[13px] font-bold">
                {"How teams use it"}
              </span>
            </button>
            <div className="flex flex-col items-center pb-[1px] mb-[29px]">
              <span className="text-white text-3xl sm:text-4xl lg:text-[44px] font-bold text-center max-w-[654px]">
                {"A single feature, applied across different education models."}
              </span>
            </div>
            <div className="flex flex-col items-center pb-[1px]">
              <span className="text-white/90 text-base text-center max-w-[710px]">
                {"Show the same capability through practical scenarios so visitors understand where this fits in their own organization."}
              </span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-stretch self-stretch gap-6">
            <div className="flex flex-1 flex-col items-start bg-white/10 pt-7 px-6 pb-8 rounded-lg hover:bg-white/15 transition-colors">
              <button className="flex flex-col items-start bg-white/20 text-left py-[17px] px-5 mb-5 rounded-3xl border-0 cursor-pointer"
                onClick={() => alert("Pressed!")}>
                <span className="text-white text-lg font-bold">
                  {"1"}
                </span>
              </button>
              <div className="flex flex-col items-start pb-[1px] mb-[18px]">
                <span className="text-white text-[17px] font-bold">
                  {"Franchise academies"}
                </span>
              </div>
              <div className="flex flex-col self-stretch pb-[1px]">
                <span className="text-white/80 text-sm leading-relaxed">
                  {"Create a branded tenant for each franchise owner while HQ keeps oversight of standards, sales, and learner outcomes."}
                </span>
              </div>
            </div>
            <div className="flex flex-1 flex-col items-start bg-white/10 py-7 px-6 pb-8 rounded-lg hover:bg-white/15 transition-colors">
              <button className="flex flex-col items-start bg-white/20 text-left py-[17px] px-[19px] mb-5 rounded-3xl border-0 cursor-pointer"
                onClick={() => alert("Pressed!")}>
                <span className="text-white text-lg font-bold">
                  {"2"}
                </span>
              </button>
              <div className="flex flex-col items-start pb-[1px] mb-4">
                <span className="text-white text-[17px] font-bold">
                  {"School groups"}
                </span>
              </div>
              <div className="flex flex-col self-stretch pb-[1px]">
                <span className="text-white/80 text-sm leading-relaxed">
                  {"Give every campus its own admin space, class setup, and learner management without splitting into disconnected systems."}
                </span>
              </div>
            </div>
            <div className="flex flex-1 flex-col items-start bg-white/10 pt-7 px-6 pb-8 rounded-lg hover:bg-white/15 transition-colors">
              <button className="flex flex-col items-start bg-white/20 text-left py-[17px] px-[18px] mb-5 rounded-3xl border-0 cursor-pointer"
                onClick={() => alert("Pressed!")}>
                <span className="text-white text-lg font-bold">
                  {"3"}
                </span>
              </button>
              <div className="flex flex-col items-start pb-[1px] mb-[15px]">
                <span className="text-white text-[17px] font-bold">
                  {"Training partners"}
                </span>
              </div>
              <div className="flex flex-col items-start pb-[1px]">
                <span className="text-white/80 text-sm leading-relaxed">
                  {"Offer partner organizations a private portal with curated content, dedicated managers, and custom reporting views."}
                </span>
              </div>
            </div>
            <div className="flex flex-1 flex-col items-start bg-white/10 pt-7 px-6 pb-8 rounded-lg hover:bg-white/15 transition-colors">
              <button className="flex flex-col items-start bg-white/20 text-left py-[17px] px-[18px] mb-5 rounded-3xl border-0 cursor-pointer"
                onClick={() => alert("Pressed!")}>
                <span className="text-white text-lg font-bold">
                  {"4"}
                </span>
              </button>
              <div className="flex flex-col items-start pb-[1px] mb-[15px]">
                <span className="text-white text-[17px] font-bold">
                  {"Regional operations"}
                </span>
              </div>
              <div className="flex flex-col self-stretch pb-[1px]">
                <span className="text-white/80 text-sm leading-relaxed">
                  {"Segment teams by geography, assign local admins, and compare performance between regions from one system."}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section - Updated colors to match Home.jsx pricing section */}
        <div className="self-stretch bg-[#f7efeb] py-[88px] px-4 sm:px-8 md:px-16 lg:px-36">
          <div className="flex flex-col lg:flex-row items-center self-stretch bg-white max-w-[1152px] mx-auto p-6 sm:p-8 lg:p-11 gap-8 rounded-lg shadow-lg">
            <div className="flex flex-1 flex-col items-start pb-[5px] text-center lg:text-left">
              <button className="flex flex-col items-start bg-[#EEF2F6] text-left py-[9px] px-3.5 mb-1 rounded-xl border-0 cursor-pointer hover:bg-[#e2e8f0] transition-colors"
                onClick={() => alert("Pressed!")}>
                <span className="text-[#0b8276] text-[13px] font-bold">
                  {"Ready to launch"}
                </span>
              </button>
              <span className="text-[#111b2f] text-2xl sm:text-3xl lg:text-[34px] font-bold max-w-[672px] mb-[19px]">
                {"Want to see this feature inside your LMS setup?"}
              </span>
              <span className="text-slate-500 text-[15px] max-w-[503px]">
                {"Book a walkthrough to explore tenant setup, permission control, branch branding, and reporting workflows tailored to your education business."}
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-4 flex-wrap justify-center">
              <button className="flex flex-col shrink-0 items-start bg-[#FF8A33] text-left py-3.5 px-[21px] rounded-md border-0 cursor-pointer hover:bg-[#e07a2e] transition-colors"
                onClick={() => alert("Pressed!")}>
                <span className="text-white text-sm font-bold">
                  {"Schedule Demo"}
                </span>
              </button>
              <button className="flex flex-col shrink-0 items-start bg-[#EEF2F6] text-left py-4 px-[22px] rounded-md border-0 cursor-pointer hover:bg-[#e2e8f0] transition-colors"
                onClick={() => alert("Pressed!")}>
                <span className="text-[#111b2f] text-sm font-bold">
                  {"See Pricing"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}