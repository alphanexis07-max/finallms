import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { api, getDashboardPathByRole, setAuthSession } from '../lib/api'
import { GoogleLogin } from '@react-oauth/google'

// Simple toast notification (replace with a library like react-toastify for production)
function showToast(message) {
  if (window && window.alert) {
    window.alert(message)
  }
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const PHONE_REGEX = /^\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}$/

export default function SignUp() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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
          phone,
        }),
      })
      // setAuthSession(data.access_token, data.role, data.tenant_id)
      navigate('/login')
    } catch (err) {
      let msg = err.message || 'Signup failed'
      if (msg.toLowerCase().includes('email')) {
        msg = 'Email already exists'
      } else if (msg.toLowerCase().includes('phone')) {
        msg = 'Phone number already exists'
      } else if (msg.toLowerCase().includes('password') && password !== confirmPassword) {
        msg = 'Password and Confirm Password do not match'
      }
      setError(msg)
      showToast(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#0e7c67] via-[#1a5c3a] to-[#0e5c4a] font-['Inter',_'Segoe_UI',_Roboto,_sans-serif]">
      <div className="h-screen w-full max-w-[1300px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_460px] gap-8 p-4 sm:p-6 lg:p-8 overflow-hidden">
        {/* Left Section - Brand Section */}
        <section className="text-white flex flex-col justify-center h-full overflow-y-auto">
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
        <section className="h-full flex items-center">
          <div className="relative w-full bg-white rounded-2xl shadow-2xl flex flex-col h-[90vh] max-h-[820px]">
            {/* Header Section - Static */}
            <div className="p-5 sm:p-8 pb-0 flex-shrink-0">
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
            </div>

            {/* Scrollable Form Fields */}
            <div className="flex-1 overflow-y-auto px-5 sm:px-8">
              {/* Google Sign Up Button */}
              <div className="flex flex-col items-center gap-3 mb-1">
                <GoogleLogin
                  onSuccess={async (credentialResponse) => {
                    try {
                      const data = await api('/auth/google-signup', {
                        method: 'POST',
                        body: JSON.stringify({ credential: credentialResponse.credential }),
                      })
                      navigate('/login')
                    } catch (err) {
                      showToast('Google Sign Up Failed')
                    }
                  }}
                  onError={() => {
                    showToast('Google Sign Up Failed')
                  }}
                  useOneTap
                  width="100%"
                  theme="outline"
                  size="large"
                />
                <div className="flex items-center w-full my-2">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="mx-3 text-xs text-gray-400 font-medium">or sign up with email</span>
                  <div className="flex-grow border-t border-gray-200"></div>
                </div>
              </div>

              <form className="flex flex-col gap-4" onSubmit={onSubmit}>
                <label className="flex flex-col gap-2">
                  <span className="text-[#111b2f] text-sm font-semibold">Full Name</span>
                  <input
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    className="border border-gray-200 rounded-md p-3.5 text-sm text-[#111b2f] outline-none transition-all focus:border-[#0b8276] focus:ring-2 focus:ring-[#0b8276]/20" 
                    type="text" 
                    placeholder="Enter Your Full Name" 
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
                    placeholder="Enter your email address" 
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
                    placeholder="Enter your phone number" 
                  />
                  {submitted && !isPhoneValid && (
                    <span className="text-xs font-medium text-red-500">Enter a valid phone number.</span>
                  )}
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-[#111b2f] text-sm font-semibold">Password</span>
                  <div className="relative">
                    <input
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="border border-gray-200 rounded-md p-3.5 text-sm text-[#111b2f] outline-none transition-all focus:border-[#0b8276] focus:ring-2 focus:ring-[#0b8276]/20 w-full pr-10" 
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create password" 
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0b8276]"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-[#111b2f] text-sm font-semibold">Confirm Password</span>
                  <div className="relative">
                    <input
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      className="border border-gray-200 rounded-md p-3.5 text-sm text-[#111b2f] outline-none transition-all focus:border-[#0b8276] focus:ring-2 focus:ring-[#0b8276]/20 w-full pr-10" 
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Re-enter password" 
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0b8276]"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {submitted && password !== confirmPassword && (
                    <span className="text-xs font-medium text-red-500">Passwords do not match.</span>
                  )}
                  {password && confirmPassword && password === confirmPassword && (
                    <span className="mt-1.5 text-[#0b8276] text-xs font-medium">✓ Passwords match</span>
                  )}
                </label>

                {/* Add bottom padding for better scroll experience */}
                <div className="h-4"></div>
              </form>
            </div>

            {/* Footer Section - Static with Terms and Button */}
            <div className="p-5 sm:p-8 pt-0 flex-shrink-0">
              <label className="flex items-center gap-2.5 text-slate-600 text-sm cursor-pointer mb-4">
                <input 
                  type="checkbox" 
                  defaultChecked 
                  className="h-4 w-4 rounded border-gray-300 text-[#0b8276] focus:ring-[#0b8276]/20"
                />
                I agree to the Terms &amp; Privacy Policy
              </label>

              <button 
                type="submit" 
                onClick={onSubmit}
                disabled={!canSubmit || loading} 
                className="w-full border-0 rounded-md bg-[#ff8a33] text-white text-base font-bold p-3.5 cursor-pointer transition-all hover:bg-[#e57a23] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
              {error && <p className="text-xs font-medium text-red-500 text-center mt-3">{error}</p>}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}