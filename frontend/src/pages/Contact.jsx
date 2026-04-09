import React, { useState } from "react";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}$/;

export default (props) => {
  const [input1, onChangeInput1] = useState('');
  const [input2, onChangeInput2] = useState('');
  const [input3, onChangeInput3] = useState('');
  const [input4, onChangeInput4] = useState('');
  const [input5, onChangeInput5] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Validation checks
  const isFirstNameValid = input1.trim().length > 0;
  const isLastNameValid = input2.trim().length > 0;
  const isEmailValid = EMAIL_REGEX.test(input3);
  const isPhoneValid = PHONE_REGEX.test(input4);
  const isCompanyValid = input5.trim().length > 0;
  const isMessageValid = message.trim().length > 0;

  const isFormValid = isFirstNameValid && isLastNameValid && isEmailValid && isPhoneValid && isCompanyValid && isMessageValid;

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (isFormValid) {
      console.log('Contact form submitted:', {
        firstName: input1,
        lastName: input2,
        email: input3,
        phone: input4,
        company: input5,
        message
      });
      alert('Form submitted successfully!');
    }
  };

  return (
    <div className="flex flex-col bg-white">
      <div className="self-stretch bg-[#F7FCFF]">
        {/* Hero Section - Contact Us with matching gradient */}
        <div className="flex flex-col items-center self-stretch bg-white py-[1px] px-4 sm:px-8 md:px-16 lg:px-36 pt-16 pb-8">
          <div className="flex flex-col items-center self-stretch py-1.5 mb-[11px] mx-8">
            <span className="text-[#111b2f] text-3xl sm:text-4xl lg:text-[40px] font-bold text-center">
              {"Contact Us"}
            </span>
          </div>
          <div className="flex flex-col items-start py-1 px-[17px] mb-3">
            <span className="text-slate-500 text-[15px] text-center max-w-[584px]">
              {"Tell us about your institution, audience, and goals. We'll help you find the best LMS setup for your team."}
            </span>
          </div>
        </div>

        {/* Contact Form and Info Section */}
        <div className="flex flex-col items-center self-stretch py-8 px-4 sm:px-8 md:px-16 lg:px-36">
          <div className="flex flex-col lg:flex-row items-start self-stretch pt-[45px] mx-8 gap-8">
            {/* Contact Info Cards - Left Side */}
            <div className="flex flex-col shrink-0 items-start pb-[1px] w-full lg:w-auto">
              <div className="flex flex-col items-start bg-[#f7efeb] py-[29px] px-7 mb-[19px] gap-[30px] rounded-lg shadow-md hover:shadow-lg transition-shadow w-full">
                <div className="flex items-start gap-4">
                  <img
                    src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/mwkw9r9b_expires_30_days.png"}
                    className="w-12 h-12 object-fill"
                    alt="email"
                  />
                  <div className="flex flex-col shrink-0 items-start py-1 gap-[11px]">
                    <span className="text-[#111b2f] text-lg font-bold">
                      {"Email us"}
                    </span>
                    <span className="text-slate-500 text-sm max-w-[232px]">
                      {"Share your needs, migration questions, or partnership ideas and we'll reply within one business day."}
                    </span>
                  </div>
                </div>
                <span className="text-[#0b8276] text-sm font-medium">
                  {"hello@lmsplatform.com"}
                </span>
              </div>

              <div className="flex flex-col items-start bg-[#f7efeb] py-[29px] px-7 mb-5 gap-[30px] rounded-lg shadow-md hover:shadow-lg transition-shadow w-full">
                <div className="flex items-start gap-4">
                  <img
                    src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/iy0hc2ur_expires_30_days.png"}
                    className="w-12 h-12 object-fill"
                    alt="phone"
                  />
                  <div className="flex flex-col shrink-0 items-start">
                    <div className="flex flex-col items-start py-[5px]">
                      <span className="text-[#111b2f] text-lg font-bold">
                        {"Call our team"}
                      </span>
                    </div>
                    <div className="flex flex-col items-start py-1">
                      <span className="text-slate-500 text-sm max-w-[233px]">
                        {"Speak with sales for plan guidance, onboarding support, and enterprise requirements."}
                      </span>
                    </div>
                  </div>
                </div>
                <span className="text-[#0b8276] text-sm font-medium">
                  {"+1 (800) 245-1948"}
                </span>
              </div>

              <div className="flex items-start bg-[#f7efeb] pt-[27px] pb-[41px] px-7 rounded-lg shadow-md hover:shadow-lg transition-shadow w-full">
                <img
                  src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/9h7mafvm_expires_30_days.png"}
                  className="w-12 h-12 mr-4 object-fill"
                  alt="support"
                />
                <div className="flex flex-col shrink-0 items-start py-1 gap-[9px]">
                  <span className="text-[#111b2f] text-lg font-bold">
                    {"Support hours"}
                  </span>
                  <span className="text-slate-500 text-sm max-w-[228px]">
                    {"Monday to Friday, 9:00 AM to 6:00 PM EST. Priority support available on Pro and Enterprise plans."}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Form - Right Side */}
            <div className="flex-1 bg-[#f7efeb] py-[35px] px-6 sm:px-9 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <form onSubmit={handleFormSubmit}>
                <div className="flex flex-col items-start self-stretch pb-[1px] mb-[26px] gap-[9px]">
                  <div className="flex flex-col items-start self-stretch pb-[1px]">
                    <span className="text-[#111b2f] text-2xl sm:text-[28px] font-bold">
                      {"Send us a message"}
                    </span>
                  </div>
                  <div className="flex flex-col items-start py-1">
                    <span className="text-slate-500 text-[15px] max-w-[484px]">
                      {"We'll connect you with the right specialist for product demos, pricing questions, onboarding, or learner support."}
                    </span>
                  </div>
                </div>

                <div className="self-stretch pb-[1px] mb-6">
                  <div className="flex flex-col sm:flex-row justify-center items-stretch self-stretch mb-4 gap-[18px]">
                    <div className="flex flex-col flex-1 items-start gap-2">
                      <div className="flex flex-col items-start pb-[1px]">
                        <span className="text-[#111b2f] text-[13px] font-medium">
                          {"First name"}
                        </span>
                      </div>
                      <input
                        placeholder={"Ava"}
                        value={input1}
                        onChange={(event) => onChangeInput1(event.target.value)}
                        className={`w-full text-slate-600 bg-white text-sm py-5 px-[17px] rounded-md border ${
                          submitted && !isFirstNameValid ? 'border-red-500' : 'border-[#00000012]'
                        } focus:outline-none focus:ring-2 focus:ring-[#0b8276] focus:border-transparent`}
                      />
                      {submitted && !isFirstNameValid && (
                        <span className="text-red-500 text-xs">First name is required</span>
                      )}
                    </div>
                    <div className="flex flex-col flex-1 items-start gap-2">
                      <div className="flex flex-col items-start pb-[1px]">
                        <span className="text-[#111b2f] text-[13px] font-medium">
                          {"Last name"}
                        </span>
                      </div>
                      <input
                        placeholder={"Turner"}
                        value={input2}
                        onChange={(event) => onChangeInput2(event.target.value)}
                        className={`w-full text-slate-600 bg-white text-sm py-5 px-[17px] rounded-md border ${
                          submitted && !isLastNameValid ? 'border-red-500' : 'border-[#00000012]'
                        } focus:outline-none focus:ring-2 focus:ring-[#0b8276] focus:border-transparent`}
                      />
                      {submitted && !isLastNameValid && (
                        <span className="text-red-500 text-xs">Last name is required</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-center items-stretch self-stretch mb-[17px] gap-[18px]">
                    <div className="flex flex-col flex-1 items-start gap-2">
                      <div className="flex flex-col items-start pb-[1px]">
                        <span className="text-[#111b2f] text-[13px] font-medium">
                          {"Work email"}
                        </span>
                      </div>
                      <input
                        placeholder={"ava@brightpathacademy.com"}
                        value={input3}
                        onChange={(event) => onChangeInput3(event.target.value)}
                        className={`w-full text-slate-600 bg-white text-sm py-[18px] px-[17px] rounded-md border ${
                          submitted && !isEmailValid ? 'border-red-500' : 'border-[#00000012]'
                        } focus:outline-none focus:ring-2 focus:ring-[#0b8276] focus:border-transparent`}
                      />
                      {submitted && !isEmailValid && (
                        <span className="text-red-500 text-xs">Valid email is required</span>
                      )}
                    </div>
                    <div className="flex flex-col flex-1 items-start gap-2">
                      <div className="flex flex-col items-start pb-[1px]">
                        <span className="text-[#111b2f] text-[13px] font-medium">
                          {"Phone"}
                        </span>
                      </div>
                      <input
                        placeholder={"+1 (555) 210-4488"}
                        value={input4}
                        onChange={(event) => onChangeInput4(event.target.value)}
                        className={`w-full text-slate-600 bg-white text-sm py-[19px] px-[18px] rounded-md border ${
                          submitted && !isPhoneValid ? 'border-red-500' : 'border-[#00000012]'
                        } focus:outline-none focus:ring-2 focus:ring-[#0b8276] focus:border-transparent`}
                      />
                      {submitted && !isPhoneValid && (
                        <span className="text-red-500 text-xs">Valid phone number is required</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col self-stretch mb-4 gap-2">
                    <div className="flex flex-col items-start self-stretch pb-[1px]">
                      <span className="text-[#111b2f] text-[13px] font-medium">
                        {"Institution or company"}
                      </span>
                    </div>
                    <input
                      placeholder={"BrightPath Learning Academy"}
                      value={input5}
                      onChange={(event) => onChangeInput5(event.target.value)}
                      className={`w-full text-slate-600 bg-white text-sm p-[18px] rounded-md border ${
                        submitted && !isCompanyValid ? 'border-red-500' : 'border-[#00000012]'
                      } focus:outline-none focus:ring-2 focus:ring-[#0b8276] focus:border-transparent`}
                    />
                    {submitted && !isCompanyValid && (
                      <span className="text-red-500 text-xs">Company name is required</span>
                    )}
                  </div>

                  <div className="flex flex-col self-stretch gap-2">
                    <div className="flex flex-col items-start self-stretch pb-[1px]">
                      <span className="text-[#111b2f] text-[13px] font-medium">
                        {"How can we help?"}
                      </span>
                    </div>
                    <textarea
                      placeholder={"We're evaluating LMS platforms for a growing coaching business with live classes, recorded courses, and branded student portals. We'd love to understand onboarding, pricing, and migration options."}
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      rows={4}
                      className={`w-full text-slate-600 bg-white text-sm p-[18px] rounded-md border ${
                        submitted && !isMessageValid ? 'border-red-500' : 'border-[#00000012]'
                      } focus:outline-none focus:ring-2 focus:ring-[#0b8276] focus:border-transparent resize-vertical`}
                    />
                    {submitted && !isMessageValid && (
                      <span className="text-red-500 text-xs">Message is required</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center self-stretch gap-4">
                  <div className="flex flex-col shrink-0 items-start py-[3px] px-[1px]">
                    <span className="text-slate-500 text-[13px]">
                      {"By submitting, you agree to hear back from our team about your request."}
                    </span>
                  </div>
                  <button 
                    type="submit"
                    className="flex flex-col shrink-0 items-start bg-[#FF8A33] text-left py-[15px] px-[19px] rounded border-0 hover:bg-[#e07a2e] transition-colors cursor-pointer"
                  >
                    <span className="text-white text-sm font-medium">
                      {"Send message"}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Choose the right way to reach us - Matching Features.jsx "Six modules" style */}
        <div className="flex flex-col items-center self-stretch bg-[#f7efeb] py-16 sm:py-24 px-4 sm:px-8 md:px-16 lg:px-[120px]">
          <div className="flex flex-col items-center self-stretch py-[3px] mb-[11px] mx-8">
            <span className="text-[#111b2f] text-3xl sm:text-4xl lg:text-[40px] font-bold text-center">
              {"Choose the right way to reach us"}
            </span>
          </div>
          <div className="flex flex-col items-start py-[5px] px-[7px] mb-3 text-center">
            <span className="text-slate-500 text-[15px] text-center">
              {"From product questions to onboarding help, our team is organized to get you answers faster."}
            </span>
          </div>

          <div className="flex flex-col lg:flex-row items-stretch self-stretch pt-[45px] mx-8 gap-7">
            <div className="flex-1 bg-white py-[27px] px-7 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center self-stretch mb-3.5 gap-3.5">
                <img
                  src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/0whcppz2_expires_30_days.png"}
                  className="w-[46px] h-[46px] object-fill"
                  alt="sales"
                />
                <div className="flex flex-col shrink-0 items-start py-1.5">
                  <span className="text-[#111b2f] text-lg font-bold">
                    {"Sales"}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-start self-stretch pb-[1px] mb-[15px]">
                <span className="text-slate-500 text-sm max-w-[279px]">
                  {"Best for pricing, plan comparisons, demos, and large team rollouts."}
                </span>
              </div>
              <div className="flex flex-col self-stretch gap-[7px]">
                <div className="flex flex-col items-start self-stretch pb-[1px]">
                  <span className="text-[#0b8276] text-sm font-medium">
                    {"sales@lmsplatform.com"}
                  </span>
                </div>
                <div className="flex flex-col items-start self-stretch pb-[1px]">
                  <span className="text-slate-500 text-sm">
                    {"Average response: under 4 hours"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 bg-white py-[27px] px-7 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center self-stretch mb-3.5 gap-3.5">
                <img
                  src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/86jzda7h_expires_30_days.png"}
                  className="w-[46px] h-[46px] object-fill"
                  alt="support"
                />
                <div className="flex flex-col shrink-0 items-start py-[5px]">
                  <span className="text-[#111b2f] text-lg font-bold">
                    {"Support"}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-start self-stretch pb-[1px] mb-[15px]">
                <span className="text-slate-500 text-sm max-w-[276px]">
                  {"Best for product guidance, account setup, and platform troubleshooting."}
                </span>
              </div>
              <div className="flex flex-col self-stretch gap-[7px]">
                <div className="flex flex-col items-start self-stretch pb-[1px]">
                  <span className="text-[#0b8276] text-sm font-medium">
                    {"support@lmsplatform.com"}
                  </span>
                </div>
                <div className="flex flex-col items-start self-stretch pb-[1px]">
                  <span className="text-slate-500 text-sm">
                    {"Average response: under 2 hours"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 bg-white py-[27px] px-7 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center self-stretch mb-3.5 gap-3.5">
                <img
                  src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/vo983e9u_expires_30_days.png"}
                  className="w-[46px] h-[46px] object-fill"
                  alt="partnerships"
                />
                <div className="flex flex-col shrink-0 items-start py-1 px-[1px]">
                  <span className="text-[#111b2f] text-lg font-bold">
                    {"Partnerships"}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-start self-stretch pb-[1px] mb-[15px]">
                <span className="text-slate-500 text-sm max-w-[288px]">
                  {"Best for integrations, reseller programs, and strategic education partnerships."}
                </span>
              </div>
              <div className="flex flex-col self-stretch gap-[7px]">
                <div className="flex flex-col items-start self-stretch pb-[1px]">
                  <span className="text-[#0b8276] text-sm font-medium">
                    {"partners@lmsplatform.com"}
                  </span>
                </div>
                <div className="flex flex-col items-start self-stretch pb-[1px]">
                  <span className="text-slate-500 text-sm">
                    {"Enterprise and channel inquiries"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section - Matching Features.jsx style */}
        <div className="flex flex-col items-center self-stretch bg-[#f7efeb] py-16 sm:py-24 px-4 sm:px-8 md:px-16 lg:px-[120px] gap-[11px]">
          <div className="flex flex-col items-center self-stretch pt-1.5 mx-8">
            <span className="text-[#111b2f] text-3xl sm:text-4xl lg:text-[40px] font-bold text-center">
              {"Frequently asked questions"}
            </span>
          </div>
          <div className="flex flex-col items-start py-1">
            <span className="text-slate-500 text-[15px] text-center w-full">
              {"A few quick answers before you reach out."}
            </span>
          </div>

          <div className="self-stretch pt-[45px] mx-8">
            <div className="flex justify-between items-start self-stretch bg-white py-[23px] px-7 mb-[17px] rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex flex-col shrink-0 items-start gap-2">
                <div className="flex flex-col items-start py-1 pl-[1px]">
                  <span className="text-[#111b2f] text-[17px] font-bold">
                    {"How quickly can we launch our LMS?"}
                  </span>
                </div>
                <div className="flex flex-col items-start py-[5px] px-[1px]">
                  <span className="text-slate-500 text-sm">
                    {"Most teams can get started in a few days. Larger migrations and multi-tenant setups usually require a guided onboarding plan."}
                  </span>
                </div>
              </div>
              <img
                src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/gq4ya56i_expires_30_days.png"}
                className="w-9 h-9 rounded-lg object-fill"
                alt="expand"
              />
            </div>

            <div className="flex justify-between items-start self-stretch bg-white py-[23px] px-7 mb-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex flex-col shrink-0 items-start gap-2">
                <div className="flex flex-col items-start py-1 pl-[1px]">
                  <span className="text-[#111b2f] text-[17px] font-bold">
                    {"Do you support live classes and recorded content?"}
                  </span>
                </div>
                <div className="flex flex-col items-start py-[5px]">
                  <span className="text-slate-500 text-sm">
                    {"Yes. You can combine live sessions, pre-recorded lessons, quizzes, certificates, and digital resources in one platform."}
                  </span>
                </div>
              </div>
              <img
                src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/pm2e7x7z_expires_30_days.png"}
                className="w-9 h-9 rounded-lg object-fill"
                alt="expand"
              />
            </div>

            <div className="flex justify-between items-start self-stretch bg-white py-[23px] px-7 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex flex-col shrink-0 items-start gap-2">
                <div className="flex flex-col items-start py-1">
                  <span className="text-[#111b2f] text-[17px] font-bold">
                    {"Can we use our own domain and branding?"}
                  </span>
                </div>
                <div className="flex flex-col items-start py-[5px]">
                  <span className="text-slate-500 text-sm">
                    {"Absolutely. Pro and Enterprise plans support branded experiences, custom domains, and flexible portal configurations."}
                  </span>
                </div>
              </div>
              <img
                src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/r575nt0z_expires_30_days.png"}
                className="w-9 h-9 rounded-lg object-fill"
                alt="expand"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};