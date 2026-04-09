import React, { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, BookOpen, Lock, Eye, EyeOff, CheckCircle2, GraduationCap } from 'lucide-react'
import { api, getDashboardPathByRole, setAuthSession } from '../lib/api'

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const PHONE_REGEX = /^\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}$/

export default function InstructorSignup() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    expertise: '',
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
    if (!isFormValid) return
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
        } else {
          throw registerErr
        }
      }
      setAuthSession(data.access_token, data.role, data.tenant_id)
      navigate(getDashboardPathByRole(data.role))
    } catch (err) {
      setError(err.message || 'Instructor signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden overflow-y-auto bg-gradient-to-br from-[#0e7c67] via-[#1a5c3a] to-[#0e5c4a] p-4 font-['Inter',_'Segoe_UI',_Roboto,_sans-serif] sm:p-6 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-[1300px] grid-cols-1 items-start gap-8 lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[1fr_460px] lg:items-center lg:gap-13">
        {/* Left Section - Brand Section */}
        <section className="text-white">
          <div className="inline-flex items-center gap-2 rounded-[12px] bg-white/15 px-3 py-1.5 text-[12px] font-semibold text-[#ffb76a]">
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
        <section className="relative mx-auto w-full max-w-[520px] lg:h-full lg:max-w-none">
          <div className="relative flex w-full flex-col rounded-2xl bg-white p-5 shadow-2xl sm:p-8 lg:h-full lg:max-h-[880px] lg:p-10">
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

            <div className="mt-6 flex-1 overflow-y-auto pr-1">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Field
                  icon={<User className="h-4 w-4" />}
                  label="Full Name"
                  value={formData.fullName}
                  onChange={(v) => handleChange('fullName', v)}
                  placeholder="Enter full name"
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
                  placeholder="you@example.com"
                  submitted={submitted}
                  errorMessage="Enter a valid email address"
                  isValid={isEmailValid}
                />

                <div>
                  <label className="flex flex-col gap-2">
                    <span className="text-[#111b2f] text-sm font-semibold">Phone Number</span>
                    <div className="border border-gray-200 rounded-md p-3.5 text-sm text-[#111b2f] outline-none transition-all focus-within:border-[#0b8276] focus-within:ring-2 focus-within:ring-[#0b8276]/20 flex items-center gap-2">
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(123) 456-7890"
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
                </div>

                <Field
                  icon={<Lock className="h-4 w-4" />}
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(v) => handleChange('confirmPassword', v)}
                  placeholder="Re-enter password"
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
                {submitted && formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <span className="text-xs font-medium text-red-500 -mt-2">Passwords do not match.</span>
                )}
                {formData.password && formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <span className="text-xs font-medium text-[#0b8276] -mt-2">✓ Passwords match</span>
                )}

                <label className="flex items-start gap-2 text-xs text-slate-500 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={(e) => handleChange('agreeToTerms', e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#0b8276] focus:ring-[#0b8276]/20"
                  />
                  I agree to the Terms and Privacy Policy for instructor account access.
                </label>

                {submitted && !isFormValid && (
                  <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                    Please fill all fields correctly and confirm terms before submitting.
                  </p>
                )}

                <button 
                  type="submit" 
                  disabled={!isFormValid || loading} 
                  className="border-0 rounded-md bg-[#ff8a33] text-white text-base font-bold p-3.5 cursor-pointer mt-1 transition-all hover:bg-[#e57a23] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Creating Instructor Account...' : 'Create Instructor Account'}
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

function Field({ icon, label, type = 'text', value, onChange, placeholder, rightControl, submitted, errorMessage, isValid }) {
  return (
    <div>
      <label className="flex flex-col gap-2">
        <span className="text-[#111b2f] text-sm font-semibold">{label}</span>
        <div className={`border rounded-md p-3.5 text-sm text-[#111b2f] outline-none transition-all flex items-center gap-2 ${
          submitted && !isValid 
            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
            : 'border-gray-200 focus:border-[#0b8276] focus:ring-2 focus:ring-[#0b8276]/20'
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