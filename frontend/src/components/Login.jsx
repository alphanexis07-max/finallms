import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { CheckCircle2, Eye, EyeOff, Sparkles } from 'lucide-react'
import { api, getDashboardPathByRole, setAuthSession } from '../lib/api'
import { GoogleLogin } from '@react-oauth/google'

function showToast(message) {
  if (window && window.alert) {
    window.alert(message)
  }
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const BENEFITS = ['Multi-Tenant LMS System', 'Live & Recorded Learning', 'Secure Payments Integration']
const GOOGLE_CLIENT_ID = (
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  import.meta.env.VITE_GOOGLE_CLIENTID ||
  import.meta.env.REACT_APP_GOOGLE_CLIENT_ID ||
  ''
).trim()
const GOOGLE_ALLOWED_ORIGINS = String(import.meta.env.VITE_GOOGLE_ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)
const GOOGLE_ORIGIN_ALLOWED =
  GOOGLE_ALLOWED_ORIGINS.length === 0 || GOOGLE_ALLOWED_ORIGINS.includes(window.location.origin)
const GOOGLE_AUTH_ENABLED = GOOGLE_CLIENT_ID.length > 0 && GOOGLE_ORIGIN_ALLOWED

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isEmailValid = EMAIL_REGEX.test(email)
  const canSubmit = isEmailValid && password.trim()

  async function onSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
    setError('')
    if (!canSubmit) return

    try {
      setLoading(true)
      const data = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      setAuthSession(data.access_token, data.role, data.tenant_id)
      navigate(getDashboardPathByRole(data.role))
    } catch (err) {
      // Custom error message based on backend response
      let msg = err.message || 'Login failed'
      if (msg.toLowerCase().includes('email')) {
        msg = 'Email is incorrect'
      } else if (msg.toLowerCase().includes('password')) {
        msg = 'Password is incorrect'
      }
      setError(msg)
      showToast(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0e7c67] via-[#1a5c3a] to-[#0e5c4a] p-4 font-['Inter',_system-ui,_sans-serif] sm:p-6 lg:p-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-[1280px] flex-col items-center justify-center gap-8 lg:min-h-[calc(100vh-4rem)] lg:flex-row lg:justify-between lg:gap-12">
        {/* Left Side - Brand Section (Hidden on mobile) */}
        <div className="hidden w-full max-w-[600px] text-center lg:block lg:text-left">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[13px] font-medium text-white/90 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-[#ff8a33]" />
            Learning Management System
          </div>

          <h1 className="text-[40px] font-extrabold leading-[1.1] tracking-tight text-white sm:text-[52px] lg:text-[64px]">
            Build, Sell & Scale Your <span className="text-[#ff8a33]">Online Courses</span>
          </h1>

          <p className="mt-6 text-[16px] leading-relaxed text-white/70 sm:text-[18px]">
            Multi-tenant LMS SaaS platform designed for institutes, educators, and learners.
            Launch your own learning platform in minutes.
          </p>

          <ul className="mt-8 flex flex-col gap-4">
            {BENEFITS.map((item) => (
              <li key={item} className="flex items-center gap-3 text-[15px] text-white/80">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-[#ff8a33]">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-[480px]">
          <div className="rounded-2xl border border-white/10 bg-white p-6 shadow-2xl sm:p-8">
            <div className="mb-8 flex gap-1.5 rounded-xl bg-gray-100 p-1.5">
              <button
                type="button"
                className="flex-1 rounded-lg bg-[#ff8a33] px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#e57a23]"
              >
                Login
              </button>
              <Link
                to="/signup"
                className="flex-1 rounded-lg px-3 py-2.5 text-center text-sm font-semibold text-gray-600 transition-all hover:bg-gray-200 hover:text-gray-900"
              >
                Sign Up
              </Link>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-[#111b2f] sm:text-3xl">Welcome back</h2>
              <p className="mt-2 text-sm text-slate-500">Enter your details to access your account.</p>
            </div>

             {/* Google Login Button - Improved UI */}
            <div className="flex flex-col items-center gap-3 mb-1">
              {GOOGLE_AUTH_ENABLED ? (
                <GoogleLogin
                  onSuccess={async (credentialResponse) => {
                    try {
                      const data = await api('/auth/google-login', {
                        method: 'POST',
                        body: JSON.stringify({ credential: credentialResponse.credential }),
                      })
                      setAuthSession(data.access_token, data.role, data.tenant_id)
                      navigate(getDashboardPathByRole(data.role))
                    } catch (err) {
                      showToast(err?.message || 'Google Login Failed')
                    }
                  }}
                  onError={() => {
                    showToast('Google Login Failed')
                  }}
                  width="360"
                  theme="outline"
                  size="large"
                />
              ) : (
                <p className="w-full rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                  {GOOGLE_CLIENT_ID.length === 0
                    ? 'Google sign-in is disabled. Add `VITE_GOOGLE_CLIENT_ID` in frontend env.'
                    : 'Google sign-in is disabled for this origin. Add the current origin in Google OAuth settings or set `VITE_GOOGLE_ALLOWED_ORIGINS`.'}
                </p>
              )}
              <div className="flex items-center w-full my-2">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="mx-3 text-xs text-gray-400 font-medium">or login with email</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#111b2f]">Email Address</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Enter your email address"
                  className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm text-gray-900 outline-none transition-all focus:border-[#0b8276] focus:ring-2 focus:ring-[#0b8276]/20"
                />
                {submitted && !isEmailValid && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">Enter a valid email address.</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#111b2f]">Password</label>
                <div className="relative">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="h-12 w-full rounded-xl border border-gray-200 px-4 pr-11 text-sm text-gray-900 outline-none transition-all focus:border-[#0b8276] focus:ring-2 focus:ring-[#0b8276]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-[#0b8276]"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 rounded border-gray-300 text-[#0b8276] focus:ring-[#0b8276]/20"
                  />
                  Remember me
                </label>
                <Link to="/forgetpassword" className="text-sm font-semibold text-[#0b8276] transition-colors hover:text-[#096b61] hover:underline">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={!canSubmit || loading}
                className="mt-2 h-12 w-full rounded-xl bg-[#ff8a33] font-semibold text-white transition-all hover:bg-[#e57a23] focus:ring-2 focus:ring-[#ff8a33]/50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Logging in...' : 'Login to your account'}
              </button>

              {error && <p className="text-center text-xs font-medium text-red-500">{error}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}