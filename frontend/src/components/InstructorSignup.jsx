import React, { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, BookOpen, Lock, Eye, EyeOff, CheckCircle2, GraduationCap } from 'lucide-react'
import { api, getDashboardPathByRole, setAuthSession } from '../lib/api'
import { GoogleLogin } from '@react-oauth/google'

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const PHONE_REGEX = /^\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}$/
const GOOGLE_CLIENT_ID = (
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  import.meta.env.VITE_GOOGLE_CLIENTID ||
  import.meta.env.REACT_APP_GOOGLE_CLIENT_ID ||
  ''
).trim()
const GOOGLE_AUTH_ENABLED = GOOGLE_CLIENT_ID.length > 0

// Simple toast notification (replace with a library like react-toastify for production)
function showToast(message) {
  if (window && window.alert) {
    window.alert(message)
  }
}

export default function InstructorSignup() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    expertise: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [phone, setPhone] = useState('')

  const passwordStrength = useMemo(() => {
    const value = formData.password
    let score = 0
    if (value.length >= 8) score += 1
    if (/[A-Z]/.test(value)) score += 1
    if (/[0-9]/.test(value)) score += 1
    if (/[^A-Za-z0-9]/.test(value)) score += 1
    return score
  }, [formData.password])

  const isEmailValid = EMAIL_REGEX.test(formData.email)
  const isPhoneValid = PHONE_REGEX.test(phone)

  const isFormValid =
    formData.fullName.trim() &&
    isEmailValid &&
    isPhoneValid &&
    formData.expertise.trim() &&
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword &&
    formData.agreeToTerms

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitted(true)
    setError('')
    if (!isFormValid) {
      if (formData.password !== formData.confirmPassword) {
        showToast('Password and Confirm Password do not match')
      }
      return
    }
    try {
      setLoading(true)
      let data
      try {
        data = await api('/auth/register', {
          method: 'POST',
          body: JSON.stringify({
            full_name: formData.fullName,
            email: formData.email,
            password: formData.password,
            role: 'instructor',
            tenant_id: localStorage.getItem('lms_tenant_id') || null,
          }),
        })
      } catch (registerErr) {
        if ((registerErr?.message || '').toLowerCase().includes('email already exists')) {
          data = await api('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email: formData.email, password: formData.password }),
          })
        } else if ((registerErr?.message || '').toLowerCase().includes('phone')) {
          showToast('Phone number already exists')
          throw registerErr
        } else {
          throw registerErr
        }
      }
      setAuthSession(data.access_token, data.role, data.tenant_id)
      navigate('/login')
    } catch (err) {
      let msg = err.message || 'Instructor signup failed'
      if (msg.toLowerCase().includes('email')) {
        msg = 'Email already exists'
      } else if (msg.toLowerCase().includes('phone')) {
        msg = 'Phone number already exists'
      } else if (msg.toLowerCase().includes('password') && formData.password !== formData.confirmPassword) {
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
        {/* Left Section - Brand Section (Hidden on mobile) */}
        <section className="hidden text-white flex-col justify-center h-full overflow-y-auto lg:flex">
          <div className="inline-flex items-center gap-2 rounded-[12px] bg-white/15 px-3 py-1.5 text-[12px] font-semibold text-[#ffb76a] w-fit">
            <GraduationCap className="h-4 w-4" />
            Instructor Onboarding
          </div>

          <h1 className="m-0 mt-4 text-[44px] leading-[1.12] font-extrabold tracking-[-1.2px] whitespace-pre-line sm:text-[54px] lg:text-[64px]">
            Teach, Inspire &{`\n`}Grow with your{`\n`}
            <span className="text-[#ff8a33]">Digital Classroom</span>
          </h1>

          <p className="mt-5.5 max-w-[490px] text-base leading-relaxed text-white/70 sm:text-lg">
            Join as an instructor to create engaging lessons, host live classes, and support learners with structured course journeys.
          </p>

          <ul className="mt-8 p-0 list-none flex flex-col gap-4">
            {[
              'Create and manage your course content',
              'Run live classes and track attendance',
              'Monitor learner progress and performance',
            ].map((text) => (
              <li key={text} className="flex items-center gap-3 text-sm sm:text-base">
                <span className="w-8 h-8 rounded-full inline-flex items-center justify-center bg-white/15 text-[#ff8a33]">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </section>

        {/* Card Section - Instructor Signup Form */}
        <section className="h-full flex items-center">
          <div className="relative w-full bg-white rounded-2xl shadow-2xl flex flex-col h-[90vh] max-h-[880px]">
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
                  Instructor Sign Up
                </button>
              </div>

              <h2 className="m-0 text-[#111b2f] text-2xl sm:text-[30px] leading-[1.15] font-extrabold">Create Instructor Account</h2>
              <p className="mt-2 text-slate-500 text-sm">Fill details to join as instructor.</p>
            </div>

            {/* Scrollable Form Fields */}
            <div className="flex-1 overflow-y-auto px-5 sm:px-8">
              {/* Google Sign Up Button */}
              <div className="flex flex-col items-center gap-3 mb-1">
                {GOOGLE_AUTH_ENABLED ? (
                  <GoogleLogin
                    onSuccess={async (credentialResponse) => {
                      try {
                        const data = await api('/auth/google-signup', {
                          method: 'POST',
                          body: JSON.stringify({ credential: credentialResponse.credential, role: 'instructor' }),
                        })
                        setAuthSession(data.access_token, data.role, data.tenant_id)
                        navigate(getDashboardPathByRole(data.role))
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
                ) : (
                  <p className="w-full rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                    Google sign-up is disabled. Add `VITE_GOOGLE_CLIENT_ID` in frontend env.
                  </p>
                )}
                <div className="flex items-center w-full my-2">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="mx-3 text-xs text-gray-400 font-medium">or sign up with email</span>
                  <div className="flex-grow border-t border-gray-200"></div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4 pb-4">
                <Field
                  icon={<User className="h-4 w-4" />}
                  label="Full Name"
                  value={formData.fullName}
                  onChange={(v) => handleChange('fullName', v)}
                  placeholder="Enter Your Full Name"
                  submitted={submitted}
                  errorMessage="Full name is required"
                  isValid={formData.fullName.trim()}
                />

                <Field
                  icon={<Mail className="h-4 w-4" />}
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(v) => handleChange('email', v)}
                  placeholder="Enter your email address"
                  submitted={submitted}
                  errorMessage="Enter a valid email address"
                  isValid={isEmailValid}
                />

                <div>
                  <label className="flex flex-col gap-2">
                    <span className="text-[#111b2f] text-sm font-semibold">Phone Number</span>
                    <div className={`border rounded-md p-3.5 text-sm text-[#111b2f] outline-none transition-all flex items-center gap-2 ${
                      submitted && !isPhoneValid 
                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
                        : 'border-gray-200 focus-within:border-[#0b8276] focus-within:ring-2 focus-within:ring-[#0b8276]/20'
                    }`}>
                      <span className="text-slate-400">📞</span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter your phone number"
                        className="w-full bg-transparent text-[14px] text-[#111b2f] placeholder:text-slate-400 focus:outline-none"
                      />
                    </div>
                    {submitted && !isPhoneValid && (
                      <span className="text-xs font-medium text-red-500">Enter a valid phone number.</span>
                    )}
                  </label>
                </div>

                <Field
                  icon={<BookOpen className="h-4 w-4" />}
                  label="Subject Expertise"
                  value={formData.expertise}
                  onChange={(v) => handleChange('expertise', v)}
                  placeholder="Science, Math, Coding..."
                  submitted={submitted}
                  errorMessage="Subject expertise is required"
                  isValid={formData.expertise.trim()}
                />

                <div>
                  <Field
                    icon={<Lock className="h-4 w-4" />}
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(v) => handleChange('password', v)}
                    placeholder="Create password"
                    submitted={submitted}
                    isValid={formData.password}
                    errorMessage="Password is required"
                    rightControl={
                      <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        className="text-slate-500 transition-colors hover:text-[#0b8276]"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    }
                  />
                  {formData.password && (
                    <div className="mt-2 space-y-1">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                          className={`h-full rounded-full transition-all ${
                            passwordStrength <= 1
                              ? 'w-1/4 bg-orange-500'
                              : passwordStrength === 2
                              ? 'w-2/4 bg-yellow-500'
                              : passwordStrength === 3
                              ? 'w-3/4 bg-teal-500'
                              : 'w-full bg-green-600'
                          }`}
                        />
                      </div>
                      <p className="text-[11px] text-slate-400">Use 8+ chars with uppercase, number, and special character.</p>
                    </div>
                  )}
                </div>

                <Field
                  icon={<Lock className="h-4 w-4" />}
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(v) => handleChange('confirmPassword', v)}
                  placeholder="Re-enter password"
                  submitted={submitted}
                  isValid={formData.confirmPassword && formData.password === formData.confirmPassword}
                  errorMessage="Passwords do not match"
                  rightControl={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((p) => !p)}
                      className="text-slate-500 transition-colors hover:text-[#0b8276]"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                />
                {formData.password && formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <span className="text-xs font-medium text-[#0b8276] -mt-2">✓ Passwords match</span>
                )}
              </form>
            </div>

            {/* Footer Section - Static with Terms and Button */}
            <div className="p-5 sm:p-8 pt-0 flex-shrink-0">
              <label className="flex items-start gap-2 text-xs text-slate-500 cursor-pointer mb-4">
                <input
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(e) => handleChange('agreeToTerms', e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#0b8276] focus:ring-[#0b8276]/20"
                />
                I agree to the Terms and Privacy Policy for instructor account access.
              </label>

              {submitted && !isFormValid && (
                <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600 mb-3">
                  Please fill all fields correctly and confirm terms before submitting.
                </p>
              )}

              <button 
                type="submit" 
                onClick={handleSubmit}
                disabled={!isFormValid || loading} 
                className="w-full border-0 rounded-md bg-[#ff8a33] text-white text-base font-bold p-3.5 cursor-pointer transition-all hover:bg-[#e57a23] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Creating Instructor Account...' : 'Create Instructor Account'}
              </button>
              {error && <p className="text-xs font-medium text-red-500 text-center mt-3">{error}</p>}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

function Field({ icon, label, type = 'text', value, onChange, placeholder, rightControl, submitted, errorMessage, isValid }) {
  return (
    <div>
      <label className="flex flex-col gap-2">
        <span className="text-[#111b2f] text-sm font-semibold">{label}</span>
        <div className={`border rounded-md p-3.5 text-sm text-[#111b2f] outline-none transition-all flex items-center gap-2 ${
          submitted && !isValid 
            ? 'border-red-500 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/20' 
            : 'border-gray-200 focus-within:border-[#0b8276] focus-within:ring-2 focus-within:ring-[#0b8276]/20'
        }`}>
          <span className="text-slate-400">{icon}</span>
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-transparent text-[14px] text-[#111b2f] placeholder:text-slate-400 focus:outline-none"
          />
          {rightControl && <span className="shrink-0">{rightControl}</span>}
        </div>
        {submitted && !isValid && (
          <span className="text-xs font-medium text-red-500">{errorMessage}</span>
        )}
      </label>
    </div>
  )
}