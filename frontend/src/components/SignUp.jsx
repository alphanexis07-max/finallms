import { Link } from 'react-router-dom'
import { useState } from 'react'

const DECORATIVE_IMG = 'https://www.figma.com/api/mcp/asset/a41cf675-38f9-4801-90f3-b9a095bc404c'
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const PHONE_REGEX = /^\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}$/

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const isEmailValid = EMAIL_REGEX.test(email)
  const isPhoneValid = PHONE_REGEX.test(phone)
  const canSubmit = isEmailValid && isPhoneValid

  return (
    <div className="min-h-screen w-full overflow-x-hidden overflow-y-auto bg-gradient-to-br from-[#1c113b] via-[#3a2286] to-[#5d3df0] p-4 font-[Inter,_'Segoe_UI',_Roboto,_sans-serif] sm:p-6 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-[1300px] grid-cols-1 items-start gap-8 lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[1fr_460px] lg:items-center lg:gap-13">
        {/* Left Section */}
        <section className="text-white">
          <h1 className="m-0 text-[64px] leading-[1.15] font-extrabold tracking-[-1.2px] whitespace-pre-line max-lg:text-[44px] max-sm:text-[34px]">
            Start Teaching &{'\n'}Growing Your{'\n'}
            <span className="text-[#ff8a33]">Online Classroom</span>
          </h1>
          <p className="mt-5.5 max-w-[490px] text-lg leading-relaxed text-white/70">
            Create your EduKids account to launch classes, manage learners, and grow your
            educational community with ease.
          </p>
          <ul className="mt-8 p-0 list-none flex flex-col gap-4">
            <li className="flex items-center gap-3 text-base">
              <span className="w-8 h-8 rounded-full inline-flex items-center justify-center bg-white/15 text-[#ff8a33] font-bold">✓</span>
              Create courses in minutes
            </li>
            <li className="flex items-center gap-3 text-base">
              <span className="w-8 h-8 rounded-full inline-flex items-center justify-center bg-white/15 text-[#ff8a33] font-bold">✓</span>
              Invite students and parents easily
            </li>
            <li className="flex items-center gap-3 text-base">
              <span className="w-8 h-8 rounded-full inline-flex items-center justify-center bg-white/15 text-[#ff8a33] font-bold">✓</span>
              Track progress from one dashboard
            </li>
          </ul>
        </section>

        {/* Card Section */}
        <section className="relative w-full max-w-[520px] mx-auto lg:h-full lg:max-w-none">
          <img 
            src={DECORATIVE_IMG} 
            alt="Education icon" 
            className="absolute -top-9 -right-9 w-[110px] h-[110px] rounded-full border-6 border-white object-cover shadow-lg bg-white max-lg:hidden z-[1]" 
          />
          <div className="relative flex w-full flex-col rounded-2xl bg-white p-5 shadow-2xl sm:p-8 lg:h-full lg:max-h-[820px] lg:p-10">
            {/* Tabs */}
            <div className="flex gap-1.5 p-1.5 rounded-xl bg-[#f3f6f8] mb-7">
              <Link 
                to="/login" 
                className="flex-1 text-center border-0 rounded-lg py-3 px-2.5 bg-transparent text-[#6b7480] text-sm font-semibold cursor-pointer no-underline"
              >
                Login
              </Link>
              <button type="button" className="flex-1 border-0 rounded-lg py-3 px-2.5 bg-white text-[#0b1020] shadow-sm text-sm font-semibold cursor-pointer">
                Sign Up
              </button>
            </div>

            <h2 className="m-0 text-[#0b1020] text-[30px] leading-[1.15] font-extrabold">Create your account</h2>
            <p className="mt-2 text-[#6b7480] text-sm">
              Start your learning platform journey with a few quick details.
            </p>

            <div className="mt-6 flex-1 overflow-y-auto pr-1">
            <form className="flex flex-col gap-4" onSubmit={(event) => { event.preventDefault(); setSubmitted(true) }}>
              <label className="flex flex-col gap-2">
                <span className="text-[#0b1020] text-sm font-semibold">Full Name</span>
                <input 
                  className="border border-black/10 rounded-md p-3.5 text-sm text-[#0b1020] outline-none focus:border-[#5a3bd6] focus:ring-3 focus:ring-[#5a3bd6]/20" 
                  type="text" 
                  placeholder="Ava Thompson" 
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-[#0b1020] text-sm font-semibold">Email Address</span>
                <input 
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="border border-black/10 rounded-md p-3.5 text-sm text-[#0b1020] outline-none focus:border-[#5a3bd6] focus:ring-3 focus:ring-[#5a3bd6]/20" 
                  type="email" 
                  placeholder="ava@example.com" 
                />
                {submitted && !isEmailValid ? <span className="text-xs font-medium text-[#dc2626]">Enter a valid email address.</span> : null}
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-[#0b1020] text-sm font-semibold">Phone Number</span>
                <input 
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="border border-black/10 rounded-md p-3.5 text-sm text-[#0b1020] outline-none focus:border-[#5a3bd6] focus:ring-3 focus:ring-[#5a3bd6]/20" 
                  type="tel" 
                  placeholder="(123) 456-7890" 
                />
                {submitted && !isPhoneValid ? <span className="text-xs font-medium text-[#dc2626]">Enter a valid phone number.</span> : null}
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-[#0b1020] text-sm font-semibold">Password</span>
                <input 
                  className="border border-black/10 rounded-md p-3.5 text-sm text-[#0b1020] outline-none focus:border-[#5a3bd6] focus:ring-3 focus:ring-[#5a3bd6]/20" 
                  type="password" 
                  placeholder="••••••••••" 
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-[#0b1020] text-sm font-semibold">Confirm Password</span>
                <input 
                  className="border border-black/10 rounded-md p-3.5 text-sm text-[#0b1020] outline-none focus:border-[#5a3bd6] focus:ring-3 focus:ring-[#5a3bd6]/20" 
                  type="password" 
                  placeholder="••••••••••" 
                />
                <span className="mt-1.5 text-[#1fb27a] text-xs">Passwords match and your account is ready to create.</span>
              </label>

              <label className="flex items-center gap-2.5 text-[#6b7480] text-sm">
                <input type="checkbox" defaultChecked />
                I agree to the Terms &amp; Privacy Policy
              </label>

              <button type="submit" disabled={!canSubmit} className="border-0 rounded-md bg-[#ff8a33] text-white text-base font-bold p-3.5 cursor-pointer mt-1 disabled:cursor-not-allowed disabled:opacity-60">
                Create account
              </button>
            </form>
            </div>

            <div className="my-5.5 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-[#6b7480] text-xs font-semibold">
              <div className="border-t border-black/10"></div>
              <span>Or sign up with</span>
              <div className="border-t border-black/10"></div>
            </div>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <button type="button" className="border border-black/10 rounded-md bg-white text-[#0b1020] p-3 text-sm font-bold cursor-pointer">
                Google
              </button>
              <button type="button" className="border border-black/10 rounded-md bg-white text-[#0b1020] p-3 text-sm font-bold cursor-pointer">
                Apple
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}