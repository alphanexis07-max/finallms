import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '../lib/api'

const PASSWORD_MIN_LENGTH = 8
const PASSWORD_REGEX = /^.{8,}$/ // At least 8 characters

export default function ResetPassword() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    
    const [token, setToken] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [validatingToken, setValidatingToken] = useState(true)
    const [tokenValid, setTokenValid] = useState(false)

    useEffect(() => {
        const tokenFromUrl = searchParams.get('token')
        if (!tokenFromUrl) {
            setError('No reset token provided. Please check your email and click the link again.')
            setValidatingToken(false)
            return
        }
        
        setToken(tokenFromUrl)
        setTokenValid(true)
        setValidatingToken(false)
    }, [searchParams])

    const isPasswordValid = PASSWORD_REGEX.test(newPassword)
    const passwordsMatch = newPassword === confirmPassword
    const canSubmit = isPasswordValid && passwordsMatch && !loading

    const handleSubmit = async (event) => {
        event.preventDefault()
        
        if (!canSubmit) {
            return
        }

        setLoading(true)
        setError('')

        try {
            await api('/auth/reset-password', {
                method: 'POST',
                body: JSON.stringify({
                    token: token,
                    new_password: newPassword
                }),
            })

            setSuccess(true)
            setTimeout(() => {
                navigate('/login')
            }, 2000)
        } catch (err) {
            setError(err.message || 'Failed to reset password. Please try again.')
            console.error('Reset password error:', err)
        } finally {
            setLoading(false)
        }
    }

    if (validatingToken) {
        return (
            <div className="min-h-screen w-full bg-gradient-to-br from-[#1c113b] via-[#3a2286] to-[#5d3df0] p-4 flex items-center justify-center">
                <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-[400px] w-full">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-[#ff8a33] border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-[#6b7480]">Validating reset link...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (!tokenValid) {
        return (
            <div className="min-h-screen w-full overflow-x-hidden overflow-y-auto bg-gradient-to-br from-[#1c113b] via-[#3a2286] to-[#5d3df0] p-4 font-[Inter,_'Segoe_UI',_Roboto,_sans-serif] sm:p-6 lg:p-8">
                <div className="mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-[1300px] grid-cols-1 items-center lg:grid-cols-[1fr_460px] lg:gap-13">
                    <section className="text-white">
                        <h1 className="m-0 text-[64px] leading-[1.15] font-extrabold tracking-[-1.2px] whitespace-pre-line max-lg:text-[44px] max-sm:text-[34px]">
                            Reset Link{`\n`}Not Found
                        </h1>
                        <p className="mt-5.5 max-w-[490px] text-lg leading-relaxed text-white/70">
                            The reset link is missing or has expired. Please request a new one.
                        </p>
                    </section>

                    <section className="relative mx-auto w-full max-w-[520px] mt-8 lg:mt-0">
                        <div className="relative flex w-full flex-col rounded-2xl bg-white p-8 shadow-2xl">
                            <div className="flex items-start gap-3 mb-6">
                                <span className="text-red-600 text-3xl">✕</span>
                                <div>
                                    <h2 className="m-0 text-[#0b1020] text-[20px] font-extrabold">Invalid Reset Link</h2>
                                    <p className="text-[#6b7480] text-sm mt-2">{error}</p>
                                </div>
                            </div>

                            <Link
                                to="/forgot-password"
                                className="border-0 rounded-md bg-[#ff8a33] text-white text-base font-bold p-3.5 text-center no-underline cursor-pointer mb-4"
                            >
                                Request New Reset Link
                            </Link>

                            <Link
                                to="/login"
                                className="font-semibold text-[#5d3df0] no-underline text-center"
                            >
                                Back to Login
                            </Link>
                        </div>
                    </section>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen w-full overflow-x-hidden overflow-y-auto bg-gradient-to-br from-[#1c113b] via-[#3a2286] to-[#5d3df0] p-4 font-[Inter,_'Segoe_UI',_Roboto,_sans-serif] sm:p-6 lg:p-8">
            <div className="mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-[1300px] grid-cols-1 items-start gap-8 lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[1fr_460px] lg:items-center lg:gap-13">
                <section className="text-white">
                    <h1 className="m-0 text-[64px] leading-[1.15] font-extrabold tracking-[-1.2px] whitespace-pre-line max-lg:text-[44px] max-sm:text-[34px]">
                        Create a{`\n`}New Password{`\n`}
                        <span className="text-[#ff8a33]">For Your Account</span>
                    </h1>
                    <p className="mt-5.5 max-w-[490px] text-lg leading-relaxed text-white/70">
                        Enter a strong new password to regain access to your LMS account.
                    </p>
                    <ul className="mt-8 p-0 list-none flex flex-col gap-4">
                        <li className="flex items-center gap-3 text-base">
                            <span className="w-8 h-8 rounded-full inline-flex items-center justify-center bg-white/15 text-[#ff8a33] font-bold">✓</span>
                            Minimum 8 characters
                        </li>
                        <li className="flex items-center gap-3 text-base">
                            <span className="w-8 h-8 rounded-full inline-flex items-center justify-center bg-white/15 text-[#ff8a33] font-bold">✓</span>
                            Use numbers and special characters
                        </li>
                        <li className="flex items-center gap-3 text-base">
                            <span className="w-8 h-8 rounded-full inline-flex items-center justify-center bg-white/15 text-[#ff8a33] font-bold">✓</span>
                            Secure and encrypted
                        </li>
                    </ul>
                </section>

                <section className="relative mx-auto w-full max-w-[520px] lg:h-full lg:max-w-none">
                    <div className="relative flex w-full flex-col rounded-2xl bg-white p-5 shadow-2xl sm:p-8 lg:h-full lg:max-h-[820px] lg:p-10">
                        <Link to="/login" className="mb-6 text-sm font-semibold text-[#5d3df0] no-underline">
                            Back to login
                        </Link>

                        <h2 className="m-0 text-[#0b1020] text-[30px] leading-[1.15] font-extrabold">Reset password</h2>
                        <p className="mt-2 text-[#6b7480] text-sm">
                            Create a new password for your account
                        </p>

                        {success ? (
                            <div className="mt-6 flex flex-col gap-4 p-4 rounded-lg bg-green-50 border border-green-200">
                                <div className="flex items-start gap-3">
                                    <span className="text-green-600 text-2xl">✓</span>
                                    <div>
                                        <h3 className="font-semibold text-green-900">Password reset successful!</h3>
                                        <p className="text-sm text-green-700 mt-2">
                                            Your password has been updated. Redirecting to login...
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
                                <label className="flex flex-col gap-2">
                                    <span className="text-[#0b1020] text-sm font-semibold">New Password</span>
                                    <input
                                        type="password"
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(event) => {
                                            setNewPassword(event.target.value)
                                            setError('')
                                        }}
                                        disabled={loading}
                                        className="border border-black/10 rounded-md p-3.5 text-sm text-[#0b1020] outline-none focus:border-[#5a3bd6] focus:ring-3 focus:ring-[#5a3bd6]/20 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    />
                                    {newPassword && !isPasswordValid && (
                                        <span className="text-xs font-medium text-[#dc2626]">Password must be at least {PASSWORD_MIN_LENGTH} characters long.</span>
                                    )}
                                </label>

                                <label className="flex flex-col gap-2">
                                    <span className="text-[#0b1020] text-sm font-semibold">Confirm Password</span>
                                    <input
                                        type="password"
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(event) => {
                                            setConfirmPassword(event.target.value)
                                            setError('')
                                        }}
                                        disabled={loading}
                                        className="border border-black/10 rounded-md p-3.5 text-sm text-[#0b1020] outline-none focus:border-[#5a3bd6] focus:ring-3 focus:ring-[#5a3bd6]/20 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    />
                                    {confirmPassword && newPassword && !passwordsMatch && (
                                        <span className="text-xs font-medium text-[#dc2626]">Passwords do not match.</span>
                                    )}
                                </label>

                                {error && (
                                    <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                                        <p className="text-xs text-red-700">{error}</p>
                                    </div>
                                )}

                                <div className="rounded-xl bg-blue-50 p-4 text-[13px] text-blue-700 border border-blue-200">
                                    <strong>Password Requirements:</strong>
                                    <ul className="mt-2 ml-4 list-disc">
                                        <li>Minimum 8 characters</li>
                                        <li>Mix of uppercase and lowercase letters recommended</li>
                                        <li>Include numbers and special characters for better security</li>
                                    </ul>
                                </div>

                                <button
                                    type="submit"
                                    disabled={!canSubmit}
                                    className="border-0 rounded-md bg-[#ff8a33] text-white text-base font-bold p-3.5 cursor-pointer mt-2 disabled:cursor-not-allowed disabled:opacity-60 transition-all"
                                >
                                    {loading ? 'Resetting Password...' : 'Reset Password'}
                                </button>

                                <p className="text-center text-[13px] text-[#6b7480]">
                                    Remember your password?{' '}
                                    <Link to="/login" className="font-semibold text-[#5d3df0] no-underline">
                                        Go back to login
                                    </Link>
                                </p>
                            </form>
                        )}
                    </div>
                </section>
            </div>
        </div>
    )
}
