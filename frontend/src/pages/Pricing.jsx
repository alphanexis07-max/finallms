import React, { useEffect, useMemo, useState } from "react";
import { Check, X } from "lucide-react";
import { api } from "../lib/api";

export default (props) => {
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [plansError, setPlansError] = useState("");
  const [input1, onChangeInput1] = useState('');
  const [input2, onChangeInput2] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0)

    let mounted = true;

    const loadPlans = async () => {
      try {
        setPlansLoading(true);
        setPlansError("");
        const res = await api("/lms/public/plans?limit=100&active_only=true");
        if (!mounted) return;
        setSubscriptionPlans(Array.isArray(res?.items) ? res.items : []);
      } catch (error) {
        if (!mounted) return;
        setSubscriptionPlans([]);
        setPlansError(error?.message || "Unable to load subscription plans.");
      } finally {
        if (mounted) setPlansLoading(false);
      }
    };

    loadPlans();

    return () => {
      mounted = false;
    };
  }, []);

  const pricingPlans = useMemo(() => {
    return subscriptionPlans
      .slice()
      .sort((left, right) => Number(left?.price || 0) - Number(right?.price || 0))
      .map((plan, index) => {
        const price = Number(plan?.price || 0);
        const billingPeriod = (plan?.billing_period || "monthly").toLowerCase();
        const billingLabel = billingPeriod === "yearly" ? "/year" : billingPeriod === "monthly" ? "/month" : `/${billingPeriod}`;

        return {
          id: plan?._id || `${plan?.name || "plan"}-${index}`,
          name: plan?.name || "Subscription",
          priceLabel: price > 0 ? `Rs. ${price.toLocaleString("en-IN")}` : "Custom",
          billingLabel,
          activeLabel: plan?.active === false ? "Inactive" : "Active",
          isFeatured: index === 1,
        };
      });
  }, [subscriptionPlans]);

  return (
    <div className="flex flex-col bg-white">
      <div className="self-stretch bg-[#F7FCFF]">
        {/* Hero Section with gradient - Matching Features.jsx */}
        <div className="self-stretch pt-[60px] pb-[78px] px-4 sm:px-8 md:px-16 lg:px-36"
          style={{
            background: "linear-gradient(135deg, #0e7c67 0%, #1a5c3a 100%)"
          }}>
          <div className="flex flex-col lg:flex-row items-center self-stretch mb-[31px] gap-8 lg:gap-12">
            <div className="flex flex-1 flex-col items-start">
              <div className="flex items-center mb-[23px] flex-wrap gap-2">
                <button className="flex flex-col shrink-0 items-start bg-white/10 text-left py-[9px] px-3.5 rounded-xl border border-solid border-white/20 hover:bg-white/20 transition-colors cursor-pointer"
                  onClick={() => alert("Pressed!")}>
                  <span className="text-white text-[13px] font-bold">
                    {"Start free. Upgrade when you're ready."}
                  </span>
                </button>
                <button className="flex flex-col shrink-0 items-start bg-white/10 text-left py-[9px] px-[15px] rounded-xl border border-solid border-white/20 hover:bg-white/20 transition-colors cursor-pointer"
                  onClick={() => alert("Pressed!")}>
                  <span className="text-white text-[13px] font-bold">
                    {"Zero setup cost. Instant access."}
                  </span>
                </button>
                <button className="flex flex-col shrink-0 items-start bg-white/10 text-left py-2.5 px-[15px] rounded-xl border border-solid border-white/20 hover:bg-white/20 transition-colors cursor-pointer"
                  onClick={() => alert("Pressed!")}>
                  <span className="text-white text-[13px] font-bold">
                    {"Designed for modern educators & creators"}
                  </span>
                </button>
              </div>
              <div className="flex flex-col items-start self-stretch pb-[1px] mb-7">
                <span className="text-white text-4xl sm:text-5xl lg:text-[64px] font-bold max-w-full lg:w-[501px] leading-tight">
                  {"Powerful pricing built to grow your learning business"}
                </span>
              </div>
              <div className="flex flex-col items-start self-stretch pb-[1px] mb-7">
                <span className="text-white/90 text-base sm:text-[17px] max-w-full lg:w-[531px] leading-relaxed">
                  {"Start small, scale fast, and manage everything in one place. Our pricing is crafted to support your journey—from your first student to thousands."}
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
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-[#111b2f] text-sm">
                        {"Unlimited courses and landing pages"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-[#111b2f] text-sm">
                        {"Stripe and Razorpay payment support"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500" />
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

          {plansLoading ? (
            <div className="col-span-full rounded-lg bg-white px-6 py-10 text-center text-slate-500 shadow-md">
              Loading subscription plans...
            </div>
          ) : plansError ? (
            <div className="col-span-full rounded-lg bg-white px-6 py-10 text-center text-slate-500 shadow-md">
              {plansError}
            </div>
          ) : pricingPlans.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 self-stretch">
              {pricingPlans.slice(0, 3).map((plan) => (
                <div
                  key={plan.id}
                  className={`relative flex flex-1 flex-col items-start rounded-lg px-6 py-[31px] shadow-md transition-shadow hover:shadow-lg ${plan.isFeatured ? "bg-[#141B2D] shadow-xl" : "bg-white"}`}
                  style={plan.isFeatured ? { boxShadow: "0px 28px 64px rgba(0,0,0,0.2)" } : undefined}
                >
                  <div className="flex flex-col self-stretch mb-6 gap-2.5">
                    <div className="flex flex-col items-start self-stretch pb-[1px]">
                      <span className={`text-2xl font-bold ${plan.isFeatured ? "text-white" : "text-[#111b2f]"}`}>
                        {plan.name}
                      </span>
                    </div>
                    <div className="flex flex-col items-start self-stretch pb-[1px]">
                      <span className={`text-sm ${plan.isFeatured ? "text-white/80" : "text-slate-500"}`}>
                        {"Live subscription plan from the admin billing setup."}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start self-stretch mb-[17px] gap-[9px]">
                    <div className="flex flex-col shrink-0 items-start py-0.5 px-[1px]">
                      <span className={`text-[56px] font-bold ${plan.isFeatured ? "text-white" : "text-[#111b2f]"}`}>
                        {plan.priceLabel}
                      </span>
                    </div>
                    <div className="flex flex-col shrink-0 items-start py-2 mt-[25px]">
                      <span className={`text-[15px] ${plan.isFeatured ? "text-white/60" : "text-slate-500"}`}>
                        {plan.billingLabel}
                      </span>
                    </div>
                  </div>
                  <span className={`text-[13px] mb-[29px] ${plan.isFeatured ? "text-white/80" : "text-slate-500"}`}>
                    {plan.activeLabel}
                  </span>
                  <div className="flex flex-col self-stretch gap-3.5">
                    <div className={`flex flex-col items-start self-stretch rounded-md px-3.5 py-[18px] ${plan.isFeatured ? "bg-white/10" : "bg-[#F3F6F9]"}`}>
                      <span className={`text-[13px] ${plan.isFeatured ? "text-white/80" : "text-slate-600"}`}>
                        {"This is the current plan record configured in the backend."}
                      </span>
                    </div>
                    <button
                      className={`flex flex-col items-center self-stretch rounded-md border py-[18px] transition-colors cursor-pointer ${plan.isFeatured ? "border-0 bg-[#FF8A33] hover:bg-[#e07a2e]" : "border border-solid border-[#00000012] bg-transparent hover:bg-gray-50"}`}
                      onClick={() => alert(`Selected ${plan.name}`)}
                    >
                      <span className={`text-sm font-bold ${plan.isFeatured ? "text-white" : "text-[#111b2f]"}`}>
                        {`Choose ${plan.name}`}
                      </span>
                    </button>
                  </div>
                  {plan.isFeatured ? (
                    <div className="flex flex-col items-center self-stretch absolute top-[-14px] right-0 left-0">
                      <button className="flex flex-col items-start bg-[#FF8A33] text-left py-2 px-[11px] rounded-xl border-0 cursor-pointer hover:bg-[#e07a2e] transition-colors"
                        onClick={() => alert("Pressed!")}>
                        <span className="text-white text-xs font-bold">
                          {"Most Popular"}
                        </span>
                      </button>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <div className="col-span-full rounded-lg bg-white px-6 py-10 text-center text-slate-500 shadow-md">
              No active subscription plans found.
            </div>
          )}
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
                {"Compare plans. Choose with confidence."}
              </span>
              <div className="flex flex-col items-start py-[3px] px-2">
                <span className="text-slate-500 text-base text-center max-w-[623px]">
                  {"Understand exactly what each plan offers and pick what fits your goals best."}
                </span>
              </div>
            </div>            {/* Table Header */}
            <div className="grid grid-cols-4 gap-4 self-stretch mb-8 px-4 sm:px-10 border-b border-gray-100 pb-4">
              <div className="text-[#111b2f] text-sm font-bold">Features</div>
              <div className="text-[#111b2f] text-[15px] font-bold text-center">Basic</div>
              <div className="text-[#111b2f] text-[15px] font-bold text-center">Pro</div>
              <div className="text-[#111b2f] text-[15px] font-bold text-center">Enterprise</div>
            </div>

            {/* Table Rows */}
            <div className="flex flex-col self-stretch px-4 sm:px-10 gap-6">
              {/* Student capacity */}
              <div className="grid grid-cols-4 gap-4 items-center">
                <div className="text-[#111b2f] text-sm font-bold">Student capacity</div>
                <div className="text-slate-500 text-sm text-center">100</div>
                <div className="text-slate-500 text-sm text-center">Unlimited</div>
                <div className="text-slate-500 text-sm text-center">Unlimited</div>
              </div>

              {/* Published courses */}
              <div className="grid grid-cols-4 gap-4 items-center">
                <div className="text-[#111b2f] text-sm font-bold">Published courses</div>
                <div className="text-slate-500 text-sm text-center">5</div>
                <div className="text-slate-500 text-sm text-center">Unlimited</div>
                <div className="text-slate-500 text-sm text-center">Unlimited</div>
              </div>

              {/* Custom domain */}
              <div className="grid grid-cols-4 gap-4 items-center">
                <div className="text-[#111b2f] text-sm font-bold">Custom domain</div>
                <div className="flex justify-center"><X className="w-5 h-5 text-red-400" /></div>
                <div className="flex justify-center"><Check className="w-5 h-5 text-[#0b8276]" /></div>
                <div className="flex justify-center"><Check className="w-5 h-5 text-[#0b8276]" /></div>
              </div>

              {/* Advanced analytics */}
              <div className="grid grid-cols-4 gap-4 items-center">
                <div className="text-[#111b2f] text-sm font-bold">Advanced analytics</div>
                <div className="flex justify-center"><X className="w-5 h-5 text-red-400" /></div>
                <div className="flex justify-center"><X className="w-5 h-5 text-red-400" /></div>
                <div className="flex justify-center"><Check className="w-5 h-5 text-[#0b8276]" /></div>
              </div>

              {/* Multi-tenant setup */}
              <div className="grid grid-cols-4 gap-4 items-center">
                <div className="text-[#111b2f] text-sm font-bold">Multi-tenant setup</div>
                <div className="flex justify-center"><X className="w-5 h-5 text-red-400" /></div>
                <div className="text-slate-500 text-sm text-center">Optional</div>
                <div className="flex justify-center"><Check className="w-5 h-5 text-[#0b8276]" /></div>
              </div>

              {/* Dedicated support */}
              <div className="grid grid-cols-4 gap-4 items-center mb-10">
                <div className="text-[#111b2f] text-sm font-bold">Dedicated support</div>
                <div className="text-slate-500 text-sm text-center">Email</div>
                <div className="text-slate-500 text-sm text-center">Priority</div>
                <div className="text-slate-500 text-sm text-center">Success manager</div>
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