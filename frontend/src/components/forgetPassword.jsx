import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export default function ForgetPassword() {
    const [email, setEmail] = useState('')
    const [submitted, setSubmitted] = useState(false)

    const isEmailValid = EMAIL_REGEX.test(email)

    return (
        <div className="min-h-screen w-full overflow-x-hidden overflow-y-auto bg-gradient-to-br from-[#1c113b] via-[#3a2286] to-[#5d3df0] p-4 font-[Inter,_'Segoe_UI',_Roboto,_sans-serif] sm:p-6 lg:p-8">
            <div className="mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-[1300px] grid-cols-1 items-start gap-8 lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[1fr_460px] lg:items-center lg:gap-13">
                <section className="text-white">
                    <h1 className="m-0 text-[64px] leading-[1.15] font-extrabold tracking-[-1.2px] whitespace-pre-line max-lg:text-[44px] max-sm:text-[34px]">
                        Reset Access to{`\n`}Your Learning{`\n`}
                        <span className="text-[#ff8a33]">Account Securely</span>
                    </h1>
                    <p className="mt-5.5 max-w-[490px] text-lg leading-relaxed text-white/70">
                        Enter your registered email and we will send a secure reset link so you can get back to your LMS dashboard quickly.
                    </p>
                    <ul className="mt-8 p-0 list-none flex flex-col gap-4">
                        <li className="flex items-center gap-3 text-base">
                            <span className="w-8 h-8 rounded-full inline-flex items-center justify-center bg-white/15 text-[#ff8a33] font-bold">✓</span>
                            Fast reset link delivery
                        </li>
                        <li className="flex items-center gap-3 text-base">
                            <span className="w-8 h-8 rounded-full inline-flex items-center justify-center bg-white/15 text-[#ff8a33] font-bold">✓</span>
                            Secure and verified workflow
                        </li>
                        <li className="flex items-center gap-3 text-base">
                            <span className="w-8 h-8 rounded-full inline-flex items-center justify-center bg-white/15 text-[#ff8a33] font-bold">✓</span>
                            Works across all roles
                        </li>
                    </ul>
                </section>

                <section className="relative mx-auto w-full max-w-[520px] lg:h-full lg:max-w-none">
                    <div className="relative flex w-full flex-col rounded-2xl bg-white p-5 shadow-2xl sm:p-8 lg:h-full lg:max-h-[820px] lg:p-10">
                        <Link to="/login" className="mb-6 text-sm font-semibold text-[#5d3df0] no-underline">
                            Back to login
                        </Link>

                        <h2 className="m-0 text-[#0b1020] text-[30px] leading-[1.15] font-extrabold">Forgot password?</h2>
                        <p className="mt-2 text-[#6b7480] text-sm">
                            Enter the email associated with your account and we will send you a reset link.
                        </p>

                        <form className="mt-6 flex flex-col gap-4" onSubmit={(event) => { event.preventDefault(); setSubmitted(true) }}>
                            <label className="flex flex-col gap-2">
                                <span className="text-[#0b1020] text-sm font-semibold">Email Address</span>
                                <input
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    className="border border-black/10 rounded-md p-3.5 text-sm text-[#0b1020] outline-none focus:border-[#5a3bd6] focus:ring-3 focus:ring-[#5a3bd6]/20"
                                />
                                {submitted && !isEmailValid ? <span className="text-xs font-medium text-[#dc2626]">Enter a valid email address.</span> : null}
                            </label>

                            <div className="rounded-xl bg-gray-100 p-4 text-[13px] text-[#6b7280]">
                                Reset instructions typically arrive within a few minutes. Check spam if you do not see the email.
                            </div>

                            <button type="submit" disabled={!isEmailValid} className="border-0 rounded-md bg-[#ff8a33] text-white text-base font-bold p-3.5 cursor-pointer mt-1 disabled:cursor-not-allowed disabled:opacity-60">
                                Send reset link
                            </button>

                            <p className="text-center text-[13px] text-[#6b7480]">
                                Remembered your password?{' '}
                                <Link to="/login" className="font-semibold text-[#5d3df0] no-underline">
                                    Back to login
                                </Link>
                            </p>
                        </form>
                    </div>
                </section>
            </div>
        </div>
    )
}