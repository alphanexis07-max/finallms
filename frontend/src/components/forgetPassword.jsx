import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import { Sparkles, CheckCircle2, Mail, ArrowLeft } from 'lucide-react'

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const BENEFITS = ['Multi-Tenant LMS System', 'Live & Recorded Learning', 'Secure Payments Integration']

export default function ForgetPassword() {
    const [email, setEmail] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const isEmailValid = EMAIL_REGEX.test(email)

    const handleSubmit = async (event) => {
        event.preventDefault()
        setSubmitted(true)
        if (!isEmailValid) {
            return
        }

        setLoading(true)
        setError('')
        setSuccess(false)

        try {
            await api('/auth/forgot-password', {
                method: 'POST',
                body: JSON.stringify({ email: email.trim() }),
            })

            setSuccess(true)
            setEmail('')
            setSubmitted(false)
        } catch (err) {
            setError(err.message || 'Failed to send reset email. Please try again.')
            console.error('Forgot password error:', err)
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
                        Reset Access to Your <span className="text-[#ff8a33]">Learning Account</span>
                    </h1>

                    <p className="mt-6 text-[16px] leading-relaxed text-white/70 sm:text-[18px]">
                        Multi-tenant LMS SaaS platform designed for institutes, educators, and learners.
                        We'll help you securely regain access to your account.
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

                {/* Right Side - Forgot Password Form */}
                <div className="w-full max-w-[480px]">
                    <div className="rounded-2xl border border-white/10 bg-white p-6 shadow-2xl sm:p-8">
                        <div className="mb-6">
                            <Link to="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0b8276] transition-colors hover:text-[#096b61] hover:underline">
                                <ArrowLeft className="h-4 w-4" />
                                Back to login
                            </Link>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-2xl font-extrabold text-[#111b2f] sm:text-3xl">Forgot password?</h2>
                            <p className="mt-2 text-sm text-slate-500">
                                Enter the email associated with your account and we'll send you a reset link.
                            </p>
                        </div>

                        {success ? (
                            <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-5">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                                        <CheckCircle2 className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-green-900">Check your email</h3>
                                        <p className="mt-1 text-sm text-green-700">
                                            We've sent a password reset link to <span className="font-medium">{email}</span>
                                        </p>
                                        <p className="mt-2 text-sm text-green-700">
                                            The link will expire in 24 hours. Didn't receive it? Check your spam folder or{' '}
                                            <button
                                                onClick={() => {
                                                    setSuccess(false)
                                                    setEmail('')
                                                    setError('')
                                                }}
                                                className="inline font-semibold text-green-700 underline hover:text-green-900"
                                            >
                                                try again
                                            </button>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-[#111b2f]">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <input
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value)
                                                setSubmitted(false)
                                                setError('')
                                            }}
                                            type="email"
                                            placeholder="Enter your registered email"
                                            className="h-12 w-full rounded-xl border border-gray-200 pl-10 pr-4 text-sm text-gray-900 outline-none transition-all focus:border-[#0b8276] focus:ring-2 focus:ring-[#0b8276]/20 disabled:bg-gray-50 disabled:cursor-not-allowed"
                                            disabled={loading}
                                        />
                                    </div>
                                    {submitted && !isEmailValid && (
                                        <p className="mt-1.5 text-xs font-medium text-red-500">Enter a valid email address.</p>
                                    )}
                                </div>

                                {error && (
                                    <div className="rounded-xl border border-red-200 bg-red-50 p-3">
                                        <p className="text-xs text-red-700">{error}</p>
                                    </div>
                                )}

                                <div className="rounded-xl bg-gray-100 p-3 text-[13px] text-gray-600">
                                    <p>Reset instructions typically arrive within a few minutes. Check spam if you don't see the email.</p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={!isEmailValid || loading}
                                    className="h-12 w-full rounded-xl bg-[#ff8a33] font-semibold text-white transition-all hover:bg-[#e57a23] focus:ring-2 focus:ring-[#ff8a33]/50 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {loading ? 'Sending...' : 'Send reset link'}
                                </button>

                                <p className="text-center text-sm text-gray-500">
                                    Remembered your password?{' '}
                                    <Link to="/login" className="font-semibold text-[#0b8276] transition-colors hover:text-[#096b61] hover:underline">
                                        Back to login
                                    </Link>
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}