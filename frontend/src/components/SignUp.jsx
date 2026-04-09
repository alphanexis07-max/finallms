import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { api, getDashboardPathByRole, setAuthSession } from '../lib/api'

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const PHONE_REGEX = /^\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}$/

export default function SignUp() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [institutionCode, setInstitutionCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isEmailValid = EMAIL_REGEX.test(email)
  const isPhoneValid = PHONE_REGEX.test(phone)
  const canSubmit = isEmailValid && isPhoneValid && fullName.trim() && password && password === confirmPassword

  async function onSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
    setError('')
    if (!canSubmit) return
    try {
      setLoading(true)
      const data = await api('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          full_name: fullName,
          email,
          password,
          role: 'student',
          ...(institutionCode.trim() ? { tenant_id: institutionCode.trim() } : {}),
        }),
      })
      setAuthSession(data.access_token, data.role, data.tenant_id)
      navigate(getDashboardPathByRole(data.role))
    } catch (err) {
      setError(err.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden overflow-y-auto bg-gradient-to-br from-[#0e7c67] via-[#1a5c3a] to-[#0e5c4a] p-4 font-['Inter',_'Segoe_UI',_Roboto,_sans-serif] sm:p-6 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-[1300px] grid-cols-1 items-start gap-8 lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[1fr_460px] lg:items-center lg:gap-13">
        {/* Left Section - Brand Section */}
        <section className="text-white">
          <h1 className="m-0 text-[44px] leading-[1.15] font-extrabold tracking-[-1.2px] whitespace-pre-line sm:text-[54px] lg:text-[64px]">
            Start Teaching &{'\n'}Growing Your{'\n'}
            <span className="text-[#ff8a33]">Online Classroom</span>
          </h1>
          <p className="mt-5.5 max-w-[490px] text-base leading-relaxed text-white/70 sm:text-lg">
            Create your LMS account to launch classes, manage learners, and grow your
            educational community with ease.
          </p>
          <ul className="mt-8 p-0 list-none flex flex-col gap-4">
            <li className="flex items-center gap-3 text-sm sm:text-base">
              <span className="w-8 h-8 rounded-full inline-flex items-center justify-center bg-white/15 text-[#ff8a33] font-bold">✓</span>
              Create courses in minutes
            </li>
            <li className="flex items-center gap-3 text-sm sm:text-base">
              <span className="w-8 h-8 rounded-full inline-flex items-center justify-center bg-white/15 text-[#ff8a33] font-bold">✓</span>
              Invite students and parents easily
            </li>
            <li className="flex items-center gap-3 text-sm sm:text-base">
              <span className="w-8 h-8 rounded-full inline-flex items-center justify-center bg-white/15 text-[#ff8a33] font-bold">✓</span>
              Track progress from one dashboard
            </li>
          </ul>
        </section>

        {/* Card Section - Signup Form */}
        <section className="relative w-full max-w-[520px] mx-auto lg:h-full lg:max-w-none">
          <div className="relative flex w-full flex-col rounded-2xl bg-white p-5 shadow-2xl sm:p-8 lg:h-full lg:max-h-[820px] lg:p-10">
            {/* Tabs */}
            <div className="flex gap-1.5 p-1.5 rounded-xl bg-gray-100 mb-7">
              <Link 
                to="/login" 
                className="flex-1 text-center border-0 rounded-lg py-3 px-2.5 bg-transparent text-gray-600 text-sm font-semibold cursor-pointer no-underline transition-all hover:bg-gray-200 hover:text-gray-900"
              >
                Login
              </Link>
              <button type="button" className="flex-1 border-0 rounded-lg py-3 px-2.5 bg-[#ff8a33] text-white shadow-sm text-sm font-semibold cursor-pointer transition-all hover:bg-[#e57a23]">
                Sign Up
              </button>
            </div>

            <h2 className="m-0 text-[#111b2f] text-2xl sm:text-[30px] leading-[1.15] font-extrabold">Create your account</h2>
            <p className="mt-2 text-slate-500 text-sm">
              Start your learning platform journey with a few quick details.
            </p>

            <div className="mt-6 flex-1 overflow-y-auto pr-1">
              <form className="flex flex-col gap-4" onSubmit={onSubmit}>
                <label className="flex flex-col gap-2">
                  <span className="text-[#111b2f] text-sm font-semibold">Full Name</span>
                  <input
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    className="border border-gray-200 rounded-md p-3.5 text-sm text-[#111b2f] outline-none transition-all focus:border-[#0b8276] focus:ring-2 focus:ring-[#0b8276]/20" 
                    type="text" 
                    placeholder="Ava Thompson" 
                  />
                  {submitted && !fullName.trim() && (
                    <span className="text-xs font-medium text-red-500">Full name is required</span>
                  )}
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-[#111b2f] text-sm font-semibold">Email Address</span>
                  <input 
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="border border-gray-200 rounded-md p-3.5 text-sm text-[#111b2f] outline-none transition-all focus:border-[#0b8276] focus:ring-2 focus:ring-[#0b8276]/20" 
                    type="email" 
                    placeholder="ava@example.com" 
                  />
                  {submitted && !isEmailValid && (
                    <span className="text-xs font-medium text-red-500">Enter a valid email address.</span>
                  )}
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-[#111b2f] text-sm font-semibold">Phone Number</span>
                  <input 
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className="border border-gray-200 rounded-md p-3.5 text-sm text-[#111b2f] outline-none transition-all focus:border-[#0b8276] focus:ring-2 focus:ring-[#0b8276]/20" 
                    type="tel" 
                    placeholder="(123) 456-7890" 
                  />
                  {submitted && !isPhoneValid && (
                    <span className="text-xs font-medium text-red-500">Enter a valid phone number.</span>
                  )}
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-[#111b2f] text-sm font-semibold">
                    Institution Code <span className="text-slate-500 font-normal">(optional)</span>
                  </span>
                  <input 
                    value={institutionCode}
                    onChange={(event) => setInstitutionCode(event.target.value)}
                    className="border border-gray-200 rounded-md p-3.5 text-sm text-[#111b2f] outline-none transition-all focus:border-[#0b8276] focus:ring-2 focus:ring-[#0b8276]/20" 
                    type="text" 
                    placeholder="e.g., academy-901630" 
                  />
                  <p className="text-xs text-slate-500">Leave this blank if you want to create a direct student account first and enroll later.</p>
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-[#111b2f] text-sm font-semibold">Password</span>
                  <input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="border border-gray-200 rounded-md p-3.5 text-sm text-[#111b2f] outline-none transition-all focus:border-[#0b8276] focus:ring-2 focus:ring-[#0b8276]/20" 
                    type="password" 
                    placeholder="••••••••••" 
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-[#111b2f] text-sm font-semibold">Confirm Password</span>
                  <input
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className="border border-gray-200 rounded-md p-3.5 text-sm text-[#111b2f] outline-none transition-all focus:border-[#0b8276] focus:ring-2 focus:ring-[#0b8276]/20" 
                    type="password" 
                    placeholder="••••••••••" 
                  />
                  {submitted && password !== confirmPassword && (
                    <span className="text-xs font-medium text-red-500">Passwords do not match.</span>
                  )}
                  {password && confirmPassword && password === confirmPassword && (
                    <span className="mt-1.5 text-[#0b8276] text-xs font-medium">✓ Passwords match</span>
                  )}
                </label>

                <label className="flex items-center gap-2.5 text-slate-600 text-sm cursor-pointer">
                  <input 
                    type="checkbox" 
                    defaultChecked 
                    className="h-4 w-4 rounded border-gray-300 text-[#0b8276] focus:ring-[#0b8276]/20"
                  />
                  I agree to the Terms &amp; Privacy Policy
                </label>

                <button 
                  type="submit" 
                  disabled={!canSubmit || loading} 
                  className="border-0 rounded-md bg-[#ff8a33] text-white text-base font-bold p-3.5 cursor-pointer mt-1 transition-all hover:bg-[#e57a23] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Creating account...' : 'Create account'}
                </button>
                {error && <p className="text-xs font-medium text-red-500 text-center">{error}</p>}
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}