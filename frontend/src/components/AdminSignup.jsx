import React, { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Building2, Lock, Eye, EyeOff, CheckCircle2, ShieldCheck } from 'lucide-react'
import { api, getDashboardPathByRole, setAuthSession } from '../lib/api'

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const PHONE_REGEX = /^\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}$/

export default function AdminSignup() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: '',
    instituteName: '',
    email: '',
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
    formData.instituteName.trim() &&
    isEmailValid &&
    isPhoneValid &&
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword &&
    formData.agreeToTerms

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const buildTenantId = (name) => {
    const base = String(name || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    return `${base || 'tenant'}-${Date.now().toString().slice(-6)}`
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
            role: 'admin',
            tenant_id: buildTenantId(formData.instituteName),
            phone,
          }),
        })
      } catch (registerErr) {
        if ((registerErr?.message || '').toLowerCase().includes('email already exists')) {
          data = await api('/auth/login', {
            method: 'POST',
            body: JSON.stringify({
              email: formData.email,
              password: formData.password,
            }),
          })
        } else {
          throw registerErr
        }
      }
      setAuthSession(data.access_token, data.role, data.tenant_id)
      navigate('/login')
    } catch (err) {
      setError(err.message || 'Admin signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen w-full overflow-hidden bg-gradient-to-br from-[#0e7c67] via-[#1a5c3a] to-[#0e5c4a] p-4 font-['Inter',_'Segoe_UI',_Roboto,_sans-serif] sm:p-6 lg:p-8">
      <div className="mx-auto grid h-full w-full max-w-[1300px] grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_460px] lg:gap-13">
        {/* Left Section - Brand Section (Hidden on mobile) */}
        <section className="hidden text-white lg:block">
          <div className="inline-flex items-center gap-2 rounded-[12px] bg-white/15 px-3 py-1.5 text-[12px] font-semibold text-[#ffb76a]">
            <ShieldCheck className="h-4 w-4" />
            Admin Onboarding
          </div>

          <h1 className="m-0 mt-4 text-[44px] leading-[1.12] font-extrabold tracking-[-1.2px] whitespace-pre-line sm:text-[54px] lg:text-[64px]">
            Manage Your{`\n`}Institute with{`\n`}
            <span className="text-[#ff8a33]">Smart Admin Tools</span>
          </h1>

          <p className="mt-5.5 max-w-[490px] text-base leading-relaxed text-white/70 sm:text-lg">
            Sign up as institute admin to manage courses, instructors, students, live classes, and payments from one LMS dashboard.
          </p>

          <ul className="mt-8 p-0 list-none flex flex-col gap-4">
            {[
              'Set up and publish your course catalog',
              'Assign instructors and monitor classes',
              'Track enrollments, payments, and performance',
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

        {/* Card Section - Admin Signup Form */}
        <section className="relative mx-auto w-full max-w-[520px]">
          <div className="relative flex h-[90vh] max-h-[800px] w-full flex-col rounded-2xl bg-white shadow-2xl">
            {/* Static Header */}
            <div className="flex-shrink-0 p-5 sm:p-8 pb-0">
              <div className="flex gap-1.5 p-1.5 rounded-xl bg-gray-100 mb-7">
                <Link
                  to="/login"
                  className="flex-1 text-center border-0 rounded-lg py-3 px-2.5 bg-transparent text-gray-600 text-sm font-semibold cursor-pointer no-underline transition-all hover:bg-gray-200 hover:text-gray-900"
                >
                  Login
                </Link>
                <button type="button" className="flex-1 border-0 rounded-lg py-3 px-2.5 bg-[#ff8a33] text-white shadow-sm text-sm font-semibold cursor-pointer transition-all hover:bg-[#e57a23]">
                  Admin Sign Up
                </button>
              </div>

              <h2 className="m-0 text-[#111b2f] text-2xl sm:text-[30px] leading-[1.15] font-extrabold">Create Admin Account</h2>
              <p className="mt-2 text-slate-500 text-sm">Fill details to set up your admin account.</p>
            </div>

            {/* Scrollable Form Fields (only form inputs) */}
            <div className="flex-1 overflow-y-auto px-5 sm:px-8">
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
                  icon={<Building2 className="h-4 w-4" />}
                  label="Institute Name"
                  value={formData.instituteName}
                  onChange={(v) => handleChange('instituteName', v)}
                  placeholder="Enter institute name"
                  submitted={submitted}
                  errorMessage="Institute name is required"
                  isValid={formData.instituteName.trim()}
                />

                <Field
                  icon={<Mail className="h-4 w-4" />}
                  label="Work Email"
                  type="email"
                  value={formData.email}
                  onChange={(v) => handleChange('email', v)}
                  placeholder="admin@institute.com"
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
                        : 'border-gray-200 focus:border-[#0b8276] focus:ring-2 focus:ring-[#0b8276]/20'
                    }`}>
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
              </form>
            </div>

            {/* Static Footer with Terms, Error, and Button */}
            <div className="flex-shrink-0 p-5 sm:p-8 pt-0">
              <label className="flex items-start gap-2 text-xs text-slate-500 cursor-pointer mb-4">
                <input
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(e) => handleChange('agreeToTerms', e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#0b8276] focus:ring-[#0b8276]/20"
                />
                I agree to the Terms and Privacy Policy for admin account access.
              </label>

              {submitted && !isFormValid && (
                <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600 mb-4">
                  Please fill all fields correctly and confirm terms before submitting.
                </p>
              )}

              <button 
                type="submit" 
                onClick={handleSubmit}
                disabled={!isFormValid || loading} 
                className="w-full border-0 rounded-md bg-[#ff8a33] text-white text-base font-bold p-3.5 cursor-pointer transition-all hover:bg-[#e57a23] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Creating Admin Account...' : 'Create Admin Account'}
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